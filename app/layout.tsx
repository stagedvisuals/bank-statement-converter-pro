import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

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
    <html lang="nl" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
