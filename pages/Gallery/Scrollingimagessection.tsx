// pages/Gallery/ScrollingImagesSection.tsx
// NOTE: This file is not currently used in GalleryPage.tsx
// Add <ScrollingImagesSection /> to GalleryPage.tsx if you want the scrolling strip.
import { useMemo } from "react";
import { useGalleryImageUrls } from "./useGalleryImageUrls";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ScrollingImagesSection() {
  const { urls, loading, error, retry } = useGalleryImageUrls({ count: 50 });
  const randomized = useMemo(() => shuffleArray(urls), [urls]);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-gray-900 mb-4">Moments at Jambo Rafiki</h2>
        <p className="text-xl text-gray-600">A glimpse into everyday life</p>
      </div>
      <div className="relative w-full overflow-hidden">
        {error && (
          <div className="mb-4 flex items-center justify-center gap-3">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {loading && randomized.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-500">Loading images...</div>
        )}

        <div className="flex space-x-6 animate-scroll-left">
          {[...randomized, ...randomized].map((url, i) => (
            <div
              key={`${url}-${i}`}
              style={{ minWidth: "288px", height: "192px", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}
            >
              <img
                src={url}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}