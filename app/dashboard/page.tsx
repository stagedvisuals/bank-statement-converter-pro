'use client'

import { useAuth, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import FileConverter from '@/components/file-converter'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const [credits, setCredits] = useState(2)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-white">Laden...</div>
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold gradient-text">BSC Pro</Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">
                Credits: <span className="text-[var(--neon-blue)] font-bold">{credits}</span>
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Converter */}
        <div className="glass rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Nieuwe Conversie</h2>
          <FileConverter />
        </div>

        {/* Instructions */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Hoe werkt het?</h2>
          <ol className="text-gray-400 space-y-2 list-decimal list-inside">
            <li>Upload je PDF bankafschrift</li>
            <li>Wacht op de conversie</li>
            <li>Download je Excel bestand</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
