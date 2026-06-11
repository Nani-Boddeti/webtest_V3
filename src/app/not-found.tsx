import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-24">
      <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-600">
        The tip you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/tips/page/1"
        className="mt-6 rounded-lg bg-pink-600 px-6 py-3 text-sm font-medium text-white hover:bg-pink-700 transition"
      >
        Browse all tips
      </Link>
    </div>
  );
}
