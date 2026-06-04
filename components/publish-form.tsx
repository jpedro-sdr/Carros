"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

const MAX_PHOTOS = 10;
const MAX_SIZE = 5 * 1024 * 1024;
export function PublishForm() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function onFilesChange(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length > MAX_PHOTOS) {
      setError(`Máximo de ${MAX_PHOTOS} fotos.`);
      return;
    }
    for (const f of picked) {
      if (f.size > MAX_SIZE) {
        setError("Cada foto deve ter no máximo 5 MB.");
        return;
      }
    }
    setError(null);
    setFiles(picked);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const listing = {
      brand: String(fd.get("brand")).trim(),
      model: String(fd.get("model")).trim(),
      year: Number(fd.get("year")),
      price: Number(fd.get("price")),
      mileage: fd.get("mileage") ? Number(fd.get("mileage")) : null,
      fuel: String(fd.get("fuel") || "").trim() || null,
      transmission: String(fd.get("transmission") || "").trim() || null,
      city: String(fd.get("city")).trim(),
      region: String(fd.get("region")).trim(),
      description: String(fd.get("description") || "").trim() || null,
      seller_name: String(fd.get("seller_name")).trim(),
      seller_email: String(fd.get("seller_email")).trim(),
      seller_phone: String(fd.get("seller_phone")).trim(),
      status: "active" as const,
    };

    if (
      !listing.brand ||
      !listing.model ||
      !listing.city ||
      !listing.region ||
      !listing.seller_name ||
      !listing.seller_email ||
      !listing.seller_phone
    ) {
      setError("Preencha todos os campos obrigatórios.");
      setStatus("error");
      return;
    }

    const supabase = createClient();
    const { data: created, error: insertError } = await supabase
      .from("listings")
      .insert(listing)
      .select("id")
      .single();

    if (insertError || !created) {
      setError(insertError?.message ?? "Erro ao criar anúncio.");
      setStatus("error");
      return;
    }

    const listingId = created.id as string;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${listingId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-photos")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(`Falha no upload da foto ${i + 1}: ${uploadError.message}`);
        setStatus("error");
        return;
      }

      const { error: photoRowError } = await supabase.from("listing_photos").insert({
        listing_id: listingId,
        storage_path: path,
        sort_order: i,
      });

      if (photoRowError) {
        setError(photoRowError.message);
        setStatus("error");
        return;
      }
    }

    router.push(`/anuncios/ver?id=${listingId}`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-2xl flex-col gap-6">
      <section className="glass-panel grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="heading-display text-xl sm:col-span-2">Dados do veículo</h2>
        {[
          ["brand", "Marca *", "text"],
          ["model", "Modelo *", "text"],
          ["year", "Ano *", "number"],
          ["price", "Preço (R$) *", "number"],
          ["mileage", "Quilometragem", "number"],
          ["fuel", "Combustível", "text"],
          ["transmission", "Câmbio", "text"],
          ["city", "Cidade *", "text"],
          ["region", "Região *", "text"],
        ].map(([name, label, type]) => (
          <label key={name} className="flex flex-col gap-2">
            <span className="label-field">{label}</span>
            <input
              name={name}
              type={type}
              required={label.includes("*")}
              className="input-field"
            />
          </label>
        ))}
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="label-field">Descrição</span>
          <textarea name="description" rows={4} className="input-field resize-none" />
        </label>
      </section>

      <section className="glass-panel grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="heading-display text-xl sm:col-span-2">Seu contato</h2>
        {[
          ["seller_name", "Nome *"],
          ["seller_email", "E-mail *"],
          ["seller_phone", "Telefone *"],
        ].map(([name, label]) => (
          <label key={name} className="flex flex-col gap-2 sm:col-span-2">
            <span className="label-field">{label}</span>
            <input
              name={name}
              required
              type={name === "seller_email" ? "email" : name === "seller_phone" ? "tel" : "text"}
              className="input-field"
            />
          </label>
        ))}
      </section>

      <section className="glass-panel p-6">
        <h2 className="heading-display text-xl">Fotos do veículo</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Até {MAX_PHOTOS} imagens · JPEG, PNG ou WebP · máx. 5 MB cada
        </p>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-6 py-10 transition hover:border-[var(--color-accent)]/50">
          <span className="text-sm font-semibold text-[var(--color-accent)]">
            Clique para selecionar fotos
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={onFilesChange}
            className="sr-only"
          />
        </label>
        {files.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {files.map((f) => (
              <li
                key={f.name}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-xs text-[var(--color-muted)]"
              >
                {f.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full py-4">
        {status === "loading" ? "Publicando…" : "Publicar anúncio"}
      </button>
    </form>
  );
}
