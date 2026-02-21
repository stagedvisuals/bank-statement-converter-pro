'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, Download, FileText } from 'lucide-react'

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ downloadUrl: string; transactionCount: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    console.log('File selected:', selectedFile.name)
    setFile(selectedFile)
    setError(null)
  }

  const handleConvert = async () => {
    if (!file) {
      setError('Geen bestand geselecteerd')
      return
    }

    console.log('Starting conversion...')
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
      <div
        className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-[var(--neon-blue)] transition-colors"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          type="file"
          id="file-input"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0]
            if (selected) handleFileSelect(selected)
          }}
        />
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-300">Klik om PDF te uploaden</p>
        {file && <p className="text-[var(--neon-blue)] mt-2">{file.name}</p>}
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!file || loading}
        className="w-full py-4 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Converteren...
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
