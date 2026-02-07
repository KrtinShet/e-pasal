import { registerSection } from '../../schema/section-registry';

import { StatsSection } from './stats-section';
import { statsDefaultProps, statsSectionSchema } from './stats-schema';

export { StatsSection, statsDefaultProps, statsSectionSchema };
export type { StatItem, StatsSectionProps } from './stats-section';

registerSection({
  type: 'stats',
  name: 'Stats',
  description: 'Display key statistics and numbers with labels and descriptions',
  icon: 'bar-chart',
  component: StatsSection,
  schema: statsSectionSchema,
  defaultProps: statsDefaultProps,
  category: 'content',
});
