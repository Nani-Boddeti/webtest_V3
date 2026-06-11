import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Beauty Tips — Your Daily Dose of Glamour",
  description: "Discover expert beauty tips for skincare, makeup, and haircare.",
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
      <body className="min-h-full flex flex-col">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="text-xl font-bold text-pink-600 hover:text-pink-700"
            >
              ✨ Beauty Tips
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-pink-600"
              >
                Home
              </Link>
              <Link
                href="/tips/page/1"
                className="text-sm font-medium text-gray-600 hover:text-pink-600"
              >
                All Tips
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-gray-50 py-8">
          <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
            &copy; {new Date().getFullYear()} Beauty Tips. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
