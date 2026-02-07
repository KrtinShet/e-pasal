import { getAllSections } from '../schema/section-registry';

export function getSectionDocumentation(): string {
  const sections = getAllSections();

  const docs = sections.map((section) => {
    const variantInfo = section.variants?.length
      ? `\n  Variants: ${section.variants.join(', ')}`
      : '';

    const propsInfo = Object.entries(section.defaultProps)
      .map(([key, value]) => {
        const type = Array.isArray(value) ? 'array' : typeof value;
        return `    - ${key}: ${type} (default: ${JSON.stringify(value).slice(0, 80)})`;
      })
      .join('\n');

    return `## ${section.name} (type: "${section.type}")
  Category: ${section.category}
  Description: ${section.description}${variantInfo}
  Props:
${propsInfo}`;
  });

  return `# Available Storefront Sections

${docs.join('\n\n')}

## Usage Notes
- Each section's "type" field must match exactly (e.g., "hero", "product-grid")
- All sections support an optional "className" prop for additional styling
- Sections are rendered in order as defined in the PageConfig.sections array
- Set "visible: false" on a section to hide it without removing it
- Products in product-grid are pre-fetched data passed in by the storefront
`;
}
