"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useTransition } from "react";

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
      router.push(`/anuncios?${next.toString()}`);
    });
  }

  const fields = [
    { name: "q", label: "Busca", placeholder: "Marca, modelo, cidade…", span: "lg:col-span-2", type: "text" },
    { name: "brand", label: "Marca", placeholder: "", span: "", type: "text" },
    { name: "model", label: "Modelo", placeholder: "", span: "", type: "text" },
    { name: "region", label: "Região", placeholder: "Ex.: Grande Recife", span: "", type: "text" },
    { name: "city", label: "Cidade", placeholder: "", span: "", type: "text" },
    { name: "yearMin", label: "Ano mín.", placeholder: "", span: "", type: "number" },
    { name: "yearMax", label: "Ano máx.", placeholder: "", span: "", type: "number" },
    { name: "priceMin", label: "Preço mín.", placeholder: "", span: "", type: "number" },
    { name: "priceMax", label: "Preço máx.", placeholder: "", span: "", type: "number" },
  ] as const;

  return (
    <form onSubmit={onSubmit} className="glass-panel grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-dim)] text-[var(--color-accent)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" />
          </svg>
        </span>
        <p className="text-sm font-semibold text-[var(--color-text)]">Refine sua busca</p>
      </div>
      {fields.map((f) => (
        <label key={f.name} className={`flex flex-col gap-2 ${f.span}`}>
          <span className="label-field">{f.label}</span>
          <input
            name={f.name}
            type={f.type}
            defaultValue={params.get(f.name) ?? ""}
            placeholder={f.placeholder}
            className="input-field"
          />
        </label>
      ))}
      <div className="flex items-end sm:col-span-2 lg:col-span-4">
        <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto">
          {pending ? "Buscando…" : "Buscar veículos"}
        </button>
      </div>
    </form>
  );
}
