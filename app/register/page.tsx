import { SignUp } from '@clerk/nextjs'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">BSC Pro</h1>
          <p className="text-gray-400">Maak je gratis account aan</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold',
              card: 'bg-transparent shadow-none',
            }
          }}
        />
      </div>
    </div>
  )
}
