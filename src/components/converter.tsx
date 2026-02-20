"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import FileDropzone from "@/components/file-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";

export default function Converter() {
  const { userId } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ csv: string; transactionCount: number } | null>(null);

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Conversion failed");
      }

      setResult(data);
      toast.success(`Converted ${data.transactionCount} transactions!`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!result?.csv) return;
    
    const blob = new Blob([result.csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <FileDropzone onFileSelect={setFile} />

      {file && (
        <div className="glass rounded-lg p-4">
          <p className="text-gray-300">Selected: <span className="text-white font-medium">{file.name}</span></p>
        </div>
      )}

      <Button
        onClick={handleConvert}
        disabled={!file || loading}
        className="w-full py-6 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-black font-bold text-lg hover:shadow-xl hover:shadow-[var(--neon-blue)]/50 transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Converting...
          </>
        ) : (
          "Convert to CSV"
        )}
      </Button>

      {result && (
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-gray-300 mb-2">
            Successfully converted <span className="text-[var(--neon-blue)] font-bold">{result.transactionCount}</span> transactions
          </p>
          <Button onClick={downloadCSV} variant="outline" className="mt-4">
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </div>
      )}
    </div>
  );
}
