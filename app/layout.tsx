import { SiteHeader } from "@/components/site-header";
import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Carros — Conecta venda e interesse",
  description:
    "Publique seu carro, encontre veículos por região e manifeste interesse em compra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${instrument.variable} font-sans`}>
        <SiteHeader />
        <main>{children}</main>
        <footer className="mt-20 border-t border-[var(--color-line)] py-10 text-center text-sm text-[var(--color-muted)]">
          Carros · MVP
        </footer>
      </body>
    </html>
  );
}
