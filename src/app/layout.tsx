import './global.css';
import Script from 'next/script';

export const metadata = {
  title: 'MintSurvey - Vehicle Ownership Survey',
  description:
    'Participate in MintSurvey Vehicle Ownership Survey to share your experience and help shape the future of mobility.',
  keywords: ['vehicle', 'survey', 'form', 'feedback'],
  openGraph: {
    title: 'MintSurvey - Vehicle Ownership Survey',
    description:
      'Participate in MintSurvey Vehicle Ownership Survey to share your experience and help shape the future of mobility.',
    url: 'https://www.micollectionapp.com/',
    type: 'website',
    images: [
      {
        url: 'https://www.micollectionapp.com/milogo.png',
        width: 1200,
        height: 630,
        alt: 'MintSurvey - Vehicle Ownership Survey',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.webp" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>
        {/* Google reCAPTCHA v3 */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
