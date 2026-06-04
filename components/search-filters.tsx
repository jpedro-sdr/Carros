"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useTransition } from "react";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    for (const [key, value] of fd.entries()) {
      if (typeof value === "string" && value.trim()) next.set(key, value.trim());
    }
    startTransition(() => {
      router.push(`${base}/anuncios?${next.toString()}`);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <label className="flex flex-col gap-1 text-sm lg:col-span-2">
        <span className="text-[var(--color-muted)]">Busca geral</span>
        <input
          name="q"
          defaultValue={params.get("q") ?? ""}
          placeholder="Marca, modelo, cidade…"
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[var(--color-muted)]">Marca</span>
        <input
          name="brand"
          defaultValue={params.get("brand") ?? ""}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[var(--color-muted)]">Modelo</span>
        <input
          name="model"
          defaultValue={params.get("model") ?? ""}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[var(--color-muted)]">Região</span>
        <input
          name="region"
          defaultValue={params.get("region") ?? ""}
          placeholder="Ex.: Grande Recife"
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[var(--color-muted)]">Cidade</span>
        <input
          name="city"
          defaultValue={params.get("city") ?? ""}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[var(--color-muted)]">Ano mín.</span>
        <input
          name="yearMin"
          type="number"
          defaultValue={params.get("yearMin") ?? ""}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[var(--color-muted)]">Ano máx.</span>
        <input
          name="yearMax"
          type="number"
          defaultValue={params.get("yearMax") ?? ""}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[var(--color-muted)]">Preço mín. (R$)</span>
        <input
          name="priceMin"
          type="number"
          defaultValue={params.get("priceMin") ?? ""}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-[var(--color-muted)]">Preço máx. (R$)</span>
        <input
          name="priceMax"
          type="number"
          defaultValue={params.get("priceMax") ?? ""}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
      </label>
      <div className="flex items-end sm:col-span-2 lg:col-span-4">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[var(--color-forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)] disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Buscando…" : "Buscar anúncios"}
        </button>
      </div>
    </form>
  );
}
