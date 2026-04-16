// HeroSection.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api, type GalleryPhoto } from '@/services/api';

export default function HeroSection() {
  const [heroPhoto, setHeroPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHeroPhoto() {
      try {
        const featured = await api.gallery.listFeaturedPhotos();
        if (!mounted) return;

        if (featured.length > 0) {
          setHeroPhoto(featured[0]);
          return;
        }

        const random = await api.gallery.listRandomPhotos(1);
        if (!mounted) return;
        setHeroPhoto(random[0] ?? null);
      } catch {
        if (mounted) {
          setHeroPhoto(null);
        }
      }
    }

    void loadHeroPhoto();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <span className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm">
              Building Resilience • Restoring Hope
            </span>
            <h1 className="text-5xl lg:text-6xl text-gray-900 leading-tight">Jambo Rafiki</h1>
            <p className="text-xl text-gray-700 leading-relaxed">Children Orphanage and Church Centre</p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We provide social protection to orphaned and vulnerable children, restoring their dignity and hope for the future through love, care, and sustainable development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/get-involved"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all"
              >
                Make a Difference
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full hover:bg-orange-50 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-orange-200 to-pink-200 rounded-2xl shadow-2xl overflow-hidden">
              {heroPhoto ? (
                <img
                  src={heroPhoto.image_url || heroPhoto.image}
                  alt={heroPhoto.title || 'Children at Jambo Rafiki'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100 text-sm text-gray-600">
                  Add a featured photo in Gallery CMS to personalize this hero section.
                </div>
              )}
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-300 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-300 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
