import { useAuth, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const role = user?.publicMetadata?.role as string
  const isPro = role === 'pro' || role === 'admin'

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login')
    }
  }, [isLoaded, isSignedIn, router])

  const handleConvert = async () => {
    if (!file) return
    
    setConverting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        alert(data.error || 'Conversion failed')
      }
    } catch (error) {
      alert('Upload failed')
    } finally {
      setConverting(false)
    }
  }

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
              {isPro && (
                <span className="px-2 py-1 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black text-xs font-bold rounded">
                  PRO
                </span>
              )}
              <span className="text-gray-400">
                Credits: <span className="text-[var(--neon-blue)] font-bold">{isPro ? '∞' : '2'}</span>
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          
          {!isPro && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300">Upgrade naar Pro voor onbeperkte conversies!</p>
              <Link href="/#pricing" className="text-[var(--neon-blue)] hover:underline">
                Bekijk prijzen →
              </Link>
            </div>
          )}

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <p className="text-gray-400">{file ? file.name : 'Klik om PDF te uploaden'}</p>
              </label>
            </div>

            <button
              onClick={handleConvert}
              disabled={!file || converting || (!isPro && !file)}
              className="w-full py-4 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {converting ? 'Converteren met Kimi AI...' : 'Converteer naar Excel'}
            </button>

            {result && (
              <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-300">✅ {result.count} transacties gevonden!</p>
                <pre className="mt-2 text-xs text-gray-400 overflow-auto max-h-40">
                  {JSON.stringify(result.transactions, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
