'use client'

// ============================================================
// LIB/TOAST — Service Toast + ConfirmDialog
// Dùng Sonner toast + Radix AlertDialog
// Cách dùng:
//   import { showToast } from '@/lib/toast'
//   showToast.success('Đã lưu thành công!')
//   showToast.error('Lỗi kết nối server')
//   showToast.promise(fetchData(), { loading: '...', success: '...', error: '...' })
// ============================================================

import { toast } from 'sonner'

type ToastPosition = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'

// ── Wrapper cho toast với style chuẩn ──
export const showToast = {
  /**
   * Toast thành công (màu xanh)
   */
  success(message: string, description?: string) {
    toast.success(message, {
      description,
      duration: 3000,
    })
  },

  /**
   * Toast lỗi (màu đỏ)
   */
  error(message: string, description?: string) {
    toast.error(message, {
      description,
      duration: 5000,
    })
  },

  /**
   * Toast warning (màu vàng)
   */
  warning(message: string, description?: string) {
    toast.warning(message, {
      description,
      duration: 4000,
    })
  },

  /**
   * Toast thông tin
   */
  info(message: string, description?: string) {
    toast.info(message, {
      description,
      duration: 3000,
    })
  },

  /**
   * Toast loading → success/error (cho async operations)
   * @example
   * showToast.promise(
   *   fetch('/api/data').then(r => r.json()),
   *   { loading: 'Đang lưu...', success: 'Đã lưu!', error: 'Lỗi kết nối' }
   * )
   */
  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string | ((err: any) => string) }
  ) {
    return toast.promise(promise, messages)
  },

  /**
   * Toast action (có nút bấm)
   */
  action(message: string, actionLabel: string, onAction: () => void) {
    toast(message, {
      action: {
        label: actionLabel,
        onClick: onAction,
      },
      duration: 5000,
    })
  },

  /**
   * Dismiss tất cả toast
   */
  dismiss() {
    toast.dismiss()
  },
}
