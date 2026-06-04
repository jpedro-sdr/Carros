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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-forest)]">
        Anúncios
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Filtre por região, modelo, ano e preço.
      </p>
      <div className="mt-8">
        <SearchFilters />
      </div>
      <div className="mt-10">
        {loading && <p className="text-[var(--color-muted)]">Carregando…</p>}
        {error && <p className="text-red-700">{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <p className="text-[var(--color-muted)]">Nenhum anúncio encontrado.</p>
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
    <Suspense fallback={<div className="p-12 text-center">Carregando filtros…</div>}>
      <AnunciosContent />
    </Suspense>
  );
}
