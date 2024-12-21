import React from 'react';
import { Helmet } from 'react-helmet-async';

export function SecurityHeaders() {
  return (
    <Helmet>
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), interest-cohort=()" />
    </Helmet>
  );
}