import crypto from 'node:crypto';

import { env } from '../../../config/env.js';

import type {
  WebhookResult,
  PaymentProvider,
  PaymentVerifyResult,
  PaymentRefundResult,
  PaymentInitiateParams,
  PaymentInitiateResult,
} from './payment.interface.js';

interface EsewaCallbackData {
  transaction_code: string;
  status: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
}

interface EsewaStatusResponse {
  product_code: string;
  transaction_uuid: string;
  total_amount: number;
  status:
    | 'COMPLETE'
    | 'PENDING'
    | 'FULL_REFUND'
    | 'PARTIAL_REFUND'
    | 'AMBIGUOUS'
    | 'NOT_FOUND'
    | 'CANCELED';
  ref_id: string;
}

export class EsewaProvider implements PaymentProvider {
  readonly name = 'esewa';

  private readonly merchantCode: string;
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.merchantCode = env.ESEWA_MERCHANT_CODE;
    this.secretKey = env.ESEWA_SECRET_KEY;
    this.baseUrl = env.ESEWA_BASE_URL;
  }

  private generateSignature(message: string): string {
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(message);
    return hmac.digest('base64');
  }

  private verifySignature(message: string, signature: string): boolean {
    const expected = this.generateSignature(message);
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  }

  async initiate(params: PaymentInitiateParams): Promise<PaymentInitiateResult> {
    try {
      const transactionUuid = `${params.orderId}-${Date.now()}`;
      const totalAmount = params.amount.toString();
      const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${this.merchantCode}`;
      const signature = this.generateSignature(message);

      const formUrl = `${this.baseUrl}/api/epay/main/v2/form`;

      const formData = {
        amount: totalAmount,
        tax_amount: '0',
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: this.merchantCode,
        product_service_charge: '0',
        product_delivery_charge: '0',
        success_url: params.successUrl,
        failure_url: params.failureUrl,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature,
      };

      return {
        success: true,
        paymentUrl: formUrl,
        transactionId: transactionUuid,
        formData,
      } as PaymentInitiateResult & { formData: Record<string, string> };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: `eSewa initiation failed: ${message}` };
    }
  }

  async verify(transactionId: string, amount?: number): Promise<PaymentVerifyResult> {
    try {
      const statusUrl = new URL('https://esewa.com.np/api/epay/transaction/status/');
      if (this.baseUrl.includes('rc-epay')) {
        statusUrl.hostname = 'rc.esewa.com.np';
        statusUrl.pathname = '/api/epay/transaction/status/';
      }
      statusUrl.searchParams.set('product_code', this.merchantCode);
      statusUrl.searchParams.set('total_amount', (amount ?? 0).toString());
      statusUrl.searchParams.set('transaction_uuid', transactionId);

      const response = await fetch(statusUrl.toString());
      if (!response.ok) {
        return {
          success: false,
          verified: false,
          transactionId,
          error: `eSewa status API returned ${response.status}`,
        };
      }

      const data: EsewaStatusResponse = await response.json();

      return {
        success: true,
        verified: data.status === 'COMPLETE',
        transactionId: data.ref_id || transactionId,
        amount: data.total_amount,
        status: data.status,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        verified: false,
        transactionId,
        error: `eSewa verification failed: ${message}`,
      };
    }
  }

  async refund(transactionId: string, _amount?: number): Promise<PaymentRefundResult> {
    return {
      success: false,
      refunded: false,
      transactionId,
      error: 'eSewa refunds must be processed through the merchant portal',
    };
  }

  async handleWebhook(payload: unknown): Promise<WebhookResult> {
    const data = this.decodeCallbackData(payload as string);

    const message = data.signed_field_names
      .split(',')
      .map((field) => `${field}=${(data as Record<string, string>)[field]}`)
      .join(',');

    if (!this.verifySignature(message, data.signature)) {
      throw new Error('Invalid eSewa webhook signature');
    }

    const statusMap: Record<string, 'paid' | 'failed' | 'refunded'> = {
      COMPLETE: 'paid',
      FULL_REFUND: 'refunded',
      PARTIAL_REFUND: 'refunded',
      CANCELED: 'failed',
      PENDING: 'failed',
      AMBIGUOUS: 'failed',
      NOT_FOUND: 'failed',
    };

    return {
      verified: true,
      orderId: data.transaction_uuid.split('-')[0],
      transactionId: data.transaction_code || data.transaction_uuid,
      status: statusMap[data.status] || 'failed',
      amount: parseFloat(data.total_amount),
    };
  }

  decodeCallbackData(encodedData: string): EsewaCallbackData {
    const decoded = Buffer.from(encodedData, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }
}

export const esewaProvider = new EsewaProvider();
