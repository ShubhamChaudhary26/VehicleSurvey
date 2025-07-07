'use client';

import { useEffect } from 'react';

const ReCaptcha = () => {
  useEffect(() => {
    // Load reCAPTCHA script only if it hasn't been loaded
    if (!document.querySelector(`script[src*="recaptcha"]`)) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.body.appendChild(script);

      // Cleanup script on component unmount
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return null;
};

export default ReCaptcha;