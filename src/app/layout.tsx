import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vehicle Survey',
  description: 'Survey for vehicle purchases',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}