"use client";

import { appPath } from "@/lib/base-path";
import { FormEvent } from "react";

export function HomeQuickSearch() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const region = String(fd.get("region") ?? "").trim();
    const q = String(fd.get("q") ?? "").trim();
    if (region) params.set("region", region);
    if (q) params.set("q", q);
    const query = params.toString();
    const target = query ? `/anuncios?${query}` : "/anuncios";
    window.location.assign(appPath(target));
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        name="region"
        placeholder="Sua região (ex.: Grande Recife)"
        className="input-field"
      />
      <input name="q" placeholder="Marca ou modelo" className="input-field" />
      <button type="submit" className="btn-primary mt-1 w-full">
        Buscar agora
      </button>
    </form>
  );
}
