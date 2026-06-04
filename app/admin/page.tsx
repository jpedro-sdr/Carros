import { AdminPanel } from "@/components/admin-panel";

export const metadata = {
  title: "Admin — Carros",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-2">Interno</p>
        <h1 className="heading-display text-3xl">Interesses</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Uso interno — contato manual com vendedores.
        </p>
        <div className="mt-10">
          <AdminPanel />
        </div>
      </div>
    </div>
  );
}
