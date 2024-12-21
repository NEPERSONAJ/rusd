import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../hooks/useSettings';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  schema?: string;
  noindex?: boolean;
}

export function SEO({ 
  title,
  description,
  image,
  url,
  type = 'website',
  schema,
  noindex
}: SEOProps) {
  const { settings } = useSettings();

  const fullTitle = title ? `${title} | ${settings.site_title}` : settings.site_title;
  const metaDescription = description || settings.site_description;
  const metaImage = image || settings.logo_url;
  const canonicalUrl = url || settings.canonical_url || settings.site_url;
  const robots = noindex ? 'noindex, nofollow' : settings.meta_robots || 'index, follow';

  const schemaOrgMarkup = schema || {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : type === 'product' ? 'Product' : 'WebPage',
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": fullTitle,
    "description": metaDescription,
    "image": metaImage,
    "url": canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": settings.site_title,
      "logo": {
        "@type": "ImageObject",
        "url": settings.logo_url
      }
    }
  };

  return (
    <Helmet prioritizeSeoTags={true}>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robots} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={settings.site_title} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Schema.org */}
      <script type="application/ld+json">
        {typeof schema === 'string' ? schema : JSON.stringify(schemaOrgMarkup)}
      </script>
    </Helmet>
  );
}
