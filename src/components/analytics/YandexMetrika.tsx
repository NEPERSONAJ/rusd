import React from 'react';
import { Helmet } from 'react-helmet-async';

export function YandexMetrika() {
  return (
    <Helmet>
      <script type="text/javascript">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(99042175, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            ecommerce:"dataLayer"
          });
        `}
      </script>
      <noscript>
        {`<div><img src="https://mc.yandex.ru/watch/99042175" style="position:absolute; left:-9999px;" alt="" /></div>`}
      </noscript>
    </Helmet>
  );
}