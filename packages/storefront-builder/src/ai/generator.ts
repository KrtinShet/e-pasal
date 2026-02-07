import { pageConfigSchema } from '../schema/validators';
import type { PageConfig } from '../schema/page-schema';

import { buildPageGenerationPrompt, type PageGenerationContext } from './prompts';

export interface AIClient {
  generateText(prompt: string): Promise<string>;
}

export interface GeneratePageInput {
  businessType: string;
  tone?: string;
  targetAudience?: string;
  storeName?: string;
  storeDescription?: string;
}

export async function generatePageWithAI(
  client: AIClient,
  input: GeneratePageInput
): Promise<PageConfig> {
  const context: PageGenerationContext = {
    businessType: input.businessType,
    tone: input.tone,
    targetAudience: input.targetAudience,
    storeName: input.storeName,
    storeDescription: input.storeDescription,
  };

  const prompt = buildPageGenerationPrompt(context);
  const response = await client.generateText(prompt);

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI response did not contain valid JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const validated = pageConfigSchema.parse(parsed);

  return validated as PageConfig;
}
