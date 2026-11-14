// HeroSection.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { api } from '@/services/api';
import { toAbsoluteImageUrl } from '../Gallery/usePaginatedGalleryPhotos';

const FALLBACK_IMAGE = '/images/director_students.webp';

export default function HeroSection() {
  // A photo marked "featured" in the Gallery CMS replaces the built-in hero image.
  const [heroUrl, setHeroUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHeroPhoto() {
      try {
        const featured = await api.gallery.listFeaturedPhotos();
        if (!mounted || featured.length === 0) return;
        const url = toAbsoluteImageUrl(featured[0].image_url || featured[0].image);
        if (url) setHeroUrl(url);
      } catch {
        // keep the built-in image
      }
    }

    void loadHeroPhoto();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-orange-50/40 to-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-orange-200/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-leaf-100/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8 lg:pb-32 lg:pt-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-orange-700 shadow-sm ring-1 ring-orange-100">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden="true" />
            Building resilience &middot; Restoring hope
          </p>
          <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-[4.25rem]">
            Every child deserves to be <span className="italic text-orange-600">loved</span>, safe and in school.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            Jambo Rafiki is a children&rsquo;s home and church centre in Oyugis, Kenya. We give orphaned and vulnerable
            children food, education, healthcare and a family, restoring their dignity and hope for the future.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/donations"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
              Support a child
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3.5 font-semibold text-gray-800 transition hover:border-gray-400 hover:bg-gray-50"
            >
              Our story <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-orange-100 shadow-2xl ring-8 ring-white sm:aspect-[5/5] lg:aspect-[4/5]">
            <img
              src={heroUrl ?? FALLBACK_IMAGE}
              alt="Children at Jambo Rafiki"
              className="h-full w-full object-cover"
              loading="eager"
              onError={(e) => {
                if (e.currentTarget.src.indexOf(FALLBACK_IMAGE) === -1) e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
