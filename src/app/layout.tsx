import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  // Local development base. Replace with the production origin on deploy.
  metadataBase: new URL('http://localhost:3000'),
  title: 'Smartwatch Comparison — Find the Best Watch for You',
  description:
    'Compare smartwatches side by side across price, battery life, sleep tracking, durability, and subscription-free operation.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Smartwatch Comparison',
    description:
      'Compare smartwatches side by side across price, battery life, sleep tracking, durability, and subscription-free operation.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Smartwatch Comparison',
    description:
      'Compare smartwatches side by side across price, battery life, sleep tracking, durability, and subscription-free operation.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
