import { z } from 'zod';

const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const faqSectionSchema = z.object({
  className: z.string().optional(),
  title: z.string().optional(),
  items: z.array(faqItemSchema).min(1),
});

export const faqDefaultProps = {
  title: 'Frequently Asked Questions',
  items: [
    {
      question: 'How long does delivery take?',
      answer:
        'We deliver within Kathmandu valley in 1-2 business days. For other areas, it may take 3-5 business days.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept eSewa, Khalti, bank transfer, and cash on delivery.',
    },
    {
      question: 'Can I return a product?',
      answer:
        'Yes, you can return products within 7 days of delivery if they are unused and in original packaging.',
    },
  ],
};
