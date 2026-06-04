import type { ListingFilters, ListingWithPhotos } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchListings(
  supabase: SupabaseClient,
  filters: ListingFilters = {},
): Promise<ListingWithPhotos[]> {
  let query = supabase
    .from("listings")
    .select("*, listing_photos(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (filters.brand?.trim()) {
    query = query.ilike("brand", `%${filters.brand.trim()}%`);
  }
  if (filters.model?.trim()) {
    query = query.ilike("model", `%${filters.model.trim()}%`);
  }
  if (filters.region?.trim()) {
    query = query.ilike("region", `%${filters.region.trim()}%`);
  }
  if (filters.city?.trim()) {
    query = query.ilike("city", `%${filters.city.trim()}%`);
  }
  if (filters.yearMin != null) query = query.gte("year", filters.yearMin);
  if (filters.yearMax != null) query = query.lte("year", filters.yearMax);
  if (filters.priceMin != null) query = query.gte("price", filters.priceMin);
  if (filters.priceMax != null) query = query.lte("price", filters.priceMax);

  const { data, error } = await query;

  if (error) throw error;

  let rows = (data ?? []) as ListingWithPhotos[];

  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    rows = rows.filter((row) => {
      const hay = `${row.brand} ${row.model} ${row.city} ${row.region} ${row.year}`.toLowerCase();
      return hay.includes(q);
    });
  }

  for (const row of rows) {
    row.listing_photos.sort((a, b) => a.sort_order - b.sort_order);
  }

  return rows;
}

export async function fetchListingById(
  supabase: SupabaseClient,
  id: string,
): Promise<ListingWithPhotos | null> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_photos(*)")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as ListingWithPhotos;
  row.listing_photos.sort((a, b) => a.sort_order - b.sort_order);
  return row;
}
