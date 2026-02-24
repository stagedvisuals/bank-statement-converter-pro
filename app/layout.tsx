import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BSC Pro | Bank Statement Converter voor Boekhouders",
  description: "Converteer PDF bankafschriften automatisch naar Excel, CSV en MT940. 99.5% nauwkeurig. Tijd besparen voor boekhouders en ondernemers.",
  keywords: "bank statement converter, PDF naar Excel, bankafschrift converter, MT940 export, boekhouding automatisering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
