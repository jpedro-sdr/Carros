import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-cta)] text-sm font-black text-white shadow-md"
            aria-hidden
          >
            C
          </span>
          <span className="flex flex-col">
            <span className="heading-display text-lg leading-none tracking-tight group-hover:text-[var(--color-accent)] transition">
              Carros
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-dim)]">
              Venda · Compra · Região
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/anuncios" className="btn-ghost hidden sm:inline-flex">
            Explorar
          </Link>
          <Link href="/publicar" className="btn-primary text-xs sm:text-sm">
            Vender meu carro
          </Link>
        </nav>
      </div>
    </header>
  );
}
