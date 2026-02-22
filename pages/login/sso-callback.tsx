import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@clerk/nextjs'
import Head from 'next/head'

export default function SSOCallback() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Redirect to dashboard after successful SSO login
        router.push('/dashboard')
      } else {
        // If not signed in, redirect to login page
        router.push('/login')
      }
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <>
      <Head>
        <title>Authenticating... | BSC Pro</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-fintech-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-success border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-navy font-medium">Inloggen...</p>
          <p className="text-slate text-sm mt-2">Even geduld terwijl we je authenticeren</p>
        </div>
      </div>
    </>
  )
}
