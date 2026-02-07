import { registerSection } from '../../schema/section-registry';

import { ProductGridSection } from './product-grid-section';
import { productGridDefaultProps, productGridSectionSchema } from './product-grid-schema';

export { ProductGridSection, productGridDefaultProps, productGridSectionSchema };
export type { ProductItem, ProductGridSectionProps } from './product-grid-section';

registerSection({
  type: 'product-grid',
  name: 'Product Grid',
  description: 'Display products in a responsive grid layout with images, names, and prices',
  icon: 'grid',
  component: ProductGridSection,
  schema: productGridSectionSchema,
  defaultProps: productGridDefaultProps,
  category: 'commerce',
});
