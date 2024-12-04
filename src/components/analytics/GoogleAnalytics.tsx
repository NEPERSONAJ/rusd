import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../hooks/useSettings';

export function GoogleAnalytics() {
  const { settings } = useSettings();
  const gaId = settings.google_analytics_id;
  const gtmId = settings.google_tag_manager_id;

  if (!gaId && !gtmId) return null;

  return (
    <Helmet>
      {gaId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `}
          </script>
        </>
      )}
      
      {gtmId && (
        <>
          <script>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </script>
          <noscript>
            {`<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
          </noscript>
        </>
      )}
    </Helmet>
  );
}
