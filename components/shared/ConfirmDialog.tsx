'use client'

// ============================================================
// COMPONENT — ConfirmDialog
// Dialog xác nhận trước khi thực hiện thao tác nguy hiểm (xóa, hủy...)
//
// Cách dùng:
//   <ConfirmDialog
//     open={showDelete}
//     onClose={() => setShowDelete(false)}
//     onConfirm={handleDelete}
//     title="Xóa bài viết?"
//     description="Sau khi xóa, bài viết sẽ không thể khôi phục."
//     confirmText="Xóa"
//     variant="destructive"
//     loading={deleting}
//   />
// ============================================================

import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle, Trash2, Info } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'destructive' | 'warning' | 'default'
  loading?: boolean
  icon?: React.ReactNode
}

const VARIANT_CONFIG = {
  destructive: {
    icon: <Trash2 className="w-5 h-5 text-white" />,
    iconBg: 'bg-rose-500',
    btnClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    defaultConfirm: 'Xóa',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-white" />,
    iconBg: 'bg-amber-500',
    btnClass: 'bg-amber-600 hover:bg-amber-700 text-white',
    defaultConfirm: 'Tiếp tục',
  },
  default: {
    icon: <Info className="w-5 h-5 text-white" />,
    iconBg: 'bg-[#005496]',
    btnClass: 'bg-[#005496] hover:bg-[#004882] text-white',
    defaultConfirm: 'Xác nhận',
  },
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = 'Hủy',
  variant = 'destructive',
  loading = false,
  icon,
}: ConfirmDialogProps) {
  const config = VARIANT_CONFIG[variant]

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="max-w-[420px] rounded-2xl border-slate-200 p-0 overflow-hidden gap-0">
        {/* Body */}
        <div className="px-6 pt-6 pb-5">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}>
                {icon || config.icon}
              </div>
              <div className="flex-1 pt-0.5">
                <AlertDialogTitle className="text-[16px] font-bold text-slate-800 leading-tight">
                  {title}
                </AlertDialogTitle>
                {description && (
                  <AlertDialogDescription className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
                    {description}
                  </AlertDialogDescription>
                )}
              </div>
            </div>
          </AlertDialogHeader>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="bg-slate-50 border-t border-slate-100 px-6 py-3.5">
          <AlertDialogCancel
            onClick={onClose}
            disabled={loading}
            className="h-9 px-4 text-[13px] font-semibold rounded-lg border-slate-200 bg-white hover:bg-slate-50"
          >
            {cancelText}
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`h-9 px-5 text-[13px] font-bold rounded-lg ${config.btnClass} shadow-sm`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
            {confirmText || config.defaultConfirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
