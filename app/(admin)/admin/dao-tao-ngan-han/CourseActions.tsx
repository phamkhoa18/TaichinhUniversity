"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { showToast } from '@/lib/toast'

export default function CourseActions({ id }: { id: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác.')) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/dao-tao-ngan-han/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast.success('Đã xóa khóa học thành công')
        router.refresh()
      } else {
        showToast.error(data.error || 'Có lỗi xảy ra')
        setIsDeleting(false)
      }
    } catch {
      showToast.error('Lỗi kết nối máy chủ')
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
      <Link href={`/admin/dao-tao-ngan-han/${id}/edit`}>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-[#005496] hover:bg-blue-50" title="Sửa">
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
      </Link>
      <Button onClick={handleDelete} disabled={isDeleting} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50" title="Xóa">
        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      </Button>
    </div>
  )
}
