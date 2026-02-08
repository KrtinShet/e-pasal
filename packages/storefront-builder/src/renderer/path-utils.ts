type PathSegment = string | number;

export function parsePath(path: string): PathSegment[] {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .map((segment) => {
      const numeric = Number(segment);
      return Number.isInteger(numeric) && String(numeric) === segment ? numeric : segment;
    });
}

export function getValueAtPath(obj: unknown, path: string): unknown {
  const segments = parsePath(path);
  let current: any = obj;

  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment as keyof typeof current];
  }

  return current;
}

export function setValueAtPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const segments = parsePath(path);
  if (segments.length === 0) return obj;

  const clone: any = { ...obj };
  let current = clone;

  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i]!;
    const nextSegment = segments[i + 1]!;
    const existing = current[segment];

    if (Array.isArray(existing)) {
      current[segment] = [...existing];
    } else if (existing && typeof existing === 'object') {
      current[segment] = { ...existing };
    } else {
      current[segment] = typeof nextSegment === 'number' ? [] : {};
    }

    current = current[segment];
  }

  current[segments[segments.length - 1]!] = value;
  return clone;
}

export function appendAtPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const arr = getValueAtPath(obj, path);
  const next = Array.isArray(arr) ? [...arr, value] : [value];
  return setValueAtPath(obj, path, next);
}

export function removeAtPath(
  obj: Record<string, unknown>,
  path: string,
  index: number
): Record<string, unknown> {
  const arr = getValueAtPath(obj, path);
  if (!Array.isArray(arr)) return obj;
  if (index < 0 || index >= arr.length) return obj;

  const next = arr.filter((_, i) => i !== index);
  return setValueAtPath(obj, path, next);
}

export function moveItemAtPath(
  obj: Record<string, unknown>,
  path: string,
  from: number,
  to: number
): Record<string, unknown> {
  const arr = getValueAtPath(obj, path);
  if (!Array.isArray(arr)) return obj;
  if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return obj;

  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return setValueAtPath(obj, path, next);
}
