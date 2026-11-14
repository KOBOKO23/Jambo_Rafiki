import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, api, type GalleryPhoto } from '@/services/api';

export type GalleryItem = {
  id: number;
  url: string;
  title: string;
  description: string;
  categoryName: string;
  dateTaken: string | null;
};

function buildQuery(categoryId?: string, pageSize = 24) {
  const params = new URLSearchParams();
  params.set('page_size', String(pageSize));
  params.set('ordering', '-created_at');

  // The backend filters on the category primary key (filterset_fields = ['category', ...]).
  if (categoryId) {
    params.set('category', categoryId);
  }

  return params.toString();
}

function extractQueryFromNext(next: string) {
  try {
    const url = new URL(next, API_BASE_URL);
    return url.search.replace(/^\?/, '');
  } catch {
    return '';
  }
}

export function toAbsoluteImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;

  try {
    const origin = new URL(API_BASE_URL).origin;
    if (rawUrl.startsWith('/')) {
      return `${origin}${rawUrl}`;
    }
    return `${origin}/${rawUrl}`;
  } catch {
    return rawUrl;
  }
}

function toGalleryItems(photos: GalleryPhoto[]): GalleryItem[] {
  return photos
    .map((photo) => ({
      id: photo.id,
      url: toAbsoluteImageUrl(photo.image_url || photo.image),
      title: photo.title?.trim() ?? '',
      description: photo.description?.trim() ?? '',
      categoryName: photo.category_name ?? '',
      dateTaken: photo.date_taken,
    }))
    .filter((item) => Boolean(item.url));
}

function mergeUnique(prev: GalleryItem[], next: GalleryItem[]) {
  const seen = new Set(prev.map((item) => item.id));
  return [...prev, ...next.filter((item) => !seen.has(item.id))];
}

type UsePaginatedGalleryPhotosOptions = {
  categoryId?: string;
  pageSize?: number;
};

export function usePaginatedGalleryPhotos(options: UsePaginatedGalleryPhotosOptions = {}) {
  const { categoryId, pageSize = 24 } = options;

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextQuery, setNextQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = nextQuery !== null;

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.gallery.listPhotos(buildQuery(categoryId, pageSize));
      setItems(mergeUnique([], toGalleryItems(response.results)));
      setTotalCount(response.count ?? response.results.length);
      setNextQuery(response.next ? extractQueryFromNext(response.next) : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load gallery photos.';
      setItems([]);
      setTotalCount(0);
      setNextQuery(null);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [categoryId, pageSize]);

  const loadMore = useCallback(async () => {
    if (!nextQuery || loadingMore || loading) {
      return;
    }

    setLoadingMore(true);

    try {
      const response = await api.gallery.listPhotos(nextQuery);
      setItems((prev) => mergeUnique(prev, toGalleryItems(response.results)));
      setNextQuery(response.next ? extractQueryFromNext(response.next) : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load more gallery photos.';
      setError(message);
    } finally {
      setLoadingMore(false);
    }
  }, [nextQuery, loadingMore, loading]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  return {
    items,
    totalCount,
    loading,
    loadingMore,
    error,
    hasMore,
    retry: loadInitial,
    loadMore,
  };
}
