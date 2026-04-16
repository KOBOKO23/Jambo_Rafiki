import { useEffect, useState } from 'react';
import { api, type GalleryPhoto } from '@/services/api';

const FeaturedProgramsSection = () => {
  const [items, setItems] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadFeatured() {
      try {
        const featured = await api.gallery.listFeaturedPhotos();
        if (!mounted) return;

        if (featured.length > 0) {
          setItems(featured.slice(0, 3));
          return;
        }

        const random = await api.gallery.listRandomPhotos(3);
        if (!mounted) return;
        setItems(random.slice(0, 3));
      } catch {
        if (mounted) {
          setItems([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadFeatured();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Programs</h2>
        {isLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
            Loading featured content...
          </div>
        ) : items.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {items.map((item) => (
              <article key={item.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <img
                  src={item.image_url || item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-2xl mb-6"
                  loading="lazy"
                />
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description || 'Managed from gallery and CMS media resources.'}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">No featured media available yet.</p>
            <p className="mt-2 text-sm text-gray-500">Add or mark images as featured in Gallery CMS to populate this section.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProgramsSection;
