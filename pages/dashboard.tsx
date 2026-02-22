import { useAuth, useUser, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FileText, Upload, Download, Zap, CreditCard, CheckCircle } from 'lucide-react'

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const role = user?.publicMetadata?.role as string
  const isPro = role === 'pro' || role === 'admin'

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login')
    }
  }, [isLoaded, isSignedIn, router])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadSuccess(true)
      setResult(null)
      setTimeout(() => setUploadSuccess(false), 3000)
    }
  }

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-fintech-bg">
        <div className="text-navy">Laden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-fintech-bg">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 card-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold gradient-text">BSC Pro</Link>
            <div className="flex items-center space-x-4">
              {isPro && (
                <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
                  PRO
                </span>
              )}
              <span className="text-slate text-sm">
                Credits: <span className="text-success font-bold">{isPro ? '∞' : '2'}</span>
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Converter */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 card-shadow border border-fintech-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-navy">Document Converter</h2>
                  <p className="text-slate text-sm">Upload je PDF en converteer naar Excel</p>
                </div>
              </div>
              
              {!isPro && (
                <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-navy font-medium">Upgrade naar Business</p>
                      <p className="text-slate text-sm">Krijg onbeperkte conversies en priority verwerking.</p>
                      <Link href="/#pricing" className="text-success hover:underline text-sm font-medium inline-flex items-center gap-1 mt-1">
                        Bekijk prijzen →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-fintech-border rounded-xl p-8 text-center hover:border-success transition-colors bg-fintech-bg/50">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer block">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-slate" />
                    <p className="text-navy font-medium">Klik om PDF te uploaden</p>
                    <p className="text-slate text-sm mt-1">of sleep je bestand hierheen</p>
                    <p className="text-slate text-xs mt-2">Max 10MB • PDF formaat</p>
                  </label>
                </div>

                {/* File Selected */}
                {file && (
                  <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-navy font-medium truncate">{file.name}</p>
                        <p className="text-slate text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Success */}
                {uploadSuccess && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-success text-center text-sm">
                    ✓ Bestand succesvol geüpload!
                  </div>
                )}

                {/* Convert Button */}
                <button
                  onClick={handleConvert}
                  disabled={!file || converting}
                  className="w-full py-4 bg-success text-white font-bold rounded-xl hover:bg-success-dark transition-all hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {converting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Converteren met AI...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Converteer naar Excel
                    </>
                  )}
                </button>

                {/* Result */}
                {result && (
                  <div className="mt-6 p-6 bg-success/5 border border-success/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <p className="text-navy font-semibold">Conversie succesvol!</p>
                    </div>
                    <p className="text-slate mb-4">
                      <span className="text-success font-bold">{result.transactionCount || result.count || 'Meerdere'}</span> transacties gevonden
                    </p>
                    {result.downloadUrl && (
                      <a
                        href={result.downloadUrl}
                        download
                        className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-xl hover:bg-navy-light transition-colors font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download Excel
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
              <h3 className="font-bold text-navy mb-4">Account</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate">Email</span>
                  <span className="text-navy font-medium text-sm">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Plan</span>
                  <span className={`font-medium text-sm ${isPro ? 'text-success' : 'text-slate'}`}>
                    {isPro ? 'Business' : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Credits</span>
                  <span className="text-navy font-bold">{isPro ? '∞' : '2'}</span>
                </div>
              </div>
            </div>

            {/* Supported Banks */}
            <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
              <h3 className="font-bold text-navy mb-4">Ondersteunde Banken</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-slate">ING Bank</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-slate">Rabobank</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-slate">ABN AMRO</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-slate">Bunq</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-slate">Revolut</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-slate">En meer...</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-navy rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">Hulp nodig?</h3>
              <p className="text-slate-light text-sm mb-4">Ons support team staat voor je klaar.</p>
              <Link 
                href="mailto:support@bscpro.nl" 
                className="text-success hover:text-success-light text-sm font-medium"
              >
                Contact opnemen →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
