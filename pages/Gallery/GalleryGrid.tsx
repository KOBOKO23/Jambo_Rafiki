// pages/Gallery/GalleryGrid.tsx
import { useEffect, useMemo, useRef } from 'react';
import { ZoomIn } from "lucide-react";
import { useGalleryGrid } from "./useGalleryGrid";
import { GalleryLightbox } from "./GalleryLightbox";
const CELL = 200;

type GalleryGridProps = {
  urls: string[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onRetry: () => void;
  onLoadMore: () => void;
};

// ─── Main Grid ────────────────────────────────────────────────────────────────

export default function GalleryGrid({ urls, loading, loadingMore, hasMore, error, onRetry, onLoadMore }: GalleryGridProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const orderedUrls = useMemo(() => urls, [urls]);
  const {
    visible,
    visibleUrls,
    lightbox,
    openLightbox,
    closeLightbox,
  } = useGalleryGrid(orderedUrls);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-200" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
            Our Moments
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Life at Jambo Rafiki</h2>
          <p className="text-gray-500">Click any photo to view full size</p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-5 rounded-full" />
        </div>

        {/* Masonry grid */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="self-start sm:self-auto rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {loading && visible.length === 0 && (
          <div className="min-h-[220px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent" />
              <span className="text-sm">Loading gallery photos...</span>
            </div>
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="min-h-[220px] flex items-center justify-center">
            <p className="text-sm text-gray-500">No photos are available yet. Please check back soon.</p>
          </div>
        )}

        <div
          role="list"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${CELL}px, 1fr))`,
            gridAutoRows: `${CELL}px`,
            gridAutoFlow: "dense",
            gap: "10px",
          }}
        >
          {visible.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openLightbox(idx)}
              aria-label={`Open gallery image ${idx + 1}`}
              style={{
                gridColumn: `span ${item.span.col}`,
                gridRow: `span ${item.span.row}`,
                overflow: "hidden",
                borderRadius: "14px",
                background: "#e5e7eb",
                cursor: "pointer",
                position: "relative",
              }}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <img
                src={item.url}
                alt={`Jambo Rafiki moment ${idx + 1}`}
                loading={idx < 4 ? "eager" : "lazy"}
                decoding="async"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s ease",
                }}
                className="group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                }}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center"
                style={{ borderRadius: "14px" }}
              >
                <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
            </button>
          ))}
        </div>

        {/* Loader / end */}
        <div ref={loaderRef} className="mt-12 flex justify-center items-center h-12">
          {loadingMore && (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent" />
              <span className="text-gray-400 text-sm">Loading more moments…</span>
            </div>
          )}
          {!hasMore && visible.length > 0 && (
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-300" />
              <span>✦ All {visible.length} moments loaded</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-pink-300" />
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <GalleryLightbox
          urls={visibleUrls}
          index={lightbox.index}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
}