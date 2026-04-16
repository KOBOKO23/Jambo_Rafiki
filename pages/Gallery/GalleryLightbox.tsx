import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type GalleryLightboxProps = {
  urls: string[];
  index: number;
  onClose: () => void;
};

export function GalleryLightbox({ urls, index, onClose }: GalleryLightboxProps) {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + urls.length) % urls.length);
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % urls.length);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, urls.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close gallery preview"
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm z-10">
        {current + 1} / {urls.length}
      </div>

      <button
        type="button"
        aria-label="Previous image"
        className="absolute left-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
          setCurrent((c) => (c - 1 + urls.length) % urls.length);
        }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="max-w-5xl max-h-[90vh] px-16 w-full" onClick={(e) => e.stopPropagation()}>
        <img
          key={current}
          src={urls[current]}
          alt={`Jambo Rafiki gallery image ${current + 1}`}
          className="w-full h-full object-contain max-h-[90vh] rounded-xl"
          style={{ animation: 'fadeIn 0.2s ease' }}
        />
      </div>

      <button
        type="button"
        aria-label="Next image"
        className="absolute right-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
          setCurrent((c) => (c + 1) % urls.length);
        }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
