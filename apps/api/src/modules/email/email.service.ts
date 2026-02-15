import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

import { env } from '../../config/env.js';

import {
  renderShippingUpdate,
  renderPaymentReceived,
  renderOrderConfirmation,
  renderDeliveryConfirmation,
} from './email.templates.js';

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; price: number; total: number }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  trackingUrl?: string;
  storeName: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter | null {
    if (!env.SMTP_HOST || !env.SMTP_USER) return null;

    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }

    return this.transporter;
  }

  private async send(to: string, subject: string, html: string): Promise<boolean> {
    const transporter = this.getTransporter();
    if (!transporter) {
      console.log('[Email] SMTP not configured, skipping email to:', to);
      return false;
    }

    try {
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject,
        html,
      });
      console.log('[Email] Sent:', subject, 'to:', to);
      return true;
    } catch (error) {
      console.error('[Email] Failed to send:', subject, 'to:', to, error);
      return false;
    }
  }

  async sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
    return this.send(
      data.customerEmail,
      `Order Confirmed - ${data.orderNumber} | ${data.storeName}`,
      renderOrderConfirmation(data)
    );
  }

  async sendPaymentReceived(data: OrderEmailData): Promise<boolean> {
    return this.send(
      data.customerEmail,
      `Payment Received - ${data.orderNumber} | ${data.storeName}`,
      renderPaymentReceived(data)
    );
  }

  async sendShippingUpdate(data: OrderEmailData): Promise<boolean> {
    return this.send(
      data.customerEmail,
      `Order Shipped - ${data.orderNumber} | ${data.storeName}`,
      renderShippingUpdate(data)
    );
  }

  async sendDeliveryConfirmation(data: OrderEmailData): Promise<boolean> {
    return this.send(
      data.customerEmail,
      `Order Delivered - ${data.orderNumber} | ${data.storeName}`,
      renderDeliveryConfirmation(data)
    );
  }
}

export const emailService = new EmailService();
export type { OrderEmailData };
