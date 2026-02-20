"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
}

export default function FileDropzone({ onFileSelect }: FileDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-[var(--neon-blue)] bg-[var(--neon-blue)]/10"
          : "border-gray-700 hover:border-[var(--neon-blue)]"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      {isDragActive ? (
        <p className="text-[var(--neon-blue)]">Drop het bestand hier...</p>
      ) : (
        <>
          <p className="text-gray-300 mb-2">Sleep PDF hierheen of klik om te uploaden</p>
          <p className="text-gray-500 text-sm">Ondersteunt: PDF, TXT, CSV</p>
        </>
      )}
    </div>
  );
}
