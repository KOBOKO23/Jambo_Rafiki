import { useEffect } from 'react';

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
};

function updateMeta(name: string, content: string) {
  let meta = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

function updateProperty(property: string, content: string) {
  let meta = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

function updateCanonical(path: string) {
  const canonicalHref = new URL(path, window.location.origin).toString();
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', canonicalHref);
}

export function SEO({ title, description, path = window.location.pathname, image = '/logo/IMG_0281.webp', type = 'website', noIndex = false }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Jambo Rafiki`;
    document.title = fullTitle;
    updateMeta('description', description);
    updateMeta('robots', noIndex ? 'noindex,nofollow,noarchive' : 'index,follow');
    updateProperty('og:title', fullTitle);
    updateProperty('og:description', description);
    updateProperty('og:type', type);
    updateProperty('og:url', new URL(path, window.location.origin).toString());
    updateProperty('og:image', new URL(image, window.location.origin).toString());
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', new URL(image, window.location.origin).toString());
    updateCanonical(path);
  }, [title, description, path, image, type, noIndex]);

  return null;
}