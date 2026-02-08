// eslint-disable-next-line import/no-unresolved
import { it, expect, describe } from 'vitest';

import {
  parsePath,
  appendAtPath,
  removeAtPath,
  getValueAtPath,
  setValueAtPath,
  moveItemAtPath,
} from '../src/renderer/path-utils';

describe('path-utils', () => {
  it('parses dot and bracket path segments', () => {
    expect(parsePath('items[2].title')).toEqual(['items', 2, 'title']);
    expect(parsePath('seo.description')).toEqual(['seo', 'description']);
  });

  it('reads values by path', () => {
    const props = {
      hero: {
        title: 'Welcome',
      },
      items: [{ label: 'A' }, { label: 'B' }],
    };

    expect(getValueAtPath(props, 'hero.title')).toBe('Welcome');
    expect(getValueAtPath(props, 'items.1.label')).toBe('B');
    expect(getValueAtPath(props, 'missing.path')).toBeUndefined();
  });

  it('sets nested value immutably', () => {
    const props = {
      hero: {
        title: 'Welcome',
        subtitle: 'Shop now',
      },
    };

    const next = setValueAtPath(props, 'hero.title', 'Namaste');

    expect(next).not.toBe(props);
    expect(next.hero).not.toBe(props.hero);
    expect(next.hero).toEqual({
      title: 'Namaste',
      subtitle: 'Shop now',
    });
  });

  it('appends and removes array items by path', () => {
    const props = {
      features: [{ title: 'One' }, { title: 'Two' }],
    };

    const appended = appendAtPath(props, 'features', { title: 'Three' });
    expect(getValueAtPath(appended, 'features.2.title')).toBe('Three');

    const removed = removeAtPath(appended, 'features', 1);
    expect(removed.features).toEqual([{ title: 'One' }, { title: 'Three' }]);
  });

  it('moves array item by path', () => {
    const props = {
      testimonials: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
    };

    const moved = moveItemAtPath(props, 'testimonials', 0, 2);
    expect(moved.testimonials).toEqual([{ name: 'B' }, { name: 'C' }, { name: 'A' }]);
  });
});
