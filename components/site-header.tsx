import Link from "next/link";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href={`${base}/`} className="group flex flex-col gap-0.5">
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--color-forest)] transition group-hover:text-[var(--color-accent)]">
            Carros
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Conecta venda e interesse
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium sm:gap-4">
          <Link
            href={`${base}/anuncios`}
            className="rounded-full px-3 py-2 text-[var(--color-muted)] transition hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-ink)]"
          >
            Anúncios
          </Link>
          <Link
            href={`${base}/publicar`}
            className="rounded-full bg-[var(--color-forest)] px-4 py-2 text-white transition hover:bg-[var(--color-accent)]"
          >
            Vender meu carro
          </Link>
        </nav>
      </div>
    </header>
  );
}
