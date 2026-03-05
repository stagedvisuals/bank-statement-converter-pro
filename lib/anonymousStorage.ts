import { useEffect, useState } from 'react';

const STORAGE_KEY = 'bscpro_anonymous_calculations';
const SESSION_ID_KEY = 'bscpro_session_id';

export interface AnonymousCalculation {
  id: string;
  toolType: 'btw' | 'deadline' | 'kilometer';
  inputData: any;
  resultData: any;
  createdAt: string;
}

export function useAnonymousStorage() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve session ID
    let sid = localStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(SESSION_ID_KEY, sid);
    }
    setSessionId(sid);
  }, []);

  const saveCalculation = (toolType: string, inputData: any, resultData: any) => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const calculations: AnonymousCalculation[] = existing ? JSON.parse(existing) : [];
      
      const newCalc: AnonymousCalculation = {
        id: `calc_${Date.now()}`,
        toolType: toolType as any,
        inputData,
        resultData,
        createdAt: new Date().toISOString()
      };
      
      calculations.push(newCalc);
      
      // Keep only last 50 calculations
      if (calculations.length > 50) {
        calculations.shift();
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(calculations));
      
      // Also send to server for backup
      syncToServer(newCalc);
      
      return newCalc;
    } catch (error) {
      console.error('Error saving calculation:', error);
      return null;
    }
  };

  const syncToServer = async (calculation: AnonymousCalculation) => {
    try {
      await fetch('/api/anonymous/save-calculation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          calculation
        })
      });
    } catch (error) {
      // Silent fail - localStorage is primary
      console.error('Server sync failed:', error);
    }
  };

  const getCalculations = (): AnonymousCalculation[] => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      return existing ? JSON.parse(existing) : [];
    } catch {
      return [];
    }
  };

  const clearCalculations = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    sessionId,
    saveCalculation,
    getCalculations,
    clearCalculations
  };
}

// Hook to sync anonymous data after login
export function useSyncAnonymousData(userId: string | null) {
  useEffect(() => {
    if (!userId) return;

    const syncData = async () => {
      try {
        const sessionId = localStorage.getItem(SESSION_ID_KEY);
        const calculations = localStorage.getItem(STORAGE_KEY);
        
        if (!sessionId || !calculations) return;

        const response = await fetch('/api/user/sync-anonymous-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('bscpro_session') || '{}').access_token}`
          },
          body: JSON.stringify({
            sessionId,
            calculations: JSON.parse(calculations)
          })
        });

        if (response.ok) {
          // Clear local data after successful sync
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(SESSION_ID_KEY);
        }
      } catch (error) {
        console.error('Sync error:', error);
      }
    };

    syncData();
  }, [userId]);
}
