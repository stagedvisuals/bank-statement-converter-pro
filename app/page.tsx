'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import LandingPage from '@/components/landing-page'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-white">Laden...</div>
  }

  if (isSignedIn) {
    return null
  }

  return <LandingPage />
}
