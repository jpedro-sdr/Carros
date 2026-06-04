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
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/40 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-[var(--color-line)]">
        {src ? (
          <Image
            src={src}
            alt={listingTitle(listing.brand, listing.model, listing.year)}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted)]">
            Sem foto
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[var(--color-surface)]/95 px-3 py-1 text-xs font-semibold text-[var(--color-forest)]">
          {listing.year}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl leading-tight">
          {listing.brand} {listing.model}
        </h2>
        <p className="text-lg font-semibold text-[var(--color-accent)]">
          {formatPrice(Number(listing.price))}
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          {listing.city} · {listing.region}
        </p>
      </div>
    </Link>
  );
}
