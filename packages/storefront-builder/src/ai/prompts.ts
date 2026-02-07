import { getSectionDocumentation } from './section-docs';

export interface PageGenerationContext {
  businessType: string;
  tone?: string;
  targetAudience?: string;
  storeName?: string;
  storeDescription?: string;
}

export function buildPageGenerationPrompt(context: PageGenerationContext): string {
  const sectionDocs = getSectionDocumentation();

  return `You are a landing page designer for an e-commerce store. Generate a JSON PageConfig for a storefront landing page.

## Store Context
- Business type: ${context.businessType}
- Store name: ${context.storeName || 'My Store'}
${context.storeDescription ? `- Description: ${context.storeDescription}` : ''}
${context.tone ? `- Tone: ${context.tone}` : '- Tone: professional and friendly'}
${context.targetAudience ? `- Target audience: ${context.targetAudience}` : ''}

## Available Sections
${sectionDocs}

## Instructions
1. Choose 5-8 sections that make sense for this type of business
2. Start with a hero section
3. Include at least one commerce section (product-grid) if applicable
4. End with a CTA or newsletter section
5. Write compelling, context-appropriate copy for all text fields
6. Select appropriate variants for each section
7. Use realistic content relevant to the business type

## Output Format
Return ONLY valid JSON matching this structure:
{
  "id": "landing",
  "slug": "/",
  "title": "Home",
  "sections": [
    { "id": "<unique-id>", "type": "<section-type>", "props": { ... }, "visible": true }
  ],
  "seo": {
    "title": "<page title>",
    "description": "<meta description>"
  }
}`;
}
