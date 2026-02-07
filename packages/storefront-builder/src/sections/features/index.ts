import { registerSection } from '../../schema/section-registry';

import { FeaturesSection } from './features-section';
import { featuresDefaultProps, featuresSectionSchema } from './features-schema';

export { FeaturesSection, featuresDefaultProps, featuresSectionSchema };
export type { FeatureItem, FeaturesVariant, FeaturesSectionProps } from './features-section';

registerSection({
  type: 'features',
  name: 'Features',
  description: 'Showcase key features or benefits with icons, titles, and descriptions',
  icon: 'star',
  component: FeaturesSection,
  schema: featuresSectionSchema,
  defaultProps: featuresDefaultProps,
  variants: ['grid', 'list', 'cards'],
  category: 'content',
});
