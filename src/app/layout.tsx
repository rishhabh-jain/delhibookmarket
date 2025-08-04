import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { CartProvider } from "@/context/CartContext";
import AlertProvider from "@/context/AlertContext";
import ScrollToTop from "@/components/ScrollTotop";
import Script from "next/script";
import GoogleAnalytics from "@/components/googleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Delhi book market",
  description: "Buy books at cheap prize",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Providers>
            <AlertProvider>
              <ScrollToTop />

              {children}
            </AlertProvider>
          </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
