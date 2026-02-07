import { registerSection } from '../../schema/section-registry';

import { FAQSection } from './faq-section';
import { faqDefaultProps, faqSectionSchema } from './faq-schema';

export { FAQSection, faqDefaultProps, faqSectionSchema };
export type { FAQItem, FAQSectionProps } from './faq-section';

registerSection({
  type: 'faq',
  name: 'FAQ',
  description: 'Frequently asked questions with expandable accordion items',
  icon: 'help-circle',
  component: FAQSection,
  schema: faqSectionSchema,
  defaultProps: faqDefaultProps,
  category: 'content',
});
