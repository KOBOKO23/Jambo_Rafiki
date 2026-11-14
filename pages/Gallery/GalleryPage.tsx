// pages/Gallery/GalleryPage.tsx
import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import GalleryGrid from './GalleryGrid';
import CTASection from './CTASection';
import { useEffect, useMemo, useState } from 'react';
import { SEO } from '@/components/SEO';
import { api } from '@/services/api';
import { usePaginatedGalleryPhotos } from './usePaginatedGalleryPhotos';

type GalleryCategoryView = {
  id: string;
  name: string;
  count: number;
};

const ALL = 'all';

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL);
  const [categories, setCategories] = useState<GalleryCategoryView[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const { items, totalCount, loading, loadingMore, error, hasMore, retry, loadMore } = usePaginatedGalleryPhotos({
    categoryId: selectedCategory === ALL ? undefined : selectedCategory,
    pageSize: 24,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setCategoriesLoading(true);
      try {
        const response = await api.gallery.listCategories();
        if (!isMounted) return;
        setCategories(
          response
            .filter((category) => category.count > 0)
            .map((category) => ({ id: String(category.id), name: category.name, count: category.count }))
        );
      } catch {
        if (isMounted) setCategories([]);
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    }

    void loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const categoryItems = useMemo(() => {
    const totalFromCategories = categories.reduce((sum, category) => sum + category.count, 0);
    return [{ id: ALL, name: 'All photos', count: totalFromCategories }, ...categories];
  }, [categories]);

  // Hero shows the overall total; while a category is selected keep the "all" figure from the categories list.
  const heroCount = selectedCategory === ALL ? totalCount : categoryItems[0].count;

  return (
    <div className="w-full">
      <SEO
        title="Gallery"
        description="Browse life at Jambo Rafiki through photos of children, programs, community activities, and daily moments in Oyugis, Kenya."
        path="/gallery"
      />
      <HeroSection
        previewUrls={items.slice(0, 3).map((item) => item.url)}
        photoCount={heroCount}
        loading={loading && items.length === 0}
      />
      {categories.length > 0 || categoriesLoading ? (
        <CategoriesSection
          categories={categoryItems}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          loading={categoriesLoading}
        />
      ) : null}
      <GalleryGrid
        items={items}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        error={error}
        onRetry={retry}
        onLoadMore={loadMore}
      />
      <CTASection />
    </div>
  );
}

export default GalleryPage;
