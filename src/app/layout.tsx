import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bank Statement Converter Pro | Door Artur Bagdasarjan",
  description: "Converteer PDF bankafschriften naar Excel/CSV. Professionele SaaS voor boekhouders en ZZP'ers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="nl" className="scroll-smooth">
        <body className={inter.className}>
          {children}
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
