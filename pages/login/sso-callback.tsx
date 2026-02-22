import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function SSOCallback() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page - Supabase auth doesn't use SSO callback
    router.push('/login')
  }, [router])

  return (
    <>
      <Head>
        <title>Redirecting... | BSC Pro</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-fintech-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-success border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-navy font-medium">Doorverwijzen...</p>
        </div>
      </div>
    </>
  )
}
