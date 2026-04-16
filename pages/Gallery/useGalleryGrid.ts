import { useMemo, useState } from 'react';

type Span = { col: number; row: number };

const SPAN_OPTIONS: Span[] = [
  { col: 1, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 2 },
  { col: 1, row: 2 },
  { col: 2, row: 1 },
  { col: 2, row: 2 },
];

export type GridItem = {
  url: string;
  span: Span;
  id: string;
};

function buildItems(urls: string[]): GridItem[] {
  return urls.map((url, i) => ({
    url,
    span: SPAN_OPTIONS[i % SPAN_OPTIONS.length],
    id: `${i}-${url}`,
  }));
}

export function useGalleryGrid(urls: string[]) {
  const visible = useMemo(() => buildItems(urls), [urls]);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  const visibleUrls = useMemo(() => visible.map((item) => item.url), [visible]);

  return {
    visible,
    visibleUrls,
    lightbox,
    openLightbox: (index: number) => setLightbox({ open: true, index }),
    closeLightbox: () => setLightbox({ open: false, index: 0 }),
  };
}
