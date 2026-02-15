'use client';

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--grey-200)] bg-[var(--grey-50)] p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--error-lighter)]">
            <AlertTriangle size={24} className="text-[var(--error-main)]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[var(--grey-900)]">Something went wrong</p>
            <p className="mt-1 text-xs text-[var(--grey-400)]">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary-main)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
