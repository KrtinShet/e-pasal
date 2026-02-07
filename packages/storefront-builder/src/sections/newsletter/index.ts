import { registerSection } from '../../schema/section-registry';

import { NewsletterSection } from './newsletter-section';
import { newsletterDefaultProps, newsletterSectionSchema } from './newsletter-schema';

export { NewsletterSection, newsletterDefaultProps, newsletterSectionSchema };
export type { NewsletterSectionProps } from './newsletter-section';

registerSection({
  type: 'newsletter',
  name: 'Newsletter',
  description: 'Email subscription section with input field and subscribe button',
  icon: 'mail',
  component: NewsletterSection,
  schema: newsletterSectionSchema,
  defaultProps: newsletterDefaultProps,
  category: 'utility',
});
