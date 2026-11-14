// pages/Gallery/GalleryGrid.tsx
// Masonry grid that keeps each photo's natural aspect ratio (no awkward crops).
import { useEffect, useRef, useState } from 'react';
import { Camera, Maximize2 } from 'lucide-react';
import { GalleryLightbox } from './GalleryLightbox';
import type { GalleryItem } from './usePaginatedGalleryPhotos';

type GalleryGridProps = {
  items: GalleryItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onRetry: () => void;
  onLoadMore: () => void;
};

const SKELETON_HEIGHTS = ['h-64', 'h-80', 'h-56', 'h-72', 'h-96', 'h-60', 'h-72', 'h-64'];

function GalleryTile({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  const label = item.title || `Photo ${index + 1}`;

  return (
    <li className="mb-3 break-inside-avoid sm:mb-4">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open photo: ${label}`}
        className={`group relative block w-full overflow-hidden rounded-xl bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
          loaded ? '' : 'min-h-48 animate-pulse'
        }`}
      >
        <img
          ref={(el) => {
            // Cached images can finish before React attaches onLoad.
            if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
          }}
          src={item.url}
          alt={item.description || label}
          loading={index < 8 ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          {item.categoryName && (
            <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-orange-200">
              {item.categoryName}
            </span>
          )}
          <span className="font-display text-lg font-semibold leading-snug text-white">{label}</span>
        </span>
        <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100">
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </span>
      </button>
    </li>
  );
}

export default function GalleryGrid({ items, loading, loadingMore, hasMore, error, onRetry, onLoadMore }: GalleryGridProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Infinite scroll: fetch the next page as the sentinel approaches the viewport.
  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: '600px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  const showSkeleton = loading && items.length === 0;
  const showEmpty = !loading && !error && items.length === 0;

  return (
    <section className="bg-white py-10 sm:py-14" aria-label="Photos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">We couldn&rsquo;t load the photos right now. {error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="self-start rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 sm:self-auto"
            >
              Try again
            </button>
          </div>
        )}

        {showSkeleton && (
          <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4" aria-label="Loading photos">
            {SKELETON_HEIGHTS.map((h, i) => (
              <li key={i} className={`mb-3 break-inside-avoid rounded-xl sm:mb-4 bg-gray-100 ${h} animate-pulse`} />
            ))}
          </ul>
        )}

        {showEmpty && (
          <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <Camera className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl">New photos are on their way</h2>
            <p className="mt-2 text-gray-600">
              We&rsquo;re gathering fresh moments from Jambo Rafiki. Please check back soon.
            </p>
          </div>
        )}

        {items.length > 0 && (
          <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4">
            {items.map((item, idx) => (
              <GalleryTile key={item.id} item={item} index={idx} onOpen={() => setLightboxIndex(idx)} />
            ))}
          </ul>
        )}

        <div ref={loaderRef} className="mt-10 flex min-h-12 items-center justify-center">
          {loadingMore ? (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              Loading more photos&hellip;
            </div>
          ) : hasMore ? (
            <button
              type="button"
              onClick={onLoadMore}
              className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              Load more photos
            </button>
          ) : (
            items.length > 0 && (
              <p className="text-sm text-gray-400">You&rsquo;ve seen all {items.length} photos</p>
            )
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox items={items} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </section>
  );
}
