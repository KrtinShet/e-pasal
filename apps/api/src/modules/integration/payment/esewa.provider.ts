import type {
  PaymentProvider,
  PaymentVerifyResult,
  PaymentRefundResult,
  PaymentInitiateParams,
  PaymentInitiateResult,
} from './payment.interface.js';

export class EsewaProvider implements PaymentProvider {
  readonly name = 'esewa';

  private readonly merchantCode: string;
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.merchantCode = process.env.ESEWA_MERCHANT_CODE || '';
    this.secretKey = process.env.ESEWA_SECRET_KEY || '';
    this.baseUrl = process.env.ESEWA_BASE_URL || 'https://esewa.com.np';
  }

  async initiate(params: PaymentInitiateParams): Promise<PaymentInitiateResult> {
    // TODO: Implement eSewa payment initiation
    // 1. Generate signature using HMAC-SHA256 with secret key
    // 2. Build payment form data with required fields:
    //    - amt (amount)
    //    - pdc (delivery charge)
    //    - psc (service charge)
    //    - txAmt (tax amount)
    //    - tAmt (total amount)
    //    - pid (product/order ID)
    //    - scd (merchant code)
    //    - su (success URL)
    //    - fu (failure URL)
    // 3. Return payment URL for redirect

    return {
      success: false,
      error: 'eSewa payment initiation not implemented',
    };
  }

  async verify(transactionId: string): Promise<PaymentVerifyResult> {
    // TODO: Implement eSewa payment verification
    // 1. Call eSewa verification API endpoint
    // 2. Verify signature from callback
    // 3. Check transaction status
    // 4. Return verification result

    return {
      success: false,
      verified: false,
      transactionId,
      error: 'eSewa payment verification not implemented',
    };
  }

  async refund(transactionId: string, _amount?: number): Promise<PaymentRefundResult> {
    // TODO: Implement eSewa refund
    // Note: eSewa may require manual refund process through merchant portal
    // Check eSewa merchant API documentation for programmatic refunds

    return {
      success: false,
      refunded: false,
      transactionId,
      error: 'eSewa refund not implemented',
    };
  }
}

export const esewaProvider = new EsewaProvider();
