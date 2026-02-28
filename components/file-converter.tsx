'use client'

import { useState } from 'react'
import { Loader2, Download, FileText, CheckCircle } from 'lucide-react'

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ downloadUrl: string; transactionCount: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      console.log('Bestand ontvangen:', selectedFile.name)
      setFile(selectedFile)
      setUploadSuccess(true)
      setError(null)
      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000)
    }
  }

  const handleConvert = async () => {
    if (!file) {
      setError('Geen bestand geselecteerd')
      return
    }

    console.log('Starting conversion for file:', file.name)
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('Sending request to /api/convert')
      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      console.log('Response:', data)

      if (!res.ok) {
        throw new Error(data.error || 'Conversion failed')
      }

      setResult(data)
    } catch (error: any) {
      console.error('Conversion error:', error)
      setError(error.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-[var(--neon-blue)] transition-colors">
        <input
          type="file"
          id="file-input"
          accept=".pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
        <label htmlFor="file-input" className="cursor-pointer block">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-300">Klik om PDF te uploaden</p>
          <p className="text-[#6b7fa3] text-sm mt-2">Max 10MB</p>
        </label>
      </div>

      {/* File selected indicator */}
      {file && (
        <div className="p-4 bg-[#0a1220]0/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-blue-300 font-medium">Bestand geselecteerd:</p>
              <p className="text-white">{file.name}</p>
              <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload success message */}
      {uploadSuccess && (
        <div className="p-3 bg-[#0a1220]0/20 border border-green-500/30 rounded-lg text-green-300 text-center">
          ✓ Bestand succesvol geüpload!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!file || loading}
        className="w-full py-4 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-[#e8edf5] font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Converteren met AI...
          </span>
        ) : (
          'Converteer naar Excel'
        )}
      </button>

      {result && (
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-gray-300 mb-2">
            <span className="text-[var(--neon-blue)] font-bold">{result.transactionCount}</span> transacties gevonden
          </p>
          <a
            href={result.downloadUrl}
            download
            className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </a>
        </div>
      )}
    </div>
  )
}
