import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tapas — small plates, made to share",
  description:
    "Wings, nachos, tacos and sliders, all built for the middle of the table. Book a table at Tapas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${archivo.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
