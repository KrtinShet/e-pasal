export interface PaymentInitiateParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  productName?: string;
  successUrl: string;
  failureUrl: string;
}

export interface PaymentInitiateResult {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

export interface PaymentVerifyResult {
  success: boolean;
  verified: boolean;
  transactionId: string;
  amount?: number;
  status?: string;
  error?: string;
}

export interface PaymentRefundResult {
  success: boolean;
  refunded: boolean;
  transactionId: string;
  refundId?: string;
  amount?: number;
  error?: string;
}

export interface WebhookResult {
  verified: boolean;
  orderId: string;
  transactionId: string;
  status: 'paid' | 'failed' | 'refunded';
  amount: number;
}

export interface PaymentProvider {
  readonly name: string;

  initiate(params: PaymentInitiateParams): Promise<PaymentInitiateResult>;

  verify(transactionId: string, amount?: number): Promise<PaymentVerifyResult>;

  refund(transactionId: string, amount?: number): Promise<PaymentRefundResult>;

  handleWebhook?(payload: unknown, signature?: string): Promise<WebhookResult>;
}
