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
      <div className="rounded-2xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 p-6 text-center">
        <p className="font-bold text-[var(--color-success)]">Interesse enviado</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Entraremos em contato em breve sobre este veículo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel flex flex-col gap-4 p-6">
      <div>
        <h3 className="heading-display text-xl">Tenho interesse</h3>
        <p className="mt-1 text-xs text-[var(--color-dim)]">
          Deixe seus dados — nossa equipe faz a ponte com o vendedor.
        </p>
      </div>
      <label className="flex flex-col gap-2">
        <span className="label-field">Nome (opcional)</span>
        <input name="name" className="input-field" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="label-field">E-mail *</span>
        <input name="email" type="email" required className="input-field" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="label-field">Telefone *</span>
        <input name="phone" type="tel" required className="input-field" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="label-field">Mensagem (opcional)</span>
        <textarea name="message" rows={3} className="input-field resize-none" />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? "Enviando…" : "Enviar interesse"}
      </button>
    </form>
  );
}
