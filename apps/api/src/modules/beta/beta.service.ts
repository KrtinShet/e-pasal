import { randomBytes } from 'node:crypto';

import { Store } from '../store/store.model.js';
import { Order } from '../order/order.model.js';
import { Product } from '../product/product.model.js';
import { ConflictError, NotFoundError } from '../../lib/errors.js';

import { Feedback } from './feedback.model.js';
import { BetaInvite } from './beta-invite.model.js';

interface CreateInviteInput {
  email: string;
  name: string;
  phone?: string;
  businessName?: string;
  notes?: string;
}

interface CreateFeedbackInput {
  storeId: string;
  userId: string;
  type: 'bug' | 'ux' | 'feature' | 'general';
  priority?: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  screenshot?: string;
}

interface TriageInput {
  priority?: 'critical' | 'high' | 'medium' | 'low';
  status?: 'open' | 'triaged' | 'in_progress' | 'resolved' | 'wontfix';
  assignee?: string;
  resolution?: string;
}

export class BetaService {
  async createInvite(input: CreateInviteInput) {
    const existing = await BetaInvite.findOne({ email: input.email });
    if (existing) {
      throw new ConflictError('Invite already exists for this email');
    }

    const code = randomBytes(6).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return BetaInvite.create({ ...input, code, expiresAt });
  }

  async listInvites(status?: string) {
    const filter = status ? { status } : {};
    return BetaInvite.find(filter).sort({ createdAt: -1 });
  }

  async acceptInvite(code: string, userId: string) {
    const invite = await BetaInvite.findOne({ code });
    if (!invite) {
      throw new NotFoundError('Beta invite');
    }

    if (invite.status === 'accepted') {
      throw new ConflictError('Invite already accepted');
    }

    if (invite.expiresAt < new Date()) {
      invite.status = 'expired';
      await invite.save();
      throw new ConflictError('Invite has expired');
    }

    invite.status = 'accepted';
    invite.userId = userId as any;
    invite.acceptedAt = new Date();
    await invite.save();

    return invite;
  }

  async createFeedback(input: CreateFeedbackInput) {
    return Feedback.create(input);
  }

  async listFeedback(filters: {
    storeId?: string;
    type?: string;
    status?: string;
    priority?: string;
  }) {
    const query: Record<string, unknown> = {};
    if (filters.storeId) query.storeId = filters.storeId;
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;

    return Feedback.find(query).sort({ createdAt: -1 }).populate('userId', 'name email');
  }

  async triageFeedback(feedbackId: string, input: TriageInput) {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      throw new NotFoundError('Feedback');
    }

    if (input.priority) feedback.priority = input.priority;
    if (input.status) feedback.status = input.status;
    if (input.assignee) feedback.assignee = input.assignee;
    if (input.resolution) {
      feedback.resolution = input.resolution;
      feedback.resolvedAt = new Date();
    }

    await feedback.save();
    return feedback;
  }

  async getOnboardingChecklist(storeId: string) {
    const store = await Store.findById(storeId).lean();
    if (!store) throw new NotFoundError('Store');

    const productCount = await Product.countDocuments({ storeId });
    const orderCount = await Order.countDocuments({ storeId });
    const hasLogo = !!store.logo;
    const hasContact = !!(store.contact?.email || store.contact?.phone);
    const hasPayment = (store.integrations?.payments?.length ?? 0) > 0;
    const hasLandingPage = !!store.landingPage?.config;

    const steps = [
      { key: 'store_created', label: 'Create your store', completed: true },
      { key: 'logo_uploaded', label: 'Upload store logo', completed: hasLogo },
      { key: 'contact_added', label: 'Add contact information', completed: hasContact },
      { key: 'first_product', label: 'Add your first product', completed: productCount > 0 },
      { key: 'payment_configured', label: 'Configure a payment method', completed: hasPayment },
      { key: 'landing_page', label: 'Set up your landing page', completed: hasLandingPage },
      { key: 'first_order', label: 'Receive your first order', completed: orderCount > 0 },
    ];

    const completedCount = steps.filter((s) => s.completed).length;

    return {
      steps,
      completedCount,
      totalSteps: steps.length,
      progressPercent: Math.round((completedCount / steps.length) * 100),
    };
  }

  async getFeedbackStats() {
    const [byType, byStatus, byPriority] = await Promise.all([
      Feedback.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      Feedback.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Feedback.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    ]);

    return { byType, byStatus, byPriority };
  }
}

export const betaService = new BetaService();
