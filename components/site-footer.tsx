import Link from "next/link";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="heading-display text-xl">Carros</p>
          <p className="mt-1 max-w-sm text-sm text-[var(--color-muted)]">
            Marketplace local para conectar quem vende e quem quer comprar na sua região.
          </p>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm font-medium text-[var(--color-muted)]">
          <Link href={`${base}/anuncios`} className="transition hover:text-[var(--color-accent)]">
            Anúncios
          </Link>
          <Link href={`${base}/publicar`} className="transition hover:text-[var(--color-accent)]">
            Vender
          </Link>
        </nav>
      </div>
      <div className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-dim)]">
        Carros · MVP
      </div>
    </footer>
  );
}
