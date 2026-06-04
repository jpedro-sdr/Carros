"use client";

import { createClient } from "@/lib/supabase/client";
import { FormEvent, useState } from "react";

type Props = { listingId: string };

export function InterestForm({ listingId }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const name = String(fd.get("name") ?? "").trim() || null;
    const message = String(fd.get("message") ?? "").trim() || null;

    if (!email || !phone) {
      setError("E-mail e telefone são obrigatórios.");
      setStatus("error");
      return;
    }

    const supabase = createClient();
    const { error: insertError } = await supabase.from("interests").insert({
      listing_id: listingId,
      email,
      phone,
      name,
      message,
    });

    if (insertError) {
      setError(insertError.message);
      setStatus("error");
      return;
    }

    setStatus("ok");
    e.currentTarget.reset();
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-[var(--color-forest)]/30 bg-[var(--color-accent-soft)] p-6 text-center">
        <p className="font-semibold text-[var(--color-forest)]">Interesse enviado</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Entraremos em contato em breve sobre este veículo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
      <h3 className="font-[family-name:var(--font-display)] text-xl">Tenho interesse</h3>
      <label className="flex flex-col gap-1 text-sm">
        <span>Nome (opcional)</span>
        <input name="name" className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>E-mail *</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>Telefone *</span>
        <input
          name="phone"
          type="tel"
          required
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span>Mensagem (opcional)</span>
        <textarea
          name="message"
          rows={3}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-2"
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Enviando…" : "Enviar interesse"}
      </button>
    </form>
  );
}
