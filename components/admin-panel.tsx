"use client";

import { formatDate, formatPrice, listingTitle } from "@/lib/format";
import type { InterestWithListing } from "@/lib/types";
import { FormEvent, useState } from "react";

export function AdminPanel() {
  const [secret, setSecret] = useState("");
  const [rows, setRows] = useState<InterestWithListing[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRows(null);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anon) {
      setError("Variáveis Supabase não configuradas.");
      setLoading(false);
      return;
    }

    const res = await fetch(`${url}/functions/v1/admin-interests`, {
      headers: {
        Authorization: `Bearer ${anon}`,
        "x-admin-secret": secret,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      setError(res.status === 401 ? "Segredo inválido." : body || res.statusText);
      setLoading(false);
      return;
    }

    const data = (await res.json()) as { interests: InterestWithListing[] };
    setRows(data.interests);
    setLoading(false);
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <form
        onSubmit={load}
        className="flex flex-col gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span>Segredo admin</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Carregando…" : "Carregar interesses"}
        </button>
      </form>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {rows && (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[var(--color-line)] text-[var(--color-muted)]">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Interessado</th>
                <th className="p-4">Veículo</th>
                <th className="p-4">Vendedor</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-[var(--color-muted)]">
                    Nenhum interesse registrado.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-[var(--color-line)] align-top">
                    <td className="p-4 whitespace-nowrap">{formatDate(row.created_at)}</td>
                    <td className="p-4">
                      <p className="font-medium">{row.name ?? "—"}</p>
                      <p>{row.email}</p>
                      <p>{row.phone}</p>
                      {row.message && (
                        <p className="mt-1 text-[var(--color-muted)]">{row.message}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-medium">
                        {listingTitle(
                          row.listings.brand,
                          row.listings.model,
                          row.listings.year,
                        )}
                      </p>
                      <p>{formatPrice(Number(row.listings.price))}</p>
                      <p className="text-[var(--color-muted)]">
                        {row.listings.city} · {row.listings.region}
                      </p>
                    </td>
                    <td className="p-4">
                      <p>{row.listings.seller_name}</p>
                      <p>{row.listings.seller_email}</p>
                      <p>{row.listings.seller_phone}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
