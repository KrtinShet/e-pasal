import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-display">Baazarify Dashboard</h1>
        <p className="text-[var(--muted)]">Merchant workspace for catalog and order operations.</p>
        <Link className="btn-primary" href="/products">
          Open Catalog Manager
        </Link>
      </div>
    </main>
  );
}
