import './global.css';

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
      <body>{children}</body>
    </html>
  );
}