export type ListingStatus = "active" | "sold" | "paused";

export type Listing = {
  id: string;
  created_at: string;
  updated_at: string;
  status: ListingStatus;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  fuel: string | null;
  transmission: string | null;
  city: string;
  region: string;
  description: string | null;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
};

export type ListingPhoto = {
  id: string;
  listing_id: string;
  storage_path: string;
  sort_order: number;
};

export type Interest = {
  id: string;
  listing_id: string;
  name: string | null;
  email: string;
  phone: string;
  message: string | null;
  created_at: string;
};

export type ListingWithPhotos = Listing & {
  listing_photos: ListingPhoto[];
};

export type InterestWithListing = Interest & {
  listings: Pick<
    Listing,
    | "id"
    | "brand"
    | "model"
    | "year"
    | "price"
    | "city"
    | "region"
    | "seller_name"
    | "seller_email"
    | "seller_phone"
  >;
};

export type ListingFilters = {
  q?: string;
  brand?: string;
  model?: string;
  region?: string;
  city?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
};
