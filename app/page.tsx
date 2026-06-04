"use client";

import { ListingCard } from "@/components/listing-card";
import { fetchListings } from "@/lib/listings";
import { createClient } from "@/lib/supabase/client";
import type { ListingWithPhotos } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function HomePage() {
  const [listings, setListings] = useState<ListingWithPhotos[]>([]);

  useEffect(() => {
    const supabase = createClient();
    fetchListings(supabase).then((rows) => setListings(rows.slice(0, 6)));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-line)]">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[var(--color-accent-soft)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-48 w-48 rounded-full bg-[var(--color-forest)]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
              Marketplace local
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.05] text-[var(--color-forest)] sm:text-5xl lg:text-6xl">
              Encontre o carro certo na sua região
            </h1>
            <p className="max-w-lg text-lg text-[var(--color-muted)]">
              Anuncie em minutos, receba interesses de compradores e deixe nossa equipe
              conectar vocês.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`${base}/anuncios`}
                className="rounded-full bg-[var(--color-forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)]"
              >
                Ver anúncios
              </Link>
              <Link
                href={`${base}/publicar`}
                className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--color-accent)]"
              >
                Vender meu carro
              </Link>
            </div>
          </div>
          <div className="hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 lg:block">
            <p className="text-sm text-[var(--color-muted)]">Busca rápida</p>
            <form action={`${base}/anuncios`} className="mt-4 flex flex-col gap-3">
              <input
                name="region"
                placeholder="Sua região"
                className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-4 py-3"
              />
              <input
                name="q"
                placeholder="Marca ou modelo"
                className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-4 py-3"
              />
              <button
                type="submit"
                className="rounded-full bg-[var(--color-accent)] py-3 text-sm font-semibold text-white"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl">Recentes</h2>
          <Link href={`${base}/anuncios`} className="text-sm font-medium text-[var(--color-accent)]">
            Ver todos →
          </Link>
        </div>
        {listings.length === 0 ? (
          <p className="text-[var(--color-muted)]">
            Nenhum anúncio ainda.{" "}
            <Link href={`${base}/publicar`} className="text-[var(--color-accent)]">
              Seja o primeiro
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
