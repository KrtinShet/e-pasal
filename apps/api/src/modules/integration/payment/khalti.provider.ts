import type {
  PaymentProvider,
  PaymentVerifyResult,
  PaymentRefundResult,
  PaymentInitiateParams,
  PaymentInitiateResult,
} from './payment.interface.js';

export class KhaltiProvider implements PaymentProvider {
  readonly name = 'khalti';

  private readonly secretKey: string;
  private readonly publicKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.secretKey = process.env.KHALTI_SECRET_KEY || '';
    this.publicKey = process.env.KHALTI_PUBLIC_KEY || '';
    this.baseUrl = process.env.KHALTI_BASE_URL || 'https://khalti.com/api/v2';
  }

  async initiate(params: PaymentInitiateParams): Promise<PaymentInitiateResult> {
    // TODO: Implement Khalti payment initiation
    // 1. Call Khalti e-payment initiation API
    // 2. POST to /epayment/initiate with:
    //    - return_url
    //    - website_url
    //    - amount (in paisa)
    //    - purchase_order_id
    //    - purchase_order_name
    //    - customer_info (name, email, phone)
    // 3. Include Authorization header with secret key
    // 4. Return payment URL from response

    return {
      success: false,
      error: 'Khalti payment initiation not implemented',
    };
  }

  async verify(transactionId: string): Promise<PaymentVerifyResult> {
    // TODO: Implement Khalti payment verification
    // 1. Call Khalti lookup API
    // 2. POST to /epayment/lookup with pidx
    // 3. Check transaction status (Completed, Pending, Initiated, Refunded, Expired)
    // 4. Verify amount matches order amount
    // 5. Return verification result

    return {
      success: false,
      verified: false,
      transactionId,
      error: 'Khalti payment verification not implemented',
    };
  }

  async refund(transactionId: string, _amount?: number): Promise<PaymentRefundResult> {
    // TODO: Implement Khalti refund
    // Note: Check Khalti merchant API documentation for refund endpoints
    // May require contacting Khalti support for refund processing

    return {
      success: false,
      refunded: false,
      transactionId,
      error: 'Khalti refund not implemented',
    };
  }
}

export const khaltiProvider = new KhaltiProvider();
