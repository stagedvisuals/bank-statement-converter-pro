import { useState, useCallback } from 'react'

export interface FileUploadItem {
  id: string
  file: File
  status: 'waiting' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
  result?: any
  startedAt?: Date
  completedAt?: Date
}

export interface UseBulkUploadOptions {
  maxFiles?: number
  maxFileSize?: number
  batchSize?: number
  allowedTypes?: string[]
}

export function useBulkUpload(options: UseBulkUploadOptions = {}) {
  const {
    maxFiles = 50,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    batchSize = 3,
    allowedTypes = ['.pdf']
  } = options

  const [files, setFiles] = useState<FileUploadItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingQueue, setProcessingQueue] = useState<string[]>([])

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.slice(0, maxFiles - files.length)
    
    const newItems: FileUploadItem[] = validFiles.map(file => {
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
      
      let error: string | undefined
      if (!allowedTypes.includes(fileExtension)) {
        error = `Bestandstype niet ondersteund: ${fileExtension}`
      } else if (file.size > maxFileSize) {
        error = `Bestand te groot: ${(file.size / (1024 * 1024)).toFixed(1)}MB (max ${maxFileSize / (1024 * 1024)}MB)`
      }

      return {
        id: `${Date.now()}_${Math.random().toString(36).substring(2)}`,
        file,
        status: error ? 'error' : 'waiting',
        progress: 0,
        error
      }
    })

    setFiles(prev => [...prev, ...newItems])
    return newItems
  }, [files.length, maxFiles, allowedTypes, maxFileSize])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(item => item.id !== id))
    setProcessingQueue(prev => prev.filter(itemId => itemId !== id))
  }, [])

  const clearAll = useCallback(() => {
    setFiles([])
    setProcessingQueue([])
    setIsProcessing(false)
  }, [])

  const updateFileStatus = useCallback((id: string, updates: Partial<FileUploadItem>) => {
    setFiles(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const processNextBatch = useCallback(async () => {
    const waitingFiles = files.filter(f => f.status === 'waiting')
    const processingFiles = files.filter(f => f.status === 'processing')
    
    if (waitingFiles.length === 0 && processingFiles.length === 0) {
      setIsProcessing(false)
      return
    }

    const availableSlots = batchSize - processingFiles.length
    if (availableSlots <= 0) return

    const nextBatch = waitingFiles.slice(0, availableSlots)
    
    for (const fileItem of nextBatch) {
      updateFileStatus(fileItem.id, { 
        status: 'processing',
        startedAt: new Date(),
        progress: 10 
      })
      
      setProcessingQueue(prev => [...prev, fileItem.id])
      
      try {
        const formData = new FormData()
        formData.append('file', fileItem.file)
        
        const response = await fetch('/api/convert', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Conversie mislukt')
        }

        updateFileStatus(fileItem.id, {
          status: 'completed',
          progress: 100,
          result: data,
          completedAt: new Date(),
          error: undefined
        })

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Onbekende fout'
        updateFileStatus(fileItem.id, {
          status: 'error',
          progress: 0,
          error: errorMessage,
          completedAt: new Date()
        })
      } finally {
        setProcessingQueue(prev => prev.filter(id => id !== fileItem.id))
      }
    }
  }, [files, batchSize, updateFileStatus])

  const startProcessing = useCallback(async () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    while (files.some(f => f.status === 'waiting' || f.status === 'processing')) {
      await processNextBatch()
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsProcessing(false)
  }, [files, isProcessing, processNextBatch])

  const retryFile = useCallback((id: string) => {
    updateFileStatus(id, {
      status: 'waiting',
      progress: 0,
      error: undefined
    })
  }, [updateFileStatus])

  const retryAllErrors = useCallback(() => {
    setFiles(prev => prev.map(item => 
      item.status === 'error' 
        ? { ...item, status: 'waiting', progress: 0, error: undefined }
        : item
    ))
  }, [])

  const getStats = useCallback(() => {
    const total = files.length
    const waiting = files.filter(f => f.status === 'waiting').length
    const processing = files.filter(f => f.status === 'processing').length
    const completed = files.filter(f => f.status === 'completed').length
    const errors = files.filter(f => f.status === 'error').length
    
    return { total, waiting, processing, completed, errors }
  }, [files])

  return {
    files,
    isProcessing,
    processingQueue,
    addFiles,
    removeFile,
    clearAll,
    startProcessing,
    retryFile,
    retryAllErrors,
    getStats,
    updateFileStatus
  }
}
