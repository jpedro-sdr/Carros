import { AdminPanel } from "@/components/admin-panel";

export const metadata = {
  title: "Admin — Carros",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
          Interesses (privado)
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Uso interno — não compartilhe este link. Contato manual com vendedores.
        </p>
        <div className="mt-8">
          <AdminPanel />
        </div>
      </div>
    </div>
  );
}
