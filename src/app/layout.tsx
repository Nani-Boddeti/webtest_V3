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
        <script
          type="application/ld+json"
          // Structured data describing the tool itself; safe to render inline.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Smartwatch Comparison',
              url: 'http://localhost:3000',
              description:
                'Compare smartwatches side by side across price, battery life, sleep tracking, durability, and subscription-free operation.',
              applicationCategory: 'UtilityApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
