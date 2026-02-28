import { useState, useCallback } from 'react';
import { Upload, FileText, ArrowRight, Sparkles, X } from 'lucide-react';

interface EmptyStateProps {
  onFileSelect: (file: File) => void;
  credits: number;
}

export default function EmptyState({ onFileSelect, credits }: EmptyStateProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
      {/* Credits Badge */}
      {credits > 0 && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00b8d9]/10 border border-[#00b8d9]/30 rounded-full">
            <Sparkles className="w-4 h-4 text-[#00b8d9]" />
            <span className="text-sm font-semibold text-[#00b8d9]">
              {credits} gratis {credits === 1 ? 'scan' : 'scans'} beschikbaar
            </span>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && credits > 0 && (
        <div className="relative max-w-md mx-auto mb-6">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-amber-500/60 hover:text-amber-500"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Welkom!</strong> Je hebt {credits} gratis {credits === 1 ? 'scan' : 'scans'}. 
              Sleep een PDF hierheen om te beginnen.
            </p>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-500/10 border-r border-b border-amber-500/30 rotate-45" />
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-[#00b8d9] bg-[#00b8d9]/5 scale-105' 
            : 'border-border hover:border-[#00b8d9]/50 hover:bg-secondary/50'
          }
        `}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={`
          w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all
          ${isDragging ? 'bg-[#00b8d9] scale-110' : 'bg-cyan-500/10'}
        `}>
          <Upload className={`w-10 h-10 transition-all ${isDragging ? 'text-white' : 'text-[#00b8d9]'}`} />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2">
          {isDragging ? 'Laat los om te uploaden' : 'Sleep je eerste factuur hierheen'}
        </h3>
        <p className="text-muted-foreground mb-4">
          Of klik om een PDF te selecteren
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>Ondersteunt: PDF bankafschriften</span>
        </div>

        {credits === 0 && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-destructive">
              Je hebt geen credits meer. Upgrade naar een abonnement om door te gaan.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <a 
          href="/tools/btw-calculator" 
          className="flex items-center gap-3 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <span className="text-[#00b8d9] font-bold">%</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">BTW berekenen</p>
            <p className="text-xs text-muted-foreground">Gratis tool</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#00b8d9]" />
        </a>

        <a 
          href="/tools/factuur-deadline-checker" 
          className="flex items-center gap-3 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <span className="text-[#00b8d9] font-bold">📅</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Deadline check</p>
            <p className="text-xs text-muted-foreground">Gratis tool</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#00b8d9]" />
        </a>

        <a 
          href="#pricing" 
          className="flex items-center gap-3 p-4 bg-[#00b8d9]/10 border border-[#00b8d9]/30 rounded-lg hover:bg-[#00b8d9]/20 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#00b8d9] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Abonnement</p>
            <p className="text-xs text-[#00b8d9]">Meer scans</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#00b8d9]" />
        </a>
      </div>
    </div>
  );
}
