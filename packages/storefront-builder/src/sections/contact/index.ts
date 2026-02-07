import { registerSection } from '../../schema/section-registry';

import { ContactSection } from './contact-section';
import { contactDefaultProps, contactSectionSchema } from './contact-schema';

export { ContactSection, contactDefaultProps, contactSectionSchema };
export type { ContactField, ContactSectionProps } from './contact-section';

registerSection({
  type: 'contact',
  name: 'Contact',
  description: 'Contact form with customizable fields and optional map',
  icon: 'phone',
  component: ContactSection,
  schema: contactSectionSchema,
  defaultProps: contactDefaultProps,
  category: 'utility',
});
