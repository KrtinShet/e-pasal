import { registerSection } from '../../schema/section-registry';

import { CTASection } from './cta-section';
import { ctaDefaultProps, ctaSectionSchema } from './cta-schema';

export { CTASection, ctaDefaultProps, ctaSectionSchema };
export type { CTAVariant, CTASectionProps } from './cta-section';

registerSection({
  type: 'cta',
  name: 'Call to Action',
  description: 'Prominent call-to-action section with headline, description, and button',
  icon: 'megaphone',
  component: CTASection,
  schema: ctaSectionSchema,
  defaultProps: ctaDefaultProps,
  variants: ['simple', 'gradient', 'image'],
  category: 'content',
});
