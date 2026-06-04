"use client";

import { InterestForm } from "@/components/interest-form";
import { formatKm, formatPrice, listingTitle } from "@/lib/format";
import { fetchListingById } from "@/lib/listings";
import { createClient, publicPhotoUrl } from "@/lib/supabase/client";
import type { ListingWithPhotos } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function DetalheContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [listing, setListing] = useState<ListingWithPhotos | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    fetchListingById(supabase, id)
      .then(setListing)
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <p className="p-12 text-center text-[var(--color-muted)]">
        ID do anúncio não informado.
      </p>
    );
  }

  if (loading) {
    return <p className="p-12 text-center">Carregando…</p>;
  }

  if (!listing) {
    return (
      <p className="p-12 text-center">
        Anúncio não encontrado.{" "}
        <Link href={`${base}/anuncios`} className="text-[var(--color-accent)]">
          Voltar
        </Link>
      </p>
    );
  }

  const photos = listing.listing_photos;
  const cover = photos[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href={`${base}/anuncios`} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
        ← Anúncios
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[var(--color-line)]">
            {cover ? (
              <Image
                src={publicPhotoUrl(cover.storage_path)}
                alt={listingTitle(listing.brand, listing.model, listing.year)}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
                Sem fotos
              </div>
            )}
          </div>
          {photos.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {photos.slice(1, 5).map((p) => (
                <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={publicPhotoUrl(p.storage_path)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl">
              {listing.brand} {listing.model}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-accent)]">
              {formatPrice(Number(listing.price))}
            </p>
            <p className="mt-1 text-[var(--color-muted)]">
              {listing.year} · {listing.city}, {listing.region}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[var(--color-muted)]">Quilometragem</dt>
              <dd className="font-medium">{formatKm(listing.mileage)}</dd>
            </div>
            {listing.fuel && (
              <div>
                <dt className="text-[var(--color-muted)]">Combustível</dt>
                <dd className="font-medium">{listing.fuel}</dd>
              </div>
            )}
            {listing.transmission && (
              <div>
                <dt className="text-[var(--color-muted)]">Câmbio</dt>
                <dd className="font-medium">{listing.transmission}</dd>
              </div>
            )}
          </dl>
          {listing.description && (
            <p className="text-[var(--color-muted)] leading-relaxed">{listing.description}</p>
          )}
          <InterestForm listingId={listing.id} />
        </div>
      </div>
    </div>
  );
}

export default function DetalhePage() {
  return (
    <Suspense fallback={<div className="p-12">Carregando…</div>}>
      <DetalheContent />
    </Suspense>
  );
}
