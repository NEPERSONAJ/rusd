import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../hooks/useSettings';

export function CustomScripts() {
  const { settings } = useSettings();

  if (!settings.custom_head_scripts && !settings.custom_body_scripts) {
    return null;
  }

  return (
    <Helmet>
      {settings.custom_head_scripts && (
        <script>{settings.custom_head_scripts}</script>
      )}
      {settings.custom_body_scripts && (
        <script>{`
          document.addEventListener('DOMContentLoaded', function() {
            ${settings.custom_body_scripts}
          });
        `}</script>
      )}
    </Helmet>
  );
}
