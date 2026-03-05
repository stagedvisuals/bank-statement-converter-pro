'use client'

import { useState, useRef } from 'react'
import { Upload, AlertCircle, Loader2 } from 'lucide-react'
import { useFreeScan } from '../hooks/useFreeScan'
import FreeScanPreview from './FreeScanPreview'
import AuthModal from './AuthModal'

interface ConvertResult {
  success: boolean
  preview?: any
  data?: any
  requiresAuth: boolean
  message: string
  error?: string
}

export default function FileConverterWithFreeScan() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [result, setResult] = useState<ConvertResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const { localStorageId, hasUsedFreeScan, isLoading, markFreeScanUsed } = useFreeScan()

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Alleen PDF bestanden worden ondersteund')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Bestand is te groot (maximaal 10MB)')
      return
    }

    setIsConverting(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (localStorageId) {
        formData.append('localStorageId', localStorageId)
      }

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'free_scan_used') {
          setResult({
            success: false,
            requiresAuth: true,
            message: data.message,
            error: data.error
          })
          setShowAuthModal(true)
        } else {
          setError(data.message || 'Conversie mislukt')
        }
        return
      }

      setResult(data)

      if (data.requiresAuth && data.success) {
        markFreeScanUsed()
      }

    } catch (err) {
      console.error('Upload error:', err)
      setError('Er is een fout opgetreden bij het uploaden')
    } finally {
      setIsConverting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFeedback = (helpful: boolean) => {
    console.log('User feedback:', helpful ? 'helpful' : 'not helpful')
  }

  const handleRegisterClick = () => {
    setShowAuthModal(true)
  }

  const handleAuthSuccess = () => {
    if (result?.error === 'free_scan_used') {
      setResult(null)
      setShowAuthModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-[#00b8d9] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!result?.success && (
        <div 
          onClick={handleFileSelect}
          className="border-2 border-dashed border-[#1e293b] rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-[#00b8d9] transition-colors bg-[#0a1220]/50"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf"
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 flex items-center justify-center bg-[#00b8d9]/10 rounded-full">
              <Upload className="w-8 h-8 text-[#00b8d9]" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-[#e8edf5] mb-2">
                {hasUsedFreeScan ? 'Gratis scan gebruikt' : 'Upload je bankafschrift'}
              </h3>
              <p className="text-[#6b7fa3]">
                {hasUsedFreeScan 
                  ? 'Maak een account aan voor onbeperkte conversies'
                  : 'Sleep een PDF bestand of klik om te uploaden'
                }
              </p>
            </div>

            {hasUsedFreeScan && (
              <div className="inline-flex items-center px-4 py-2 bg-[#1e293b] rounded-full text-sm text-[#6b7fa3]">
                <AlertCircle className="w-4 h-4 mr-2" />
                1 gratis scan per gebruiker
              </div>
            )}

            <button
              onClick={handleFileSelect}
              disabled={isConverting}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[#00b8d9] to-[#0066cc] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConverting ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Bezig met converteren...</span>
                </span>
              ) : (
                'Selecteer PDF bestand'
              )}
            </button>

            <p className="text-sm text-[#6b7fa3]">
              Ondersteund: PDF · Maximaal 10MB · {hasUsedFreeScan ? 'Registratie vereist' : '1 gratis scan'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Fout bij uploaden</p>
              <p className="text-sm text-red-300/80 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result?.error === 'free_scan_used' && !showAuthModal && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-400">Gratis scan verbruikt</p>
              <p className="text-sm text-yellow-300/80 mt-1">{result.message}</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="mt-3 px-4 py-2 bg-[#00b8d9] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Maak gratis account aan
              </button>
            </div>
          </div>
        </div>
      )}

      {result?.success && result.requiresAuth && result.preview && (
        <FreeScanPreview 
          data={result.preview}
          onRegister={handleRegisterClick}
          onFeedback={handleFeedback}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
