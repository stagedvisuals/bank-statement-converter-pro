import { useAuth, UserButton } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn) {
    return <div className="min-h-screen flex items-center justify-center text-white">Laden...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold gradient-text">BSC Pro</Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">
                Credits: <span className="text-[var(--neon-blue)] font-bold">2</span>
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <p>Welkom bij Bank Statement Converter Pro!</p>
          <p className="text-gray-400 mt-4">Upload functionaliteit komt binnenkort beschikbaar.</p>
        </div>
      </main>
    </div>
  )
}
