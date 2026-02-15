import { env } from '../../../config/env.js';

import type {
  WebhookResult,
  PaymentProvider,
  PaymentVerifyResult,
  PaymentRefundResult,
  PaymentInitiateParams,
  PaymentInitiateResult,
} from './payment.interface.js';

interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: 'Completed' | 'Pending' | 'Initiated' | 'Refunded' | 'Expired' | 'User canceled';
  transaction_id: string;
  fee: number;
  refunded: boolean;
}

export class KhaltiProvider implements PaymentProvider {
  readonly name = 'khalti';

  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.secretKey = env.KHALTI_SECRET_KEY || '';
    this.baseUrl = `${env.KHALTI_BASE_URL}/api/v2`;
  }

  async initiate(params: PaymentInitiateParams): Promise<PaymentInitiateResult> {
    try {
      const amountInPaisa = Math.round(params.amount * 100);

      const payload = {
        return_url: params.successUrl,
        website_url: params.failureUrl,
        amount: amountInPaisa,
        purchase_order_id: params.orderId,
        purchase_order_name: params.productName || `Order ${params.orderId}`,
        customer_info: {
          name: params.customerName,
          email: params.customerEmail || '',
          phone: params.customerPhone || '',
        },
      };

      const response = await fetch(`${this.baseUrl}/epayment/initiate/`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          success: false,
          error: `Khalti initiation failed: ${response.status} ${errorBody}`,
        };
      }

      const data = (await response.json()) as KhaltiInitiateResponse;

      return {
        success: true,
        paymentUrl: data.payment_url,
        transactionId: data.pidx,
      };
    } catch (error) {
      return {
        success: false,
        error: `Khalti initiation error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  async verify(transactionId: string): Promise<PaymentVerifyResult> {
    try {
      const response = await fetch(`${this.baseUrl}/epayment/lookup/`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pidx: transactionId }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          success: false,
          verified: false,
          transactionId,
          error: `Khalti lookup failed: ${response.status} ${errorBody}`,
        };
      }

      const data = (await response.json()) as KhaltiLookupResponse;
      const verified = data.status === 'Completed';

      return {
        success: true,
        verified,
        transactionId: data.transaction_id || transactionId,
        amount: data.total_amount / 100,
        status: this.mapStatus(data.status),
      };
    } catch (error) {
      return {
        success: false,
        verified: false,
        transactionId,
        error: `Khalti verify error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  async refund(transactionId: string, _amount?: number): Promise<PaymentRefundResult> {
    return {
      success: false,
      refunded: false,
      transactionId,
      error: 'Khalti refunds must be processed through the merchant dashboard',
    };
  }

  async handleWebhook(payload: unknown): Promise<WebhookResult> {
    const body = payload as {
      pidx: string;
      purchase_order_id: string;
      total_amount: number;
      status: string;
      transaction_id: string;
    };

    const verifyResult = await this.verify(body.pidx);

    return {
      verified: verifyResult.verified,
      orderId: body.purchase_order_id,
      transactionId: body.transaction_id || body.pidx,
      status: this.mapStatus(verifyResult.status || body.status) as 'paid' | 'failed' | 'refunded',
      amount: (body.total_amount || 0) / 100,
    };
  }

  private mapStatus(khaltiStatus: string): string {
    const statusMap: Record<string, string> = {
      Completed: 'paid',
      Pending: 'pending',
      Initiated: 'pending',
      Refunded: 'refunded',
      Expired: 'failed',
      'User canceled': 'failed',
    };
    return statusMap[khaltiStatus] || 'unknown';
  }
}

export const khaltiProvider = new KhaltiProvider();
