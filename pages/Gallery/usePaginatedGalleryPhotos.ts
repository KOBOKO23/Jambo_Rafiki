import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, api } from '@/services/api';

function buildQuery(categorySlug?: string, pageSize = 24) {
  const params = new URLSearchParams();
  params.set('page_size', String(pageSize));
  params.set('ordering', '-created_at');

  if (categorySlug) {
    params.set('category', categorySlug);
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

function toAbsoluteImageUrl(rawUrl: string): string {
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

type UsePaginatedGalleryPhotosOptions = {
  categorySlug?: string;
  pageSize?: number;
};

export function usePaginatedGalleryPhotos(options: UsePaginatedGalleryPhotosOptions = {}) {
  const { categorySlug, pageSize = 24 } = options;

  const [urls, setUrls] = useState<string[]>([]);
  const [nextQuery, setNextQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = nextQuery !== null;

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.gallery.listPhotos(buildQuery(categorySlug, pageSize));
      const mapped = response.results
        .map((photo) => toAbsoluteImageUrl(photo.image_url || photo.image))
        .filter((url): url is string => Boolean(url));

      setUrls(Array.from(new Set(mapped)));
      setNextQuery(response.next ? extractQueryFromNext(response.next) : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load gallery photos.';
      setUrls([]);
      setNextQuery(null);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, pageSize]);

  const loadMore = useCallback(async () => {
    if (!nextQuery || loadingMore || loading) {
      return;
    }

    setLoadingMore(true);

    try {
      const response = await api.gallery.listPhotos(nextQuery);
      const mapped = response.results
        .map((photo) => toAbsoluteImageUrl(photo.image_url || photo.image))
        .filter((url): url is string => Boolean(url));

      setUrls((prev) => Array.from(new Set([...prev, ...mapped])));
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
    urls,
    loading,
    loadingMore,
    error,
    hasMore,
    retry: loadInitial,
    loadMore,
  };
}
