import { registerSection } from '../../schema/section-registry';

import { HeroSection } from './hero-section';
import { heroDefaultProps, heroSectionSchema } from './hero-schema';

export { HeroSection, heroDefaultProps, heroSectionSchema };
export type { HeroVariant, HeroSectionProps } from './hero-section';

registerSection({
  type: 'hero',
  name: 'Hero',
  description: 'Large banner section with headline, subheadline, and call-to-action buttons',
  icon: 'layout',
  component: HeroSection,
  schema: heroSectionSchema,
  defaultProps: heroDefaultProps,
  variants: ['centered', 'left-aligned', 'split'],
  category: 'content',
});
