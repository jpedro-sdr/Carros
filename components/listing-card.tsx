import { formatPrice, listingTitle } from "@/lib/format";
import { publicPhotoUrl } from "@/lib/supabase/client";
import type { ListingWithPhotos } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = { listing: ListingWithPhotos };

export function ListingCard({ listing }: Props) {
  const photo = listing.listing_photos[0];
  const src = photo ? publicPhotoUrl(photo.storage_path) : null;

  return (
    <Link
      href={`${base}/anuncios/ver?id=${listing.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-elevated)]">
        {src ? (
          <Image
            src={src}
            alt={listingTitle(listing.brand, listing.model, listing.year)}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--color-dim)]">
            Sem foto
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-md bg-black/50 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
            {listing.year}
          </span>
          {listing.listing_photos.length > 1 && (
            <span className="rounded-md bg-black/50 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
              +{listing.listing_photos.length - 1} fotos
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {formatPrice(Number(listing.price))}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h2 className="heading-display text-lg leading-tight">
          {listing.brand}{" "}
          <span className="text-[var(--color-muted)] font-semibold">{listing.model}</span>
        </h2>
        <p className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          {listing.city} · {listing.region}
        </p>
      </div>
    </Link>
  );
}
