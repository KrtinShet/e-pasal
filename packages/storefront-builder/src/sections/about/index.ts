import { registerSection } from '../../schema/section-registry';

import { AboutSection } from './about-section';
import { aboutDefaultProps, aboutSectionSchema } from './about-schema';

export { AboutSection, aboutDefaultProps, aboutSectionSchema };
export type { AboutVariant, AboutSectionProps } from './about-section';

registerSection({
  type: 'about',
  name: 'About',
  description: 'About section with text content and optional image',
  icon: 'info',
  component: AboutSection,
  schema: aboutSectionSchema,
  defaultProps: aboutDefaultProps,
  variants: ['image-left', 'image-right', 'centered'],
  category: 'content',
});
