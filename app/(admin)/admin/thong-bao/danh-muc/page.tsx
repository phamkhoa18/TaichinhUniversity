'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Plus, Edit2, Trash2, Loader2, FolderOpen, Save, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { IconPicker } from '@/components/icon-picker'
import { showToast } from '@/lib/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface CategoryItem {
  _id: string
  name: string
  slug: string
  description?: string
  color: string
  icon?: string
  order: number
  isActive: boolean
}

function slugify(text: string) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState({ name: '', slug: '', description: '', color: '#005496', icon: '' })
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories')
      const json = await res.json()
      if (json.success) setCategories(json.data)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchCategories() }, [])

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', color: '#005496', icon: '' })
    setEditId(null)
    setError('')
  }

  const handleNameChange = (name: string) => {
    setForm(prev => ({ ...prev, name, slug: editId ? prev.slug : slugify(name) }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) return setError('Tên danh mục không được trống')
    setSaving(true)
    setError('')

    try {
      const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: form.slug || slugify(form.name),
        }),
      })

      const json = await res.json()
      if (!json.success) {
        setError(json.error || 'Có lỗi xảy ra')
        showToast.error(json.error || 'Có lỗi xảy ra')
      } else {
        showToast.success(editId ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục mới')
        resetForm()
        fetchCategories()
      }
    } catch { setError('Lỗi kết nối'); showToast.error('Lỗi kết nối') } finally { setSaving(false) }
  }

  const handleEdit = (cat: CategoryItem) => {
    setEditId(cat._id)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', color: cat.color, icon: cat.icon || '' })
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      showToast.success('Đã xóa danh mục')
      setDeleteId(null)
      fetchCategories()
    } catch {
      showToast.error('Lỗi kết nối')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800">Quản lý Danh mục</h1>
          <p className="text-[15px] text-slate-500 font-medium mt-1">Tạo và quản lý danh mục phân loại bài viết.</p>
        </div>
      </div>

      {/* Form tạo/sửa */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-sm text-slate-700 mb-4">
          {editId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-slate-700">Tên danh mục <span className="text-rose-500">*</span></label>
            <Input
              placeholder="VD: Thông báo, Tin tức..."
              className="h-9 rounded-lg border-slate-200 text-sm"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-slate-700">Slug (URL)</label>
            <Input
              placeholder="thong-bao"
              className="h-9 rounded-lg border-slate-200 text-sm font-mono"
              value={form.slug}
              onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-slate-700">Mô tả ngắn</label>
            <Input
              placeholder="Mô tả tùy chọn..."
              className="h-9 rounded-lg border-slate-200 text-sm"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-slate-700">Màu nhãn</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                value={form.color}
                onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
              />
              <Input
                className="h-9 rounded-lg border-slate-200 text-sm font-mono flex-1"
                value={form.color}
                onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-slate-700">Icon đại diện</label>
            <IconPicker
              value={form.icon}
              onChange={(icon) => setForm(prev => ({ ...prev, icon }))}
            />
          </div>
        </div>

        {error && <p className="text-xs text-rose-500 font-medium mt-3">{error}</p>}

        <div className="flex items-center gap-2 mt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="h-8 px-4 text-xs font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
            {editId ? 'Cập nhật' : 'Tạo mới'}
          </Button>
          {editId && (
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-lg border-slate-200" onClick={resetForm}>
              <X className="w-3.5 h-3.5 mr-1" /> Hủy
            </Button>
          )}
        </div>
      </div>

      {/* Bảng danh mục */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FolderOpen className="w-8 h-8 text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-800">Chưa có danh mục</h3>
            <p className="text-xs text-slate-500 mt-1">Tạo danh mục đầu tiên phía trên.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 px-5 text-[13px] font-semibold text-slate-500">Tên</TableHead>
                <TableHead className="h-9 px-5 text-[13px] font-semibold text-slate-500">Slug</TableHead>
                <TableHead className="h-9 px-5 text-[13px] font-semibold text-slate-500">Màu</TableHead>
                <TableHead className="h-9 px-5 text-[13px] font-semibold text-slate-500 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => {
                const Icon = cat.icon ? (LucideIcons as any)[cat.icon] : null
                return (
                <TableRow key={cat._id} className="hover:bg-slate-50/60 group">
                  <TableCell className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      {Icon ? (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                          <Icon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-slate-400">
                          <FolderOpen className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span className="text-[14px] font-semibold text-slate-800">{cat.name}</span>
                        {cat.description && <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-5">
                    <code className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{cat.slug}</code>
                  </TableCell>
                  <TableCell className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-mono text-slate-500">{cat.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-[#005496] hover:bg-blue-50" onClick={() => handleEdit(cat)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50" onClick={() => setDeleteId(cat._id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) await handleDelete(deleteId) }}
        title="Xóa danh mục này?"
        description="Danh mục sẽ bị xóa vĩnh viễn. Các bài viết thuộc danh mục này sẽ không còn phân loại."
        variant="destructive"
        loading={deleting}
      />
    </div>
  )
}
