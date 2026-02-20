import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bank Statement Converter Pro | Door Artur Bagdasarjan',
  description: 'Converteer PDF bankafschriften naar Excel/CSV',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="nl">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
