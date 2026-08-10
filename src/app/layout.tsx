import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import CartSidebar from "@/components/layouts/CartSidebar";
import { Fraunces, Work_Sans } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600"],
});

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
      <body className={`${fraunces.variable} ${workSans.variable} font-body bg-sand text-bark`}>
        <Providers>
          <ToastContainer position="top-right" autoClose={3000} />
          <Header />
          <CartSidebar />
          <main className="pt-29.25 md:pt-12.5 lg:pt-27.5">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}