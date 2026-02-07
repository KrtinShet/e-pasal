import { registerSection } from '../../schema/section-registry';

import { GallerySection } from './gallery-section';
import { galleryDefaultProps, gallerySectionSchema } from './gallery-schema';

export { GallerySection, galleryDefaultProps, gallerySectionSchema };
export type { GalleryImage, GalleryVariant, GallerySectionProps } from './gallery-section';

registerSection({
  type: 'gallery',
  name: 'Gallery',
  description: 'Image gallery with grid, masonry, or carousel layout',
  icon: 'image',
  component: GallerySection,
  schema: gallerySectionSchema,
  defaultProps: galleryDefaultProps,
  variants: ['grid', 'masonry', 'carousel'],
  category: 'content',
});
