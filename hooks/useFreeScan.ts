import { useState, useEffect } from 'react'

interface FreeScanState {
  localStorageId: string | null
  hasUsedFreeScan: boolean
  isLoading: boolean
}

export function useFreeScan() {
  const [state, setState] = useState<FreeScanState>({
    localStorageId: null,
    hasUsedFreeScan: false,
    isLoading: true
  })

  useEffect(() => {
    // Initialize localStorage ID
    const initFreeScan = () => {
      try {
        let localStorageId = localStorage.getItem('bscpro_free_scan_id')
        
        if (!localStorageId) {
          localStorageId = `free_scan_${Date.now()}_${Math.random().toString(36).substring(2)}`
          localStorage.setItem('bscpro_free_scan_id', localStorageId)
        }
        
        // Check if free scan has been used
        const hasUsedFreeScan = localStorage.getItem('bscpro_free_scan_used') === 'true'
        
        setState({
          localStorageId,
          hasUsedFreeScan,
          isLoading: false
        })
      } catch (error) {
        console.error('Free scan initialization error:', error)
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initFreeScan()
  }, [])

  const markFreeScanUsed = () => {
    try {
      localStorage.setItem('bscpro_free_scan_used', 'true')
      setState(prev => ({ ...prev, hasUsedFreeScan: true }))
    } catch (error) {
      console.error('Failed to mark free scan as used:', error)
    }
  }

  const resetFreeScan = () => {
    try {
      localStorage.removeItem('bscpro_free_scan_used')
      const newId = `free_scan_${Date.now()}_${Math.random().toString(36).substring(2)}`
      localStorage.setItem('bscpro_free_scan_id', newId)
      setState({
        localStorageId: newId,
        hasUsedFreeScan: false,
        isLoading: false
      })
    } catch (error) {
      console.error('Failed to reset free scan:', error)
    }
  }

  return {
    ...state,
    markFreeScanUsed,
    resetFreeScan
  }
}
