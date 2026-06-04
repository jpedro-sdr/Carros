export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKm(value: number | null): string {
  if (value == null) return "—";
  return `${new Intl.NumberFormat("pt-BR").format(value)} km`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function listingTitle(brand: string, model: string, year: number): string {
  return `${brand} ${model} · ${year}`;
}
