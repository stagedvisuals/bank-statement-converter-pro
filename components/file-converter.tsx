'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, Download, FileText } from 'lucide-react'

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ downloadUrl: string; transactionCount: number } | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  const handleConvert = async () => {
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Conversion failed')
      }

      setResult(data)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-[var(--neon-blue)] bg-[var(--neon-blue)]/10'
            : 'border-gray-700 hover:border-[var(--neon-blue)]'
        }`}
      >
        <input {...getInputProps()} />
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-[var(--neon-blue)]">Drop het PDF bestand hier...</p>
        ) : (
          <>
            <p className="text-gray-300">Sleep PDF hierheen of klik om te uploaden</p>
            <p className="text-gray-500 text-sm mt-2">Alleen PDF bestanden</p>
          </>
        )}
      </div>

      {file && (
        <div className="glass rounded-lg p-4">
          <p className="text-gray-300">
            Geselecteerd: <span className="text-white font-medium">{file.name}</span>
          </p>
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
