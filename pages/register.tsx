import { useAuth, SignUp } from '@clerk/nextjs'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function RegisterPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fintech-bg">
        <div className="text-navy">Laden...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Registreren | BSC Pro - AI Financial Document Processor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex flex-col bg-fintech-bg">
        {/* Header */}
        <nav className="w-full py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">
              BSC Pro
            </Link>
            <Link 
              href="/login" 
              className="text-slate hover:text-navy transition-colors font-medium"
            >
              Al een account?
            </Link>
          </div>
        </nav>

        {/* Register Form */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-navy mb-2">Start gratis</h1>
              <p className="text-slate">Maak je account aan en krijg 2 gratis conversies</p>
            </div>
            <SignUp 
              signInUrl="/login"
              afterSignUpUrl="/dashboard"
              appearance={{
                variables: {
                  colorPrimary: "#10B981",
                  colorBackground: "#ffffff",
                  colorText: "#0F172A",
                  colorInputBackground: "#F8FAFC",
                  colorInputText: "#0F172A",
                  borderRadius: "0.75rem",
                },
                elements: {
                  formButtonPrimary: "bg-success hover:bg-success-dark text-white font-bold rounded-xl py-3",
                  card: "bg-transparent shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-fintech-bg hover:bg-fintech-bg-alt text-navy border border-fintech-border rounded-xl",
                  formFieldLabel: "text-navy font-medium",
                  formFieldInput: "bg-fintech-bg border-fintech-border text-navy rounded-xl",
                  footerActionLink: "text-success hover:text-success-dark font-medium",
                  identityPreviewText: "text-navy",
                  identityPreviewEditButton: "text-success",
                  dividerLine: "bg-fintech-border",
                  dividerText: "text-slate",
                }
              }}
            />
            <p className="text-center text-xs text-slate mt-6">
              Door te registreren ga je akkoord met onze{' '}
              <Link href="#" className="text-success hover:underline">Terms of Service</Link>
              {' '}en{' '}
              <Link href="#" className="text-success hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-slate text-sm">
          <p>© 2026 BSC Pro. Alle rechten voorbehouden.</p>
        </footer>
      </div>
    </>
  )
}
