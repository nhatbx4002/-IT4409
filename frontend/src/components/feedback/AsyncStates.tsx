import { AlertTriangle, Loader2 } from 'lucide-react';
import { BRAND_GOLD, FONT_SANS, FONT_SERIF, TEXT_MUTED } from '@/theme/constants';

type LoadingStateProps = {
  message?: string;
  description?: string;
};

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function LoadingState({ message = 'Loading...', description }: LoadingStateProps) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-3">
      <Loader2 className="w-10 h-10 animate-spin" style={{ color: BRAND_GOLD }} />
      <p
        className="text-lg"
        style={{
          fontFamily: FONT_SANS,
          color: TEXT_MUTED,
        }}
      >
        {message}
      </p>
      {description && (
        <p
          className="text-sm max-w-xl mx-auto"
          style={{
            fontFamily: FONT_SANS,
            color: TEXT_MUTED,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry, retryLabel = 'Retry' }: ErrorStateProps) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <AlertTriangle className="w-10 h-10 text-red-600" />
      <p
        className="text-lg"
        style={{
          fontFamily: FONT_SERIF,
          color: '#DC2626',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 border-2 transition-all duration-300 hover:opacity-90"
          style={{
            borderColor: BRAND_GOLD,
            color: BRAND_GOLD,
            fontFamily: FONT_SANS,
          }}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-3">
      <p
        className="text-xl"
        style={{
          fontFamily: FONT_SERIF,
          color: TEXT_MUTED,
        }}
      >
        {title}
      </p>
      {description && (
        <p
          className="text-sm max-w-xl mx-auto"
          style={{
            fontFamily: FONT_SANS,
            color: TEXT_MUTED,
          }}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 border-2 transition-all duration-300 hover:opacity-90"
          style={{
            borderColor: BRAND_GOLD,
            color: BRAND_GOLD,
            fontFamily: FONT_SANS,
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

