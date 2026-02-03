import type { DeepPartial } from '../tokens/types';

function isObject(item: unknown): item is object {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
}

export function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const output = { ...target } as T;

  if (isObject(target) && isObject(source)) {
    const targetObj = target as Record<string, unknown>;
    const sourceObj = source as Record<string, unknown>;
    const outputObj = output as Record<string, unknown>;

    Object.keys(sourceObj).forEach((key) => {
      const sourceValue = sourceObj[key];
      const targetValue = targetObj[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        outputObj[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        outputObj[key] = sourceValue;
      }
    });
  }

  return output;
}
