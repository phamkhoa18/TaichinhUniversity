'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Menu, Plus, Save, Loader2, GripVertical, Trash2, ChevronDown, ChevronUp,
  Eye, EyeOff, ExternalLink, Link2, PanelTop, Pencil, X,
  RotateCcw, FolderPlus,
} from 'lucide-react'
import { showToast } from '@/lib/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface SubLink {
  _id?: string
  label: string
  href: string
  order: number
}

interface SubGroup {
  _id?: string
  title: string
  links: SubLink[]
  order: number
}

interface MenuItemData {
  _id: string
  label: string
  href: string
  type: 'link' | 'mega'
  target: '_self' | '_blank'
  enabled: boolean
  order: number
  groups: SubGroup[]
  overview: { label: string; href: string }
  promo: { title: string; desc: string; cta: string; href: string }
}

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Tìm label của item đang xóa (dùng cho ConfirmDialog)
  const deletingItem = items.find(i => i._id === showDeleteConfirm)

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/menu')
      const json = await res.json()
      if (json.success) {
        setItems(json.data)
      } else {
        showToast.error('Lỗi tải menu', json.error)
      }
    } catch {
      showToast.error('Lỗi kết nối', 'Không thể tải dữ liệu menu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMenu() }, [fetchMenu])

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/admin/menu/seed', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        showToast.success(json.message)
        fetchMenu()
      } else {
        showToast.error('Lỗi', json.error)
      }
    } catch {
      showToast.error('Lỗi kết nối')
    } finally {
      setSeeding(false)
    }
  }

  // ── Thêm menu item mới ──
  const handleAdd = async () => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: 'Menu mới', type: 'link', href: '#' }),
      })
      const json = await res.json()
      if (json.success) {
        showToast.success('Đã thêm menu mới')
        fetchMenu()
      }
    } catch {
      showToast.error('Lỗi kết nối')
    }
  }

  // ── Save single item ──
  const handleSaveItem = async (item: MenuItemData) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      const json = await res.json()
      if (json.success) {
        showToast.success('Đã lưu menu: ' + item.label)
        setEditingItem(null)
        fetchMenu()
      } else {
        showToast.error('Lỗi', json.error)
      }
    } catch {
      showToast.error('Lỗi kết nối')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete item ──
  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        showToast.success('Đã xóa menu')
        setShowDeleteConfirm(null)
        fetchMenu()
      } else {
        showToast.error('Lỗi', json.error)
      }
    } catch {
      showToast.error('Lỗi kết nối')
    } finally {
      setDeleting(false)
    }
  }

  // ── Drag & Drop Reorder ──
  const handleDragStart = (index: number) => setDragIdx(index)

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === index) return
    const newItems = [...items]
    const dragged = newItems.splice(dragIdx, 1)[0]
    newItems.splice(index, 0, dragged)
    setItems(newItems)
    setDragIdx(index)
  }

  const handleDragEnd = async () => {
    setDragIdx(null)
    // Save new order
    const reorderData = items.map((item, i) => ({ _id: item._id, order: i }))
    try {
      await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder: true, items: reorderData }),
      })
      showToast.success('Đã cập nhật thứ tự menu')
    } catch {}
  }

  // ── Toggle enabled ──
  const toggleEnabled = async (item: MenuItemData) => {
    const updated = { ...item, enabled: !item.enabled }
    await handleSaveItem(updated)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#005496] animate-spin" />
          <span className="text-sm text-slate-500 font-medium">Đang tải menu...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800 flex items-center gap-2.5">
            <Menu className="w-6 h-6 text-[#005496]" />
            Quản lý Menu
          </h1>
          <p className="text-[15px] text-slate-500 font-medium mt-1">
            Quản lý thanh điều hướng chính — kéo thả để sắp xếp, bật/tắt để hiện/ẩn.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {items.length === 0 && (
            <Button onClick={handleSeed} disabled={seeding} variant="outline" className="h-10 px-4 text-sm font-semibold rounded-lg border-slate-200">
              {seeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
              Tạo menu mặc định
            </Button>
          )}
          <Button onClick={handleAdd} className="h-10 px-4 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Thêm menu
          </Button>
        </div>
      </div>


      {/* Menu List */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Menu className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Chưa có menu nào.</p>
          <p className="text-sm text-slate-400 mt-1">Nhấn &quot;Tạo menu mặc định&quot; để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item._id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                bg-white rounded-xl border transition-all
                ${dragIdx === index ? 'border-[#005496] scale-[1.01] shadow-sm' : 'border-slate-200 hover:border-slate-300'}
                ${!item.enabled ? 'opacity-60' : ''}
              `}
            >
              {/* Item Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <GripVertical className="w-4 h-4 text-slate-300 shrink-0 cursor-grab active:cursor-grabbing" />

                {/* Type badge */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  item.type === 'mega' ? 'bg-[#005496]/10 text-[#005496]' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.type === 'mega' ? 'Mega' : 'Link'}
                </span>

                {/* Label */}
                <span className="text-[14px] font-semibold text-slate-800 flex-1">
                  {item.label}
                </span>

                {/* Href preview */}
                {item.type === 'link' && item.href !== '#' && (
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">{item.href}</span>
                )}

                {/* Sub count */}
                {item.type === 'mega' && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.groups.reduce((acc, g) => acc + g.links.length, 0)} links
                  </span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleEnabled(item)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.enabled ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={item.enabled ? 'Đang hiện' : 'Đang ẩn'}
                  >
                    {item.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      setEditingItem(editingItem?._id === item._id ? null : { ...item })
                      setExpandedId(expandedId === item._id ? null : item._id)
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#005496] hover:bg-[#005496]/5 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(item._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    {expandedId === item._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>


              {/* Expanded: Read-only view */}
              {expandedId === item._id && editingItem?._id !== item._id && item.type === 'mega' && (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Promo & Overview */}
                    <div className="space-y-4">
                      {item.overview.label && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Link2 className="w-3 h-3" /> Tổng quan
                          </p>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <p className="text-[12px] font-semibold text-slate-700">{item.overview.label}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{item.overview.href}</p>
                          </div>
                        </div>
                      )}
                      
                      {item.promo.title && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <PanelTop className="w-3 h-3" /> Quảng bá
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <p className="text-[12px] font-semibold text-[#005496]">{item.promo.title}</p>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.promo.desc}</p>
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-600">{item.promo.cta}</span>
                              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]">{item.promo.href}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Groups */}
                    <div className="md:col-span-1 lg:col-span-2 space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <FolderPlus className="w-3 h-3" /> Nhóm Menu ({item.groups.length})
                      </p>
                      {item.groups.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {item.groups.map((group, gi) => (
                            <div key={gi} className="bg-white p-3 rounded-lg border border-slate-200">
                              <h4 className="text-[12px] font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1.5">{group.title}</h4>
                              <ul className="space-y-1.5 mt-2">
                                {group.links.map((link, li) => (
                                  <li key={li} className="flex items-start gap-2 text-[12px] text-slate-600">
                                    <span className="mt-1.5 w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                                    <span className="flex-1 font-medium">{link.label}</span>
                                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]" title={link.href}>{link.href}</span>
                                  </li>
                                ))}
                                {group.links.length === 0 && <li className="text-[11px] text-slate-400 italic">Chưa có link</li>}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                          <p className="text-[11px] text-slate-500">Chưa có nhóm menu con nào.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded: Edit form */}
              {expandedId === item._id && editingItem?._id === item._id && (
                <MenuItemEditor
                  item={editingItem}
                  onChange={setEditingItem}
                  onSave={() => handleSaveItem(editingItem)}
                  onCancel={() => { setEditingItem(null); setExpandedId(null) }}
                  saving={saving}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Preview info */}
      {items.length > 0 && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1.5">
          <p className="text-xs text-slate-400">
            Thay đổi sẽ ảnh hưởng lên thanh điều hướng chính của website.
            Menu có trạng thái <Eye className="w-3 h-3 inline text-emerald-500 mx-0.5" /> sẽ hiển thị trên trang công khai.
          </p>
          <p className="text-xs text-slate-400">
            💡 Để quản lý nội dung <strong className="text-slate-600">Footer</strong> (chân trang), vào{' '}
            <a href="/admin/cai-dat" className="text-[#005496] font-semibold hover:underline">
              Cài đặt → Footer
            </a>
          </p>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={async () => { if (showDeleteConfirm) await handleDelete(showDeleteConfirm) }}
        title={`Xóa menu "${deletingItem?.label || ''}"?`}
        description="Menu này sẽ bị xóa vĩnh viễn khỏi thanh điều hướng. Thao tác không thể hoàn tác."
        variant="destructive"
        loading={deleting}
      />
    </div>
  )
}

// ================================================================
// SUB-COMPONENT: MenuItemEditor (edit form bên trong expanded area)
// ================================================================

function MenuItemEditor({
  item, onChange, onSave, onCancel, saving,
}: {
  item: MenuItemData
  onChange: (item: MenuItemData) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  const update = (key: string, value: any) => onChange({ ...item, [key]: value })
  const updatePromo = (key: string, value: any) => onChange({ ...item, promo: { ...item.promo, [key]: value } })
  const updateOverview = (key: string, value: any) => onChange({ ...item, overview: { ...item.overview, [key]: value } })

  const addGroup = () => {
    const newGroup: SubGroup = { title: 'Nhóm mới', links: [], order: item.groups.length }
    update('groups', [...item.groups, newGroup])
  }

  const updateGroup = (gi: number, key: string, value: any) => {
    const groups = [...item.groups]
    groups[gi] = { ...groups[gi], [key]: value }
    update('groups', groups)
  }

  const removeGroup = (gi: number) => {
    update('groups', item.groups.filter((_, i) => i !== gi))
  }

  const addLink = (gi: number) => {
    const groups = [...item.groups]
    groups[gi].links = [...groups[gi].links, { label: 'Link mới', href: '#', order: groups[gi].links.length }]
    update('groups', groups)
  }

  const updateLink = (gi: number, li: number, key: string, value: any) => {
    const groups = [...item.groups]
    groups[gi].links = groups[gi].links.map((link, i) => i === li ? { ...link, [key]: value } : link)
    update('groups', groups)
  }

  const removeLink = (gi: number, li: number) => {
    const groups = [...item.groups]
    groups[gi].links = groups[gi].links.filter((_, i) => i !== li)
    update('groups', groups)
  }

  return (
    <div className="px-4 pb-4 space-y-5 border-t border-slate-100 bg-slate-50/50">
      {/* Basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Field label="Tên hiển thị" required>
          <Input value={item.label} onChange={e => update('label', e.target.value)}
            className="h-9 rounded-lg border-slate-200 text-sm" placeholder="Giới thiệu" />
        </Field>
        <Field label="Loại menu">
          <Select value={item.type} onValueChange={v => update('type', v)}>
            <SelectTrigger className="h-9 rounded-lg border-slate-200 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="link">Link đơn</SelectItem>
              <SelectItem value="mega">Mega Menu (dropdown)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label={item.type === 'link' ? 'URL đích' : 'URL mặc định'}>
          <Input value={item.href} onChange={e => update('href', e.target.value)}
            className="h-9 rounded-lg border-slate-200 text-sm font-mono" placeholder="/gioi-thieu" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Mở link">
          <Select value={item.target} onValueChange={v => update('target', v as '_self' | '_blank')}>
            <SelectTrigger className="h-9 rounded-lg border-slate-200 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_self">Cùng cửa sổ</SelectItem>
              <SelectItem value="_blank">Tab mới</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* Mega menu config */}
      {item.type === 'mega' && (
        <>
          {/* Overview link */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              Link Tổng quan (hiện trong mega menu)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input value={item.overview.label} onChange={e => updateOverview('label', e.target.value)}
                className="h-8 rounded-lg border-slate-200 text-xs" placeholder="Tổng quan" />
              <Input value={item.overview.href} onChange={e => updateOverview('href', e.target.value)}
                className="h-8 rounded-lg border-slate-200 text-xs font-mono" placeholder="/gioi-thieu" />
            </div>
          </div>

          {/* Promo block */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <PanelTop className="w-3.5 h-3.5" />
              Panel Quảng bá (bên trái mega menu)
            </p>
            <Input value={item.promo.title} onChange={e => updatePromo('title', e.target.value)}
              className="h-8 rounded-lg border-slate-200 text-xs" placeholder="Tiêu đề" />
            <textarea
              value={item.promo.desc}
              onChange={e => updatePromo('desc', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs resize-none"
              placeholder="Mô tả ngắn..."
            />
            <div className="grid grid-cols-2 gap-3">
              <Input value={item.promo.cta} onChange={e => updatePromo('cta', e.target.value)}
                className="h-8 rounded-lg border-slate-200 text-xs" placeholder="Nút CTA: Tìm hiểu thêm" />
              <Input value={item.promo.href} onChange={e => updatePromo('href', e.target.value)}
                className="h-8 rounded-lg border-slate-200 text-xs font-mono" placeholder="/gioi-thieu" />
            </div>
          </div>

          {/* Sub-groups */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nhóm Menu ({item.groups.length})
              </p>
              <Button size="sm" variant="outline" onClick={addGroup}
                className="h-7 px-2.5 text-[11px] rounded-lg border-slate-200">
                <FolderPlus className="w-3 h-3 mr-1" />
                Thêm nhóm
              </Button>
            </div>

            {item.groups.map((group, gi) => (
              <div key={gi} className="p-3 bg-white rounded-lg border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Input
                    value={group.title}
                    onChange={e => updateGroup(gi, 'title', e.target.value)}
                    className="h-8 rounded-lg border-slate-200 text-xs font-semibold flex-1"
                    placeholder="Tên nhóm"
                  />
                  <button onClick={() => removeGroup(gi)} className="p-1 text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Links in group */}
                {group.links.map((link, li) => (
                  <div key={li} className="flex items-center gap-2 ml-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                    <Input
                      value={link.label}
                      onChange={e => updateLink(gi, li, 'label', e.target.value)}
                      className="h-7 rounded border-slate-200 text-[11px] flex-1"
                      placeholder="Label"
                    />
                    <Input
                      value={link.href}
                      onChange={e => updateLink(gi, li, 'href', e.target.value)}
                      className="h-7 rounded border-slate-200 text-[11px] font-mono w-40"
                      placeholder="/path"
                    />
                    <button onClick={() => removeLink(gi, li)} className="p-0.5 text-slate-400 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addLink(gi)}
                  className="ml-3 text-[11px] text-[#005496] hover:text-[#004882] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Thêm link
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Save / Cancel */}
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={onSave} disabled={saving}
          className="h-9 px-5 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
          {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
          Lưu
        </Button>
        <Button onClick={onCancel} variant="outline" className="h-9 px-4 text-sm rounded-lg border-slate-200">
          Hủy
        </Button>
      </div>
    </div>
  )
}

function Field({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-semibold text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  )
}
