import { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from './usePaginatedGalleryPhotos';

type GalleryLightboxProps = {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
};

function formatDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function GalleryLightbox({ items, index, onClose }: GalleryLightboxProps) {
  const [current, setCurrent] = useState(index);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const count = items.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);

  // Keyboard navigation, scroll lock and focus management.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose, prev, next]);

  // Preload neighbours so next/previous feel instant.
  useEffect(() => {
    [items[(current + 1) % count], items[(current - 1 + count) % count]].forEach((item) => {
      if (item) new Image().src = item.url;
    });
  }, [current, count, items]);

  const item = items[current];
  if (!item) return null;

  const date = formatDate(item.dateTaken);
  const meta = [item.categoryName, date].filter(Boolean).join(' · ');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Photo viewer'}
      className="fixed inset-0 z-[60] flex flex-col bg-gray-950/95 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (Math.abs(delta) > 50) (delta > 0 ? prev : next)();
        touchStartX.current = null;
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-sm text-white/70 sm:px-6">
        <span className="tabular-nums">
          {current + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close photo viewer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        {count > 1 && (
          <button
            type="button"
            aria-label="Previous photo"
            className="absolute left-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:left-6 sm:flex"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <img
          key={item.id}
          src={item.url}
          alt={item.description || item.title || `Photo ${current + 1}`}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl motion-safe:animate-[lightboxIn_200ms_ease-out]"
        />

        {count > 1 && (
          <button
            type="button"
            aria-label="Next photo"
            className="absolute right-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:right-6 sm:flex"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="mx-auto w-full max-w-3xl px-6 pb-6 pt-4 text-center" onClick={(e) => e.stopPropagation()}>
        {item.title && <p className="font-display text-xl font-semibold text-white">{item.title}</p>}
        {meta && <p className="mt-1 text-sm text-white/60">{meta}</p>}
        {item.description && <p className="mt-2 text-sm leading-relaxed text-white/80">{item.description}</p>}
        {count > 1 && <p className="mt-3 text-xs text-white/40 sm:hidden">Swipe to see more</p>}
      </div>

      <style>{`@keyframes lightboxIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
