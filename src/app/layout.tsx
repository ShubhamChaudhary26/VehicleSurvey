// import './global.css';

// export const metadata = {
//   title: 'Vehicle Ownership Survey',
//   description: 'Participate in our vehicle ownership survey to share your experiences and feedback about owning and using your vehicle.',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="icon" href="/icon.webp" />
//       </head>
//       <body>{children}</body>
//     </html>
//   );
// }

import './global.css';
import Script from 'next/script'; // ✅ Important for external scripts

export const metadata = {
  title: 'Vehicle Ownership Survey',
  description: 'Participate in our vehicle ownership survey to share your experiences and feedback about owning and using your vehicle.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.webp" />
      </head>
      <body>
        {/* ✅ Load reCAPTCHA v3 script */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
          async
        />
        {children}
      </body>
    </html>
  );
}
