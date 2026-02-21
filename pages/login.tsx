import { SignIn } from '@clerk/nextjs'
import Head from 'next/head'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Bank Statement Converter Pro</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="glass rounded-3xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">BSC Pro</h1>
            <p className="text-gray-400">Welkom terug</p>
          </div>
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold rounded-lg',
                card: 'bg-transparent shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
              }
            }}
          />
        </div>
      </div>
    </>
  )
}
