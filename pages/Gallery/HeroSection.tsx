// pages/Gallery/HeroSection.tsx
import { Images } from 'lucide-react';

type HeroSectionProps = {
  previewUrls: string[];
  photoCount: number;
  loading?: boolean;
};

// Shown until (or if) the live gallery returns photos.
const FALLBACK_PREVIEWS = ['/images/happy.webp', '/images/class.webp', '/images/students.webp'];

export default function HeroSection({ previewUrls, photoCount, loading = false }: HeroSectionProps) {
  const previews = [...previewUrls, ...FALLBACK_PREVIEWS].slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-leaf-100/60 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Photo Gallery</p>
          <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            Life at <span className="italic text-orange-600">Jambo Rafiki</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            Everyday moments of learning, worship, play and community from our children&rsquo;s home in Oyugis,
            Kenya. Every photo here is a story of hope being restored.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur">
            <Images className="h-4 w-4 text-orange-600" aria-hidden="true" />
            {loading ? (
              <span className="inline-block h-4 w-28 animate-pulse rounded bg-gray-200" aria-label="Loading photo count" />
            ) : (
              <span>
                {photoCount} {photoCount === 1 ? 'photo' : 'photos'} and counting
              </span>
            )}
          </div>
        </div>

        {/* Staggered collage */}
        <div className="relative mx-auto h-[340px] w-full max-w-lg sm:h-[420px]" aria-hidden="true">
          <figure className="absolute left-0 top-6 h-[62%] w-[58%] -rotate-3 overflow-hidden rounded-2xl bg-orange-100 shadow-xl ring-4 ring-white">
            <img src={previews[1]} alt="" className="h-full w-full object-cover" />
          </figure>
          <figure className="absolute right-0 top-0 h-[54%] w-[50%] rotate-2 overflow-hidden rounded-2xl bg-leaf-100 shadow-xl ring-4 ring-white">
            <img src={previews[2]} alt="" className="h-full w-full object-cover" />
          </figure>
          <figure className="absolute bottom-0 left-[22%] h-[56%] w-[60%] overflow-hidden rounded-2xl bg-clay-100 shadow-2xl ring-4 ring-white">
            <img src={previews[0]} alt="" className="h-full w-full object-cover" />
          </figure>
        </div>
      </div>
    </section>
  );
}
