import { registerSection } from '../../schema/section-registry';

import { TestimonialsSection } from './testimonials-section';
import { testimonialsDefaultProps, testimonialsSectionSchema } from './testimonials-schema';

export { TestimonialsSection, testimonialsDefaultProps, testimonialsSectionSchema };
export type {
  TestimonialItem,
  TestimonialsVariant,
  TestimonialsSectionProps,
} from './testimonials-section';

registerSection({
  type: 'testimonials',
  name: 'Testimonials',
  description: 'Customer testimonials with ratings, names, and avatars',
  icon: 'message-circle',
  component: TestimonialsSection,
  schema: testimonialsSectionSchema,
  defaultProps: testimonialsDefaultProps,
  variants: ['carousel', 'grid'],
  category: 'social',
});
