import { renderHook, waitFor } from '@testing-library/react';
import { useGalleryImageUrls } from '../../pages/Gallery/useGalleryImageUrls';
import { api, API_BASE_URL } from '@/services/api';

vi.mock('@/services/api', async () => {
  const actual = await vi.importActual<typeof import('@/services/api')>('@/services/api');

  return {
    ...actual,
    api: {
      ...actual.api,
      gallery: {
        listRandomPhotos: vi.fn(),
      },
    },
  };
});

describe('Gallery media URLs', () => {
  it('normalizes backend relative image_url values to absolute URLs', async () => {
    vi.mocked(api.gallery.listRandomPhotos).mockResolvedValue([
      {
        image: 'legacy-fallback.jpg',
        image_url: '/media/gallery/one.jpg',
      },
      {
        image: 'https://cdn.example.com/gallery/two.jpg',
        image_url: 'https://cdn.example.com/gallery/two.jpg',
      },
    ] as never[]);

    const { result } = renderHook(() => useGalleryImageUrls({ count: 2 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.gallery.listRandomPhotos).toHaveBeenCalledWith(2);
    expect(result.current.urls).toEqual([
      `${new URL(API_BASE_URL).origin}/media/gallery/one.jpg`,
      'https://cdn.example.com/gallery/two.jpg',
    ]);
  });
});