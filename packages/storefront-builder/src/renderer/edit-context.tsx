'use client';

import { cn } from '@baazarify/ui';
import {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
  type ReactNode,
  type ElementType,
  type MouseEvent as ReactMouseEvent,
} from 'react';

import type { SectionConfig, ElementStyleOverride } from '../schema/page-schema';

import {
  appendAtPath,
  removeAtPath,
  getValueAtPath,
  setValueAtPath,
  moveItemAtPath,
} from './path-utils';

interface PageEditContextValue {
  editMode: boolean;
  selectedElementPath: string | null;
  onSectionSelect?: (sectionId: string) => void;
  onSectionPropsChange?: (sectionId: string, props: Record<string, unknown>) => void;
  onElementSelect?: (sectionId: string, path: string | null) => void;
  onElementStyleChange?: (
    sectionId: string,
    elementPath: string,
    styles: Partial<ElementStyleOverride>
  ) => void;
}

interface SectionEditContextValue {
  editMode: boolean;
  sectionId: string;
  props: Record<string, unknown>;
  select: () => void;
  setProps: (nextProps: Record<string, unknown>) => void;
  setPath: (path: string, value: unknown) => void;
  getPath: <T = unknown>(path: string) => T | undefined;
  append: (path: string, value: unknown) => void;
  removeAt: (path: string, index: number) => void;
  moveItem: (path: string, from: number, to: number) => void;
  selectElement: (path: string) => void;
  deselectElement: () => void;
  selectedElementPath: string | null;
  getElementStyle: (path: string) => ElementStyleOverride | undefined;
  setElementStyle: (path: string, styles: Partial<ElementStyleOverride>) => void;
  sectionElementStyles: Record<string, ElementStyleOverride> | undefined;
}

const PageEditContext = createContext<PageEditContextValue | null>(null);
const SectionEditContext = createContext<SectionEditContextValue | null>(null);

export interface PageEditProviderProps {
  children: ReactNode;
  editMode: boolean;
  selectedElementPath?: string | null;
  onSectionSelect?: (sectionId: string) => void;
  onSectionPropsChange?: (sectionId: string, props: Record<string, unknown>) => void;
  onElementSelect?: (sectionId: string, path: string | null) => void;
  onElementStyleChange?: (
    sectionId: string,
    elementPath: string,
    styles: Partial<ElementStyleOverride>
  ) => void;
}

export function PageEditProvider({
  children,
  editMode,
  selectedElementPath = null,
  onSectionSelect,
  onSectionPropsChange,
  onElementSelect,
  onElementStyleChange,
}: PageEditProviderProps) {
  const value = useMemo(
    () => ({
      editMode,
      selectedElementPath,
      onSectionSelect,
      onSectionPropsChange,
      onElementSelect,
      onElementStyleChange,
    }),
    [editMode, selectedElementPath, onSectionSelect, onSectionPropsChange, onElementSelect, onElementStyleChange]
  );

  return <PageEditContext.Provider value={value}>{children}</PageEditContext.Provider>;
}

export interface SectionEditProviderProps {
  children: ReactNode;
  section: SectionConfig;
}

export function SectionEditProvider({ children, section }: SectionEditProviderProps) {
  const page = useContext(PageEditContext);

  const setProps = useCallback(
    (nextProps: Record<string, unknown>) => {
      page?.onSectionPropsChange?.(section.id, nextProps);
    },
    [page, section.id]
  );

  const setPath = useCallback(
    (path: string, value: unknown) => {
      const nextProps = setValueAtPath(section.props, path, value);
      setProps(nextProps);
    },
    [section.props, setProps]
  );

  const append = useCallback(
    (path: string, value: unknown) => {
      const nextProps = appendAtPath(section.props, path, value);
      setProps(nextProps);
    },
    [section.props, setProps]
  );

  const removeAt = useCallback(
    (path: string, index: number) => {
      const nextProps = removeAtPath(section.props, path, index);
      if (nextProps === section.props) return;
      setProps(nextProps);
    },
    [section.props, setProps]
  );

  const moveItem = useCallback(
    (path: string, from: number, to: number) => {
      const nextProps = moveItemAtPath(section.props, path, from, to);
      if (nextProps === section.props) return;
      setProps(nextProps);
    },
    [section.props, setProps]
  );

  const selectElement = useCallback(
    (path: string) => {
      page?.onElementSelect?.(section.id, path);
    },
    [page, section.id]
  );

  const deselectElement = useCallback(() => {
    page?.onElementSelect?.(section.id, null);
  }, [page, section.id]);

  const getElementStyle = useCallback(
    (path: string) => {
      return section.elementStyles?.[path];
    },
    [section.elementStyles]
  );

  const setElementStyle = useCallback(
    (path: string, styles: Partial<ElementStyleOverride>) => {
      page?.onElementStyleChange?.(section.id, path, styles);
    },
    [page, section.id]
  );

  const value = useMemo<SectionEditContextValue>(
    () => ({
      editMode: page?.editMode ?? false,
      sectionId: section.id,
      props: section.props,
      select: () => page?.onSectionSelect?.(section.id),
      setProps,
      setPath,
      getPath: <T = unknown,>(path: string) => getValueAtPath(section.props, path) as T | undefined,
      append,
      removeAt,
      moveItem,
      selectElement,
      deselectElement,
      selectedElementPath: page?.selectedElementPath ?? null,
      getElementStyle,
      setElementStyle,
      sectionElementStyles: section.elementStyles,
    }),
    [
      append,
      deselectElement,
      getElementStyle,
      moveItem,
      page,
      removeAt,
      section.elementStyles,
      section.id,
      section.props,
      selectElement,
      setElementStyle,
      setPath,
      setProps,
    ]
  );

  return <SectionEditContext.Provider value={value}>{children}</SectionEditContext.Provider>;
}

export function useSectionEditor() {
  const context = useContext(SectionEditContext);
  if (!context) {
    return {
      editMode: false,
      sectionId: '',
      props: {},
      select: () => {},
      setProps: () => {},
      setPath: () => {},
      getPath: <T = unknown,>(_path: string) => undefined as T | undefined,
      append: () => {},
      removeAt: () => {},
      moveItem: () => {},
      selectElement: () => {},
      deselectElement: () => {},
      selectedElementPath: null,
      getElementStyle: (_path: string) => undefined,
      setElementStyle: () => {},
      sectionElementStyles: undefined,
    };
  }

  return context;
}

interface InlineTextProps {
  path: string;
  value?: string;
  className?: string;
  as?: ElementType;
  placeholder?: string;
  multiline?: boolean;
}

export function InlineText({
  path,
  value = '',
  className,
  as: Component = 'span',
  placeholder = 'Click to edit',
  multiline = false,
}: InlineTextProps) {
  const { editMode, setPath, select } = useSectionEditor();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  if (!editMode) {
    return <Component className={className}>{value}</Component>;
  }

  const commit = () => {
    setPath(path, draft);
    setEditing(false);
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          className={cn(
            'w-full rounded-lg border border-[var(--color-primary)] bg-white/90 px-2 py-1 text-inherit outline-none',
            className
          )}
          rows={4}
        />
      );
    }

    return (
      <input
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          }
          if (event.key === 'Escape') {
            setDraft(value ?? '');
            setEditing(false);
          }
        }}
        className={cn(
          'w-full rounded-lg border border-[var(--color-primary)] bg-white/90 px-2 py-1 text-inherit outline-none',
          className
        )}
      />
    );
  }

  return (
    <Component
      className={cn(
        className,
        'cursor-text rounded px-0.5 transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]'
      )}
      onClick={(event: ReactMouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        select();
        setEditing(true);
      }}
      title="Click to edit"
    >
      {value || <span className="text-[var(--color-text-muted)]">{placeholder}</span>}
    </Component>
  );
}

interface InlineNumberProps {
  path: string;
  value?: number;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function InlineNumber({
  path,
  value = 0,
  className,
  min,
  max,
  step = 1,
}: InlineNumberProps) {
  const { editMode, setPath, select } = useSectionEditor();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  if (!editMode) {
    return <span className={className}>{value}</span>;
  }

  const commit = () => {
    const parsed = Number(draft);
    if (!Number.isNaN(parsed)) {
      setPath(path, parsed);
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        type="number"
        autoFocus
        value={draft}
        min={min}
        max={max}
        step={step}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
          if (event.key === 'Escape') {
            setDraft(String(value));
            setEditing(false);
          }
        }}
        className={cn(
          'w-24 rounded-lg border border-[var(--color-primary)] bg-white/90 px-2 py-1 text-inherit outline-none',
          className
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        className,
        'cursor-text rounded px-0.5 transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]'
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        select();
        setEditing(true);
      }}
      title="Click to edit"
    >
      {value}
    </span>
  );
}

interface InlineSelectProps {
  path: string;
  value?: string;
  options: string[];
  className?: string;
  label?: string;
}

export function InlineSelect({ path, value, options, className, label }: InlineSelectProps) {
  const { editMode, setPath, select } = useSectionEditor();

  if (!editMode) return null;

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] shadow-sm',
        className
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        select();
      }}
    >
      {label ? <span>{label}</span> : null}
      <select
        value={value}
        onChange={(event) => setPath(path, event.target.value)}
        className="bg-transparent text-[var(--color-text-primary)] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

interface InlineToggleProps {
  path: string;
  checked: boolean;
  label: string;
  className?: string;
}

export function InlineToggle({ path, checked, label, className }: InlineToggleProps) {
  const { editMode, setPath, select } = useSectionEditor();

  if (!editMode) return null;

  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] shadow-sm',
        className
      )}
      onClick={(event) => {
        event.stopPropagation();
        select();
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => setPath(path, event.target.checked)}
      />
      {label}
    </label>
  );
}

interface InlineLinkProps {
  textPath: string;
  hrefPath: string;
  text?: string;
  href?: string;
  className?: string;
}

export function InlineLink({ textPath, hrefPath, text, href, className }: InlineLinkProps) {
  const { editMode, setPath, select } = useSectionEditor();
  const [editing, setEditing] = useState(false);

  if (!editMode) {
    return (
      <a href={href} className={className}>
        {text}
      </a>
    );
  }

  if (editing) {
    return (
      <div className="inline-flex min-w-[220px] flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-white p-3 shadow-lg">
        <input
          value={text ?? ''}
          onChange={(event) => setPath(textPath, event.target.value)}
          placeholder="Button text"
          className="rounded-md border border-[var(--color-border)] px-2 py-1 text-sm"
          autoFocus
        />
        <input
          value={href ?? ''}
          onChange={(event) => setPath(hrefPath, event.target.value)}
          placeholder="/path"
          className="rounded-md border border-[var(--color-border)] px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="self-end rounded-md bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <a
      href={href || '#'}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        select();
        setEditing(true);
      }}
      className={cn(
        className,
        'rounded px-0.5 transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]'
      )}
      title="Click to edit link"
    >
      {text}
    </a>
  );
}

interface InlineImageProps {
  srcPath: string;
  src?: string;
  altPath?: string;
  alt?: string;
  className?: string;
  placeholderClassName?: string;
}

export function InlineImage({
  srcPath,
  src,
  altPath,
  alt,
  className,
  placeholderClassName,
}: InlineImageProps) {
  const { editMode, setPath, select } = useSectionEditor();
  const [editing, setEditing] = useState(false);

  if (!src) {
    if (!editMode) {
      return <div className={cn('rounded-xl bg-[var(--color-surface)]', placeholderClassName)} />;
    }

    return (
      <button
        type="button"
        onClick={() => {
          select();
          setEditing(true);
        }}
        className={cn(
          'flex min-h-32 w-full items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-muted)]',
          placeholderClassName
        )}
      >
        Add image
      </button>
    );
  }

  if (!editMode) {
    return <img src={src} alt={alt || ''} className={className} />;
  }

  return (
    <div className="relative">
      <img src={src} alt={alt || ''} className={className} />
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          select();
          setEditing((prev) => !prev);
        }}
        className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white"
      >
        Edit image
      </button>

      {editing && (
        <div className="absolute left-2 right-2 top-12 z-10 rounded-xl border border-[var(--color-border)] bg-white p-3 shadow-xl">
          <input
            value={src}
            onChange={(event) => setPath(srcPath, event.target.value)}
            placeholder="Image URL"
            className="mb-2 w-full rounded-md border border-[var(--color-border)] px-2 py-1 text-sm"
            autoFocus
          />
          {altPath ? (
            <input
              value={alt ?? ''}
              onChange={(event) => setPath(altPath, event.target.value)}
              placeholder="Alt text"
              className="w-full rounded-md border border-[var(--color-border)] px-2 py-1 text-sm"
            />
          ) : null}
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface InlineListToolbarProps {
  label: string;
  onAdd: () => void;
  className?: string;
}

export function InlineListToolbar({ label, onAdd, className }: InlineListToolbarProps) {
  const { editMode, select } = useSectionEditor();

  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        select();
        onAdd();
      }}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)] shadow-sm',
        className
      )}
    >
      + {label}
    </button>
  );
}

interface InlineItemActionsProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function InlineItemActions({
  onMoveUp,
  onMoveDown,
  onDelete,
  className,
}: InlineItemActionsProps) {
  const { editMode } = useSectionEditor();

  if (!editMode) return null;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white/90 px-2 py-1 text-xs text-[var(--color-text-secondary)] shadow-sm',
        className
      )}
    >
      {onMoveUp ? (
        <button
          type="button"
          onClick={onMoveUp}
          className="rounded px-1 hover:bg-[var(--color-surface)]"
        >
          ↑
        </button>
      ) : null}
      {onMoveDown ? (
        <button
          type="button"
          onClick={onMoveDown}
          className="rounded px-1 hover:bg-[var(--color-surface)]"
        >
          ↓
        </button>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="rounded px-1 text-[var(--color-error)] hover:bg-[var(--color-surface)]"
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}

interface EditableElementProps {
  path: string;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function EditableElement({
  path,
  children,
  className,
  as: Component = 'div',
}: EditableElementProps) {
  const { editMode, selectElement, selectedElementPath, getElementStyle } = useSectionEditor();
  const isSelected = selectedElementPath === path;
  const styles = getElementStyle(path);

  const styleObj: React.CSSProperties = {};
  if (styles) {
    if (styles.fontSize) styleObj.fontSize = styles.fontSize;
    if (styles.fontWeight) styleObj.fontWeight = styles.fontWeight;
    if (styles.color) styleObj.color = styles.color;
    if (styles.textAlign) styleObj.textAlign = styles.textAlign as any;
    if (styles.padding) styleObj.padding = styles.padding;
    if (styles.margin) styleObj.margin = styles.margin;
    if (styles.borderRadius) styleObj.borderRadius = styles.borderRadius;
    if (styles.lineHeight) styleObj.lineHeight = styles.lineHeight;
  }

  if (!editMode) {
    return (
      <Component style={styleObj} className={className}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={cn(
        'relative cursor-pointer transition-all duration-150',
        isSelected && 'ring-2 ring-blue-500 ring-offset-1 rounded',
        !isSelected && 'hover:ring-1 hover:ring-blue-300/50 hover:ring-offset-1 rounded',
        className
      )}
      onClick={(e: ReactMouseEvent) => {
        e.stopPropagation();
        selectElement(path);
      }}
      style={styleObj}
    >
      {children}
    </Component>
  );
}
