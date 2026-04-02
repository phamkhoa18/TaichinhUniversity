"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, Edit2, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { showToast } from '@/lib/toast'

export default function NewsActions({ id, slug }: { id: string, slug: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.')) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast.success('Đã xóa bài viết thành công')
        router.refresh()
      } else {
        showToast.error(data.error || 'Có lỗi xảy ra')
        setIsDeleting(false)
      }
    } catch (err) {
      showToast.error('Lỗi kết nối máy chủ')
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
      <Link href={`/news/${slug}`} target="_blank">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100" title="Xem trên web">
          <Eye className="w-3.5 h-3.5" />
        </Button>
      </Link>
      <Link href={`/admin/thong-bao/${id}/edit`}>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-[#005496] hover:bg-blue-50" title="Sửa bài viết">
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
      </Link>
      <Button onClick={handleDelete} disabled={isDeleting} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50" title="Xóa bài viết">
        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      </Button>
    </div>
  )
}
