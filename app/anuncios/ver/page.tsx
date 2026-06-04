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
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    fetchListingById(supabase, id)
      .then((row) => {
        setListing(row);
        setActivePhoto(0);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <p className="p-12 text-center text-[var(--color-muted)]">ID do anúncio não informado.</p>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="skeleton-pulse aspect-[16/9] rounded-3xl" />
      </div>
    );
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
  const cover = photos[activePhoto] ?? photos[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Link href={`${base}/anuncios`} className="link-back">
        <span aria-hidden>←</span> Voltar ao catálogo
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]">
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
              <div className="flex h-full items-center justify-center text-[var(--color-dim)]">
                Sem fotos
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          {photos.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === activePhoto
                      ? "border-[var(--color-accent)]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={publicPhotoUrl(p.storage_path)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div>
            <p className="eyebrow mb-2">
              {listing.year} · {listing.city}
            </p>
            <h1 className="heading-display text-3xl sm:text-4xl">
              {listing.brand} {listing.model}
            </h1>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--color-cta)]">
              {formatPrice(Number(listing.price))}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{listing.region}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="spec-chip">
              <dt>Quilometragem</dt>
              <dd>{formatKm(listing.mileage)}</dd>
            </div>
            {listing.fuel && (
              <div className="spec-chip">
                <dt>Combustível</dt>
                <dd>{listing.fuel}</dd>
              </div>
            )}
            {listing.transmission && (
              <div className="spec-chip">
                <dt>Câmbio</dt>
                <dd>{listing.transmission}</dd>
              </div>
            )}
            <div className="spec-chip">
              <dt>Ano</dt>
              <dd>{listing.year}</dd>
            </div>
          </div>

          {listing.description && (
            <div className="glass-panel p-5">
              <p className="label-field mb-2">Descrição</p>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                {listing.description}
              </p>
            </div>
          )}

          <InterestForm listingId={listing.id} />
        </div>
      </div>
    </div>
  );
}

export default function DetalhePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-[var(--color-muted)]">
          Carregando…
        </div>
      }
    >
      <DetalheContent />
    </Suspense>
  );
}
