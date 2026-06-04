import { PublishForm } from "@/components/publish-form";

export default function PublicarPage() {
  return (
    <div className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-forest)]">
          Vender meu carro
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Publicação aberta — qualquer pessoa pode anunciar. Até 10 fotos.
        </p>
      </div>
      <div className="mt-10">
        <PublishForm />
      </div>
    </div>
  );
}
