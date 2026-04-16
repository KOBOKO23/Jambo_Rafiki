// ProgramsSection.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api, type GalleryPhoto } from '@/services/api';

type ProgramCard = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<ProgramCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPrograms() {
      try {
        const response = await api.gallery.listPhotos('page=1&page_size=3');
        if (!mounted) return;

        const mapped: ProgramCard[] = response.results.slice(0, 3).map((item: GalleryPhoto) => ({
          id: item.id,
          title: item.category_name || item.title,
          description: item.description || 'Managed from Gallery CMS content.',
          image: item.image_url || item.image,
        }));

        setPrograms(mapped);
      } catch {
        if (mounted) {
          setPrograms([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPrograms();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive care and support through our dedicated ministry programs
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-4"></div>
        </div>

        {/* Programs Grid */}
        {isLoading ? (
          <div className="rounded-2xl border border-blue-100 bg-white/70 px-6 py-10 text-center text-sm text-gray-500 mb-12">
            Loading programs...
          </div>
        ) : programs.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{program.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-blue-100 bg-white/70 px-6 py-10 text-center mb-12">
            <p className="text-sm font-medium text-gray-700">No program media published yet.</p>
            <p className="mt-2 text-sm text-gray-500">Upload photos in Gallery CMS and they will appear here automatically.</p>
          </div>
        )}

        {/* View All Programs Link */}
        <div className="text-center">
          <Link
            to="/programs"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            View All Programs
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}