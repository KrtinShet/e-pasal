import Anthropic from '@anthropic-ai/sdk';

import { env } from '../config/env.js';

export interface AIClient {
  generateText(prompt: string): Promise<string>;
}

class AnthropicAIClient implements AIClient {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateText(prompt: string): Promise<string> {
    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }
    return block.text;
  }
}

let _aiClient: AIClient | null = null;

export function getAIClient(): AIClient {
  if (!_aiClient) {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    _aiClient = new AnthropicAIClient(env.ANTHROPIC_API_KEY);
  }
  return _aiClient;
}
