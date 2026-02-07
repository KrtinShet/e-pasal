import { z } from 'zod';

const contactFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'email', 'tel', 'textarea']),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
});

export const contactSectionSchema = z.object({
  className: z.string().optional(),
  title: z.string().optional().default('Contact Us'),
  description: z.string().optional(),
  showMap: z.boolean().optional().default(false),
  fields: z.array(contactFieldSchema),
  submitText: z.string().optional().default('Send Message'),
});

export const contactDefaultProps = {
  title: 'Contact Us',
  description: 'Have a question? We would love to hear from you.',
  showMap: false,
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Your name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      placeholder: 'your@email.com',
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea' as const,
      required: true,
      placeholder: 'How can we help?',
    },
  ],
  submitText: 'Send Message',
};
