import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export const metadata: Metadata = {
  title: "Herbsvedic — Ayurvedic Wellness",
  description: "Ayurvedic products, consultations, and wellness guidance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="pt-[117px] md:pt-[50px] lg:pt-[110px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}