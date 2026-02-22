import type { AppProps } from 'next/app'
import '../styles/globals.css'
import dynamic from 'next/dynamic'

// Dynamically import ChatWidget to avoid SSR issues
const ChatWidget = dynamic(() => import('../components/ChatWidget'), {
  ssr: false,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ChatWidget />
    </>
  )
}
