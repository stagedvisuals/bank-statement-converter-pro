'use client'

import { useState } from 'react'
import { ArrowLeft, Download, FileSpreadsheet, Users, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import BulkUploadDropzone from '@/components/BulkUploadDropzone'
import { FileUploadItem } from '@/hooks/useBulkUpload'

export default function BulkUploadPage() {
  const [results, setResults] = useState<FileUploadItem[]>([])

  const handleComplete = (completedFiles: FileUploadItem[]) => {
    setResults(completedFiles)
  }

  const handleExportAll = () => {
    console.log('Export all results:', results)
    alert(`Export van ${results.length} bestanden wordt voorbereid...`)
  }

  const getTotalTransactions = () => {
    return results.reduce((total, file) => {
      if (file.result?.data?.transacties?.length) {
        return total + file.result.data.transacties.length
      }
      return total
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Bulk Upload - B2B Conversie
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload tot 50 bankafschriften tegelijk voor accountantskantoren
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Enterprise Tier
                </span>
              </div>
              
              {results.length > 0 && (
                <button
                  onClick={handleExportAll}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporteer alles ({results.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {results.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Bestanden verwerkt
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getTotalTransactions()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Transacties geanalyseerd
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      3
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Parallelle verwerking
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Upload Component */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Upload Zone
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Upload meerdere bankafschriften voor batch verwerking
                </p>
              </div>
              
              <div className="p-6">
                <BulkUploadDropzone 
                  maxFiles={50}
                  batchSize={3}
                  onComplete={handleComplete}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Enterprise Features
              </h3>
              
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Batch Processing
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Verwerk tot 50 bestanden tegelijk
                    </div>
                  </div>
                </li>
                
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Rate Limiting
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Automatische batch verwerking (3 tegelijk)
                    </div>
                  </div>
                </li>
                
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Error Isolation
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Fouten in 1 bestand crashen niet de rest
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                Tips voor optimale bulk verwerking
              </h3>
              
              <ul className="space-y-2 text-blue-800 dark:text-blue-400">
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300 text-xs font-bold mt-0.5">
                    ✓
                  </div>
                  <span>Gebruik gestandaardiseerde PDF formaten</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300 text-xs font-bold mt-0.5">
                    ✓
                  </div>
                  <span>Maximaal 10MB per bestand</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300 text-xs font-bold mt-0.5">
                    ✓
                  </div>
                  <span>Batch grootte van 3 voorkomt API timeouts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
