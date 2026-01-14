'use client'

import { useCallback } from 'react'
import { useDropzone, Accept } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropzoneProps {
  onFileSelect: (file: File) => void
  accept?: Accept
  maxSize?: number
  currentFile?: File | null
  currentPreview?: string | null
  onClear?: () => void
  className?: string
  label?: string
  hint?: string
  disabled?: boolean
}

export function Dropzone({
  onFileSelect,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
  maxSize = 10 * 1024 * 1024, // 10MB
  currentFile,
  currentPreview,
  onClear,
  className,
  label = 'Drop your image here',
  hint = 'or click to browse',
  disabled = false,
}: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled,
  })

  const hasFile = currentFile || currentPreview

  return (
    <div className={cn('w-full', className)}>
      <AnimatePresence mode="wait">
        {hasFile ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface-secondary border border-border">
              {currentPreview && (
                <img
                  src={currentPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClear?.()
                  }}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
            {currentFile && (
              <p className="mt-2 text-sm text-foreground-muted truncate">
                {currentFile.name}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer',
              isDragActive && !isDragReject
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                : isDragReject
                ? 'border-danger bg-danger/10'
                : 'border-border hover:border-border-hover hover:bg-surface-secondary',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            {...(getRootProps() as any)}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{
                y: isDragActive ? -5 : 0,
                scale: isDragActive ? 1.05 : 1,
              }}
              className="flex flex-col items-center"
            >
              <div
                className={cn(
                  'p-4 rounded-full mb-4 transition-colors',
                  isDragActive
                    ? 'bg-primary-100 dark:bg-primary-900'
                    : 'bg-surface-secondary'
                )}
              >
                {isDragActive ? (
                  <Upload className="h-8 w-8 text-primary-500" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-foreground-muted" />
                )}
              </div>
              <p className="text-lg font-medium text-foreground">{label}</p>
              <p className="mt-1 text-sm text-foreground-muted">{hint}</p>
              <p className="mt-3 text-xs text-foreground-muted">
                PNG, JPG, WEBP up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
