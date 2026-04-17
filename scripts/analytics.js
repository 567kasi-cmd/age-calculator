/**
 * Analytics Loader - Age Calculator Project
 * Loads Google Analytics and AdSense with deferred execution
 * Reduces render-blocking time
 */

(function() {
  'use strict';

  // Load Google Analytics asynchronously with defer
  function loadGoogleAnalytics() {
    const script1 = document.createElement('script');
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-YXWTMKPK1H';
    script1.async = true;
    script1.defer = true;

    const script2 = document.createElement('script');
    script2.defer = true;
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YXWTMKPK1H');
    `;

    // Append scripts to document
    document.head.appendChild(script1);
    document.head.appendChild(script2);
  }

  // Load Google AdSense with defer
  function loadAdSense() {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3098158884275893';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }

  // Initialize on DOMContentLoaded (non-blocking)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadGoogleAnalytics();
      loadAdSense();
    });
  } else {
    loadGoogleAnalytics();
    loadAdSense();
  }
})();

