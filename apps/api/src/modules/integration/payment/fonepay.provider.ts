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

export class FonepayProvider implements PaymentProvider {
  readonly name = 'fonepay';

  private readonly merchantCode: string;
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.merchantCode = env.FONEPAY_MERCHANT_CODE || '';
    this.secretKey = env.FONEPAY_SECRET_KEY || '';
    this.baseUrl = env.FONEPAY_BASE_URL;
  }

  async initiate(params: PaymentInitiateParams): Promise<PaymentInitiateResult> {
    try {
      const prn = params.orderId;
      const amt = params.amount.toFixed(2);
      const dt = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      const r1 = 'P';
      const r2 = 'fonepay';
      const ru = params.successUrl;
      const cu = 'NPR';

      const signatureString = `${this.merchantCode},${prn},${amt},${cu},${dt},${r1},${r2},${ru}`;
      const dv = this.generateHmac(signatureString);

      const queryParams = new URLSearchParams({
        PID: this.merchantCode,
        PRN: prn,
        AMT: amt,
        CRN: cu,
        DT: dt,
        R1: r1,
        R2: r2,
        RU: ru,
        DV: dv,
        MD: 'Q',
      });

      const paymentUrl = `${this.baseUrl}/api/merchantRequest?${queryParams.toString()}`;

      return {
        success: true,
        paymentUrl,
        transactionId: prn,
      };
    } catch (error) {
      return {
        success: false,
        error: `Fonepay initiation error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  async verify(transactionId: string): Promise<PaymentVerifyResult> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/merchantRequest/verify?PRN=${transactionId}&PID=${this.merchantCode}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        return {
          success: false,
          verified: false,
          transactionId,
          error: `Fonepay verify failed: ${response.status}`,
        };
      }

      const data = (await response.json()) as {
        statusCode: number;
        message: string;
        prn: string;
        transactionId: string;
        amount: number;
      };

      const verified = data.statusCode === 0;

      return {
        success: true,
        verified,
        transactionId: data.transactionId || transactionId,
        amount: data.amount,
        status: verified ? 'paid' : 'failed',
      };
    } catch (error) {
      return {
        success: false,
        verified: false,
        transactionId,
        error: `Fonepay verify error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  async refund(transactionId: string, _amount?: number): Promise<PaymentRefundResult> {
    return {
      success: false,
      refunded: false,
      transactionId,
      error: 'Fonepay refunds must be processed through the merchant dashboard',
    };
  }

  async handleWebhook(payload: unknown): Promise<WebhookResult> {
    const body = payload as {
      PRN: string;
      BIL: string;
      UID: string;
      AMT: string;
      DV: string;
      RC: string;
    };

    const verified = this.verifyCallbackSignature(body);
    const isPaid = body.RC === '0' || body.RC === 'successful';

    return {
      verified,
      orderId: body.PRN,
      transactionId: body.UID || body.PRN,
      status: isPaid && verified ? 'paid' : 'failed',
      amount: parseFloat(body.AMT) || 0,
    };
  }

  private verifyCallbackSignature(params: Record<string, string>): boolean {
    try {
      const { PRN, BIL, AMT, UID, DV } = params;
      const signatureString = `${this.merchantCode},${PRN},${BIL},${AMT},${UID}`;
      const expectedDv = this.generateHmac(signatureString);
      return DV === expectedDv;
    } catch {
      return false;
    }
  }

  private generateHmac(data: string): string {
    return crypto.createHmac('sha256', this.secretKey).update(data).digest('base64');
  }
}

export const fonepayProvider = new FonepayProvider();
