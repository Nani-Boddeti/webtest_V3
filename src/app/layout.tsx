import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beauty Tips Hub - Expert Skincare, Makeup & Hair Advice",
  description:
    "Discover expert beauty tips on skincare routines, makeup tutorials, and hair care. Your daily guide to looking and feeling your best.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
        <header className="border-b border-gray-200 dark:border-zinc-700">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <a href="/" className="text-xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  BeautyTips
                </span>
                <span className="text-gray-500 dark:text-gray-400">Hub</span>
              </a>
              <nav className="flex items-center gap-6">
                <a
                  href="/tips"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  All Tips
                </a>
                <a
                  href="/tips?category=Skincare"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Skincare
                </a>
                <a
                  href="/tips?category=Makeup"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Makeup
                </a>
                <a
                  href="/tips?category=Hair"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Hair
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 dark:border-zinc-700 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} BeautyTipsHub. All beauty tips are for informational purposes only.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
