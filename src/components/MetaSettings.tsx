import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../hooks/useSettings';

export function MetaSettings() {
  const { settings } = useSettings();

  // Return null only if we don't have settings.site_title
  if (!settings.site_title) {
    return null;
  }

  const schemaOrgMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.site_title,
    "url": settings.site_url,
    "logo": settings.logo_url,
    "description": settings.site_description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": settings.address_locality,
      "addressRegion": settings.address_region,
      "streetAddress": settings.street_address
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.whatsapp_number,
      "contactType": "customer service",
      "email": settings.email
    }
  };

  return (
    <Helmet prioritizeSeoTags={true}>
      {/* Basic Meta Tags */}
      <title>{settings.site_title}</title>
      <meta name="description" content={settings.site_description} />
      <meta name="keywords" content={settings.meta_keywords} />
      <meta name="author" content={settings.meta_author} />
      <meta name="robots" content={settings.meta_robots || 'index, follow'} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href={settings.favicon_url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={settings.site_title} />
      <meta property="og:description" content={settings.site_description} />
      <meta property="og:image" content={settings.logo_url} />
      <meta property="og:url" content={settings.site_url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={settings.site_title} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={settings.site_title} />
      <meta name="twitter:description" content={settings.site_description} />
      <meta name="twitter:image" content={settings.logo_url} />

      {/* Canonical URL */}
      <link rel="canonical" href={settings.canonical_url || settings.site_url} />

      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgMarkup)}
      </script>

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#ffffff" />
    </Helmet>
  );
}
