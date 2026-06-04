"use client";

import { ListingCard } from "@/components/listing-card";
import { fetchListings } from "@/lib/listings";
import { createClient } from "@/lib/supabase/client";
import type { ListingWithPhotos } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [listings, setListings] = useState<ListingWithPhotos[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    fetchListings(supabase).then((rows) => {
      setCount(rows.length);
      setListings(rows.slice(0, 6));
    });
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:py-24">
          <div className="flex flex-col gap-8">
            <p className="eyebrow">Marketplace automotivo local</p>
            <h1 className="heading-display max-w-2xl text-4xl leading-[1.02] sm:text-5xl lg:text-[3.25rem]">
              O carro certo,{" "}
              <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-cta)] bg-clip-text text-transparent">
                perto de você
              </span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-[var(--color-muted)]">
              Anuncie em minutos, explore por região e preço, e receba interesses de compradores —
              nós conectamos as partes.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/anuncios" className="btn-primary">
                Explorar estoque
              </Link>
              <Link href="/publicar" className="btn-secondary">
                Anunciar meu carro
              </Link>
            </div>
            {count > 0 && (
              <p className="text-sm text-[var(--color-dim)]">
                <span className="font-bold text-[var(--color-accent)]">{count}</span> veículos
                disponíveis agora
              </p>
            )}
          </div>

          <div className="glass-panel mt-10 p-6 lg:mt-0">
            <p className="label-field mb-4">Busca rápida</p>
            <form action="/anuncios" className="flex flex-col gap-3">
              <input
                name="region"
                placeholder="Sua região (ex.: Grande Recife)"
                className="input-field"
              />
              <input name="q" placeholder="Marca ou modelo" className="input-field" />
              <button type="submit" className="btn-primary mt-1 w-full">
                Buscar agora
              </button>
            </form>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-6 text-center">
              {[
                ["Filtros", "Ano · Preço"],
                ["Fotos", "Até 10"],
                ["Região", "Cidade"],
              ].map(([t, s]) => (
                <div key={t}>
                  <p className="text-xs font-bold text-[var(--color-text)]">{t}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--color-dim)]">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Destaques</p>
            <h2 className="heading-display text-3xl sm:text-4xl">Anúncios recentes</h2>
          </div>
          <Link
            href="/anuncios"
            className="text-sm font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-cta)]"
          >
            Ver todos →
          </Link>
        </div>
        {listings.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <p className="text-[var(--color-muted)]">
              Nenhum anúncio ainda.{" "}
              <Link href="/publicar" className="font-semibold text-[var(--color-accent)]">
                Seja o primeiro
              </Link>
            </p>
          </div>
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
