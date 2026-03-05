'use client'

import { useCallback, useState } from 'react'
import { Upload, X, AlertCircle, CheckCircle, Clock, Loader2, FileText, Download } from 'lucide-react'
import { useBulkUpload, FileUploadItem } from '../hooks/useBulkUpload'

interface BulkUploadDropzoneProps {
  maxFiles?: number
  batchSize?: number
  onComplete?: (results: FileUploadItem[]) => void
}

export default function BulkUploadDropzone({ 
  maxFiles = 50, 
  batchSize = 3,
  onComplete 
}: BulkUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  
  const {
    files,
    isProcessing,
    addFiles,
    removeFile,
    clearAll,
    startProcessing,
    retryFile,
    retryAllErrors,
    getStats
  } = useBulkUpload({ maxFiles, batchSize })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [addFiles])

  const handleFileSelect = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf'
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        addFiles(Array.from(target.files))
      }
    }
    
    input.click()
  }, [addFiles])

  const handleStartProcessing = useCallback(async () => {
    await startProcessing()
    const completedFiles = files.filter(f => f.status === 'completed')
    if (completedFiles.length > 0 && onComplete) {
      onComplete(completedFiles)
    }
  }, [startProcessing, files, onComplete])

  const stats = getStats()

  const getStatusIcon = (status: FileUploadItem['status']) => {
    switch (status) {
      case 'waiting': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'processing': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: FileUploadItem['status']) => {
    switch (status) {
      case 'waiting': return 'Wachtend ⏳'
      case 'processing': return 'Analyseren 🔄'
      case 'completed': return 'Klaar ✅'
      case 'error': return 'Fout ❌'
      default: return 'Onbekend'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragOver 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900/50'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Upload meerdere bankafschriften
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Sleep bestanden hierheen of klik om te selecteren
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Maximaal {maxFiles} bestanden · PDF alleen · Max 10MB per bestand
            </p>
          </div>

          <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Selecteer bestanden
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {files.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Totaal</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Wachtend</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Bezig</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Voltooid</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fouten</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {stats.errors > 0 && (
                <button
                  onClick={retryAllErrors}
                  className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                >
                  Opnieuw proberen ({stats.errors})
                </button>
              )}
              
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Wissen
              </button>
              
              <button
                onClick={handleStartProcessing}
                disabled={isProcessing || stats.waiting === 0}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Bezig met verwerken...</span>
                  </span>
                ) : (
                  `Start verwerken (${stats.waiting})`
                )}
              </button>
            </div>
          </div>
          
          {isProcessing && (
            <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verwerkt in batches van {batchSize} bestanden tegelijk...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bestanden in wachtrij ({files.length}/{maxFiles})
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getStatusIcon(fileItem.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {fileItem.file.name}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(fileItem.file.size)}</span>
                        <span>•</span>
                        <span className={`
                          ${fileItem.status === 'waiting' ? 'text-yellow-600' : ''}
                          ${fileItem.status === 'processing' ? 'text-blue-600' : ''}
                          ${fileItem.status === 'completed' ? 'text-green-600' : ''}
                          ${fileItem.status === 'error' ? 'text-red-600' : ''}
                        `}>
                          {getStatusText(fileItem.status)}
                        </span>
                      </div>
                      
                      {fileItem.error && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {fileItem.error}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {/* Progress Bar */}
                    {fileItem.status === 'processing' && (
                      <div className="w-24">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${fileItem.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-1">
                          {fileItem.progress}%
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-1">
                      {fileItem.status === 'error' && (
                        <button
                          onClick={() => retryFile(fileItem.id)}
                          className="p-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded"
                          title="Opnieuw proberen"
                        >
                          <Loader2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      {fileItem.status === 'completed' && fileItem.result && (
                        <button
                          onClick={() => {
                            // TODO: Implement download functionality
                            console.log('Download result:', fileItem.result)
                          }}
                          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                          title="Download resultaat"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => removeFile(fileItem.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        title="Verwijderen"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {files.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Hoe bulk upload werkt:
          </h4>
          <ul className="space-y-2 text-blue-800 dark:text-blue-400">
            <li className="flex items-start space-x-2">
              <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300 text-xs font-bold mt-0.5">
                1
              </div>
              <span>Selecteer of sleep meerdere PDF bestanden (max {maxFiles})</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300 text-xs font-bold mt-0.5">
                2
              </div>
              <span>Bestanden worden gevalideerd op type en grootte</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300 text-xs font-bold mt-0.5">
                3
              </div>
              <span>Klik op "Start verwerken" - bestanden worden in batches van {batchSize} tegelijk verwerkt</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300 text-xs font-bold mt-0.5">
                4
              </div>
              <span>Download individuele resultaten of exporteer alles tegelijk</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
