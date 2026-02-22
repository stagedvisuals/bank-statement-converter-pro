import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import '../styles/globals.css'
import dynamic from 'next/dynamic'

// Dynamically import ChatWidget to avoid SSR issues
const ChatWidget = dynamic(() => import('../components/ChatWidget'), {
  ssr: false,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/login"
      signUpUrl="/register"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      {...pageProps}
    >
      <Component {...pageProps} />
      <ChatWidget />
    </ClerkProvider>
  )
}
