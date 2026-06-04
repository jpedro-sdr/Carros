import { PublishForm } from "@/components/publish-form";

export default function PublicarPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-3">Anunciar</p>
        <h1 className="heading-display text-4xl sm:text-5xl">Vender meu carro</h1>
        <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">
          Publicação aberta. Preencha os dados, envie até 10 fotos e seu anúncio entra no catálogo
          na hora.
        </p>
      </div>
      <div className="mt-12">
        <PublishForm />
      </div>
    </div>
  );
}
