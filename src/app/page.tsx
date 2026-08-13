export default function Home() {
  return (
    <main className="page-container flex min-h-screen flex-col justify-center py-16">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Smartwatch comparison
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find the smartwatch that fits your life
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Compare two or more watches across price, battery life, sleep tracking,
          durability, and subscription-free operation.
        </p>
      </header>
    </main>
  );
}
