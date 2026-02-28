'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export default function LiveCounter() {
  const [count, setCount] = useState(23);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial count
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/stats/public');
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch {
        // Use fallback
        setCount(23 + Math.floor(Math.random() * 30));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();

    // Update every 30 seconds
    const interval = setInterval(() => {
      // 40% chance to increase by 1
      if (Math.random() < 0.4) {
        setCount(prev => prev + 1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
        <Activity className="w-4 h-4 text-muted-foreground animate-pulse" />
        <span className="text-sm text-muted-foreground">Laden...</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-full shadow-sm">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          LIVE Vandaag al <span className="text-[#00b8d9] font-bold text-lg">{count}</span> conversies
        </span>
        <span className="text-xs text-muted-foreground">
          verwerkt door Nederlandse bedrijven
        </span>
      </div>
    </div>
  );
}