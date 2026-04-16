// pages/Gallery/GalleryPage.tsx
import HeroSection from "./HeroSection";
import CategoriesSection from "./CategoriesSection";
import GalleryGrid from "./GalleryGrid";
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";
import { useEffect, useMemo, useState } from 'react';
import { SEO } from '@/components/SEO';
import { api } from '@/services/api';
import { usePaginatedGalleryPhotos } from './usePaginatedGalleryPhotos';

type GalleryCategoryView = {
  id: string;
  name: string;
  description: string;
  slug?: string;
  count: number;
};

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<GalleryCategoryView[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const { urls, loading, loadingMore, error, hasMore, retry, loadMore } = usePaginatedGalleryPhotos({
    categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
    pageSize: 24,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setCategoriesLoading(true);
      try {
        const response = await api.gallery.listCategories();
        if (!isMounted) return;

        const mapped = response.map((category) => ({
          id: String(category.id),
          slug: category.slug,
          name: category.name,
          description: category.description || 'Gallery moments',
          count: category.count,
        }));

        setCategories(mapped);
      } catch {
        if (!isMounted) return;
        setCategories([]);
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryItems = useMemo(() => {
    const totalCount = categories.reduce((sum, category) => sum + category.count, 0);
    return [
      {
        id: 'all',
        name: 'All Photos',
        description: 'Everything from our live gallery',
        count: totalCount,
      },
      ...categories,
    ];
  }, [categories]);

  return (
    <div className="w-full">
      <SEO
        title="Gallery"
        description="Browse life at Jambo Rafiki through photos of children, programs, community activities, and daily moments in Oyugis, Kenya."
        path="/gallery"
      />
      <HeroSection previewUrls={urls.slice(0, 3)} photoCount={urls.length} loading={loading} />
      <CategoriesSection
        categories={categoryItems}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        loading={categoriesLoading}
      />
      <GalleryGrid
        urls={urls}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        error={error}
        onRetry={retry}
        onLoadMore={loadMore}
      />
      <StatsSection />
      <CTASection />
    </div>
  );
}

export default GalleryPage;