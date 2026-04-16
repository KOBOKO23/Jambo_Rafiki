import { useCallback, useEffect, useState } from 'react';
import { api, API_BASE_URL } from '@/services/api';

function getApiOrigin() {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
}

function toAbsoluteImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;

  const origin = getApiOrigin();
  if (!origin) return rawUrl;

  if (rawUrl.startsWith('/')) {
    return `${origin}${rawUrl}`;
  }

  return `${origin}/${rawUrl}`;
}

type UseGalleryImageUrlsOptions = {
  count?: number;
};

export function useGalleryImageUrls(options: UseGalleryImageUrlsOptions = {}) {
  const { count = 60 } = options;
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const photos = await api.gallery.listRandomPhotos(count);
      const mapped = photos
        .map((photo) => toAbsoluteImageUrl(photo.image_url || photo.image))
        .filter((url): url is string => Boolean(url));

      const deduped = Array.from(new Set(mapped));
      setUrls(deduped);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load gallery photos.';
      setError(message);
      setUrls([]);
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    void fetchUrls();
  }, [fetchUrls]);

  return {
    urls,
    loading,
    error,
    retry: fetchUrls,
  };
}
