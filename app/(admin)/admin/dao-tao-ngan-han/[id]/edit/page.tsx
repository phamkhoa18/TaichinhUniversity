'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CourseForm from '../../CourseForm'
import { Loader2 } from 'lucide-react'

export default function EditCoursePage() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/dao-tao-ngan-han/${params.id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#005496]" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 font-medium">Không tìm thấy khóa học</p>
      </div>
    )
  }

  return <CourseForm initialData={data} isEdit />
}
