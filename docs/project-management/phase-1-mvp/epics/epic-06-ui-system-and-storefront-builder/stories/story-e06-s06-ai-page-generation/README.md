# E06-S06: AI Integration for Page Generation

## Summary

Integrate AI capabilities to help merchants generate landing page configurations from natural language descriptions.

## Dependencies

- E06-S04 (Storefront Builder)
- E06-S05 (Theme Editor)

## Tasks

### Task 1: Section Documentation for AI (2 hours)

- [ ] `src/ai/section-docs.ts` - Comprehensive section documentation
- [ ] Document all props, variants, and constraints
- [ ] Include examples of good configurations
- [ ] Format optimized for LLM consumption

### Task 2: Prompt Templates (2 hours)

- [ ] `src/ai/prompts.ts` - Prompt templates
- [ ] Business type → page structure mapping
- [ ] Tone/style → design choices
- [ ] Input validation prompts

### Task 3: Page Generator (4 hours)

- [ ] `src/ai/generator.ts` - Generation function
- [ ] Input: business description, tone, existing content
- [ ] Output: valid PageConfig
- [ ] Validation of AI output against schema

**Interface**:

```typescript
interface GeneratePageInput {
  businessType: string;
  tone?: string;
  targetAudience?: string;
  keyMessages?: string[];
  existingContent?: {
    headline?: string;
    description?: string;
    features?: string[];
  };
}

async function generatePageWithAI(
  input: GeneratePageInput,
  aiClient: AIClient
): Promise<PageConfig>;
```

### Task 4: API Endpoint (2 hours)

- [ ] `POST /stores/:id/landing-page/generate`
- [ ] Rate limiting
- [ ] Token usage tracking
- [ ] Error handling for AI failures

### Task 5: Dashboard UI Integration (3 hours)

- [ ] "Generate with AI" button in page editor
- [ ] Input form for business description
- [ ] Loading state during generation
- [ ] Preview generated page before saving
- [ ] Option to regenerate or tweak

## Acceptance Criteria

- [ ] AI generates valid page configurations
- [ ] Generated pages include appropriate sections
- [ ] Content matches business type and tone
- [ ] Validation prevents invalid outputs
- [ ] User can preview before applying
- [ ] Error states handled gracefully

## Estimate: 13 hours (2 days)
