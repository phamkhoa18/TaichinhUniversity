'use client'

// ============================================================
// COMPONENT — ImageUpload
// Reusable image upload component with preview
// Dùng API /api/upload, hoạt động cả dev lẫn production
// ============================================================

import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { UploadCategory } from '@/types/upload'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  category?: UploadCategory
  accept?: string
  maxSizeMB?: number
  className?: string
  previewSize?: 'sm' | 'md' | 'lg'
  placeholder?: string
  rounded?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  category = 'images',
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  maxSizeMB = 5,
  className = '',
  previewSize = 'md',
  placeholder = 'Kéo thả hoặc click để upload',
  rounded = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-full h-48',
  }

  const handleUpload = useCallback(async (file: File) => {
    // Client-side validation
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file ảnh')
      return
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File quá lớn. Tối đa ${maxSizeMB}MB`)
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (json.success) {
        onChange(json.url)
      } else {
        setError(json.error || 'Upload thất bại')
      }
    } catch {
      setError('Lỗi kết nối')
    } finally {
      setUploading(false)
    }
  }, [category, maxSizeMB, onChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    // Reset input
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setError('')
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Preview khi đã có ảnh */
        <div className={`relative group ${sizeClasses[previewSize]} ${rounded ? 'rounded-full' : 'rounded-xl'} overflow-hidden border-2 border-slate-200 bg-slate-50`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {/* Overlay khi hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
              title="Đổi ảnh"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-rose-500/80 transition-colors"
              title="Xóa ảnh"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Upload zone khi chưa có ảnh */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            ${sizeClasses[previewSize]} ${rounded ? 'rounded-full' : 'rounded-xl'}
            border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5
            ${isDragging
              ? 'border-[#005496] bg-[#005496]/5 scale-[1.02]'
              : 'border-slate-300 bg-slate-50 hover:border-[#005496]/50 hover:bg-slate-100'
            }
            ${uploading ? 'pointer-events-none opacity-70' : ''}
          `}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-[#005496] animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-5 h-5 text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium text-center px-2 leading-tight">
                {placeholder}
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-500 font-medium mt-1.5">{error}</p>
      )}
    </div>
  )
}
