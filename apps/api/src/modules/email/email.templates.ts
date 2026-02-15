import type { OrderEmailData } from './email.service.js';

function baseLayout(storeName: string, title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#18181b;padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">${storeName}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background-color:#f9fafb;text-align:center;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">Powered by Baazarify</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function renderItemsTable(
  items: OrderEmailData['items'],
  subtotal: number,
  shippingCost: number,
  total: number
): string {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;">${item.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;text-align:right;">${formatCurrency(item.price)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;text-align:right;">${formatCurrency(item.total)}</td>
    </tr>`
    )
    .join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      <tr style="background-color:#f9fafb;">
        <th style="padding:8px 0;text-align:left;font-weight:600;">Item</th>
        <th style="padding:8px 0;text-align:center;font-weight:600;">Qty</th>
        <th style="padding:8px 0;text-align:right;font-weight:600;">Price</th>
        <th style="padding:8px 0;text-align:right;font-weight:600;">Total</th>
      </tr>
      ${rows}
      <tr>
        <td colspan="3" style="padding:8px 0;text-align:right;">Subtotal</td>
        <td style="padding:8px 0;text-align:right;">${formatCurrency(subtotal)}</td>
      </tr>
      <tr>
        <td colspan="3" style="padding:8px 0;text-align:right;">Shipping</td>
        <td style="padding:8px 0;text-align:right;">${formatCurrency(shippingCost)}</td>
      </tr>
      <tr>
        <td colspan="3" style="padding:8px 0;text-align:right;font-weight:700;">Total</td>
        <td style="padding:8px 0;text-align:right;font-weight:700;font-size:16px;">${formatCurrency(total)}</td>
      </tr>
    </table>`;
}

export function renderOrderConfirmation(data: OrderEmailData): string {
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#18181b;">Order Confirmed</h2>
    <p style="margin:0 0 24px;color:#52525b;font-size:14px;">
      Hi ${data.customerName}, thank you for your order!
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#52525b;">
      <strong>Order Number:</strong> ${data.orderNumber}
    </p>
    ${renderItemsTable(data.items, data.subtotal, data.shippingCost, data.total)}
    <div style="margin-top:24px;padding:16px;background-color:#f9fafb;border-radius:6px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#18181b;">Shipping Address</p>
      <p style="margin:0;font-size:14px;color:#52525b;">${data.shippingAddress}</p>
    </div>`;

  return baseLayout(data.storeName, 'Order Confirmed', content);
}

export function renderPaymentReceived(data: OrderEmailData): string {
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#18181b;">Payment Received</h2>
    <p style="margin:0 0 24px;color:#52525b;font-size:14px;">
      Hi ${data.customerName}, we have received your payment.
    </p>
    <div style="padding:20px;background-color:#f0fdf4;border-radius:6px;text-align:center;">
      <p style="margin:0 0 4px;font-size:13px;color:#166534;">Amount Paid</p>
      <p style="margin:0;font-size:28px;font-weight:700;color:#166534;">${formatCurrency(data.total)}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#52525b;">Order ${data.orderNumber}</p>
    </div>
    <p style="margin:24px 0 0;font-size:14px;color:#52525b;">
      Your order is being processed and you will receive updates as it progresses.
    </p>`;

  return baseLayout(data.storeName, 'Payment Received', content);
}

export function renderShippingUpdate(data: OrderEmailData): string {
  const trackingInfo = data.trackingNumber
    ? `
    <div style="margin-top:24px;padding:16px;background-color:#f9fafb;border-radius:6px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#18181b;">Tracking Number</p>
      <p style="margin:0;font-size:14px;color:#52525b;">${data.trackingNumber}</p>
      ${
        data.trackingUrl
          ? `<p style="margin:8px 0 0;"><a href="${data.trackingUrl}" style="color:#2563eb;font-size:14px;">Track your shipment</a></p>`
          : ''
      }
    </div>`
    : '';

  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#18181b;">Your Order Has Been Shipped</h2>
    <p style="margin:0 0 24px;color:#52525b;font-size:14px;">
      Hi ${data.customerName}, great news! Your order <strong>${data.orderNumber}</strong> is on its way.
    </p>
    <div style="padding:20px;background-color:#eff6ff;border-radius:6px;text-align:center;">
      <p style="margin:0;font-size:16px;font-weight:600;color:#1e40af;">Order Shipped</p>
    </div>
    ${trackingInfo}
    <p style="margin:24px 0 0;font-size:14px;color:#52525b;">
      Delivering to: ${data.shippingAddress}
    </p>`;

  return baseLayout(data.storeName, 'Order Shipped', content);
}

export function renderDeliveryConfirmation(data: OrderEmailData): string {
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#18181b;">Order Delivered</h2>
    <p style="margin:0 0 24px;color:#52525b;font-size:14px;">
      Hi ${data.customerName}, your order <strong>${data.orderNumber}</strong> has been delivered.
    </p>
    <div style="padding:20px;background-color:#f0fdf4;border-radius:6px;text-align:center;">
      <p style="margin:0;font-size:16px;font-weight:600;color:#166534;">Delivered Successfully</p>
    </div>
    <p style="margin:24px 0 0;font-size:14px;color:#52525b;">
      Thank you for shopping with ${data.storeName}! We hope you enjoy your purchase.
    </p>`;

  return baseLayout(data.storeName, 'Order Delivered', content);
}
