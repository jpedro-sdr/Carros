"use client";

import { ListingCard } from "@/components/listing-card";
import { SearchFilters } from "@/components/search-filters";
import { fetchListings } from "@/lib/listings";
import { createClient } from "@/lib/supabase/client";
import type { ListingFilters, ListingWithPhotos } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AnunciosContent() {
  const params = useSearchParams();
  const [listings, setListings] = useState<ListingWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const filters: ListingFilters = {
      q: params.get("q") ?? undefined,
      brand: params.get("brand") ?? undefined,
      model: params.get("model") ?? undefined,
      region: params.get("region") ?? undefined,
      city: params.get("city") ?? undefined,
      yearMin: params.get("yearMin") ? Number(params.get("yearMin")) : undefined,
      yearMax: params.get("yearMax") ? Number(params.get("yearMax")) : undefined,
      priceMin: params.get("priceMin") ? Number(params.get("priceMin")) : undefined,
      priceMax: params.get("priceMax") ? Number(params.get("priceMax")) : undefined,
    };

    setLoading(true);
    const supabase = createClient();
    fetchListings(supabase, filters)
      .then(setListings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Catálogo</p>
        <h1 className="heading-display text-4xl sm:text-5xl">Explorar veículos</h1>
        <p className="mt-3 text-lg text-[var(--color-muted)]">
          Filtre por região, modelo, ano e faixa de preço — como nos marketplaces automotivos
          modernos.
        </p>
      </div>
      <SearchFilters />
      <div className="mt-10">
        {!loading && !error && (
          <p className="mb-6 text-sm text-[var(--color-dim)]">
            <span className="font-bold text-[var(--color-text)]">{listings.length}</span>{" "}
            {listings.length === 1 ? "veículo encontrado" : "veículos encontrados"}
          </p>
        )}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-pulse aspect-[16/10] rounded-2xl" />
            ))}
          </div>
        )}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <div className="glass-panel p-12 text-center text-[var(--color-muted)]">
            Nenhum anúncio encontrado. Tente outros filtros.
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnunciosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-[var(--color-muted)]">
          Carregando…
        </div>
      }
    >
      <AnunciosContent />
    </Suspense>
  );
}
