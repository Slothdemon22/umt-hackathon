"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { UploadCloud } from "lucide-react"

interface DropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  disabled?: boolean
  onFileSelect: (file: File) => void
  maxSize?: number
  preview?: string
}

export function Dropzone({
  className,
  disabled = false,
  onFileSelect,
  maxSize = 5 * 1024 * 1024, // 5MB default
  preview,
  ...props
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (!file) return

    if (file.size > maxSize) {
      alert(`File size should be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    onFileSelect(file)
  }, [disabled, maxSize, onFileSelect])

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const file = e.target.files[0]

    if (file.size > maxSize) {
      alert(`File size should be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    onFileSelect(file)
  }, [maxSize, onFileSelect])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-200",
        isDragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900/50",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:border-slate-600 hover:bg-slate-800/50 cursor-pointer",
        className
      )}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="image/*"
        disabled={disabled}
      />
      
      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-800 group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
            <p className="text-sm text-slate-200 flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              Click or drag to replace
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 bg-slate-800 rounded-full">
            <UploadCloud className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-2">
            <p className="text-slate-300">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-500">
              SVG, PNG, JPG or GIF (max. {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 