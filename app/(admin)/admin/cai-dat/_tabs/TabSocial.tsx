'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Loader2, GripVertical, Eye, EyeOff } from 'lucide-react'
import { Facebook, Youtube, Linkedin, Instagram, Twitter, MessageCircle, Music2, Globe } from 'lucide-react'

const PLATFORM_INFO: Record<string, { label: string; icon: any; color: string; placeholder: string }> = {
  facebook: { label: 'Facebook', icon: Facebook, color: '#1877F2', placeholder: 'https://facebook.com/...' },
  zalo: { label: 'Zalo Official', icon: MessageCircle, color: '#0068FF', placeholder: 'https://zalo.me/...' },
  youtube: { label: 'YouTube', icon: Youtube, color: '#FF0000', placeholder: 'https://youtube.com/@...' },
  tiktok: { label: 'TikTok', icon: Music2, color: '#000000', placeholder: 'https://tiktok.com/@...' },
  linkedin: { label: 'LinkedIn', icon: Linkedin, color: '#0A66C2', placeholder: 'https://linkedin.com/company/...' },
  instagram: { label: 'Instagram', icon: Instagram, color: '#E4405F', placeholder: 'https://instagram.com/...' },
  twitter: { label: 'Twitter / X', icon: Twitter, color: '#1DA1F2', placeholder: 'https://x.com/...' },
}

interface SocialLink {
  platform: string
  url: string
  enabled: boolean
  order: number
}

interface Props {
  data: SocialLink[]
  onSave: (data: any) => void
  saving: boolean
}

export default function TabSocial({ data, onSave, saving }: Props) {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  useEffect(() => {
    // Sắp xếp theo order
    const sorted = [...(data || [])].sort((a, b) => a.order - b.order)
    setLinks(sorted)
  }, [data])

  const updateLink = (index: number, key: keyof SocialLink, value: any) => {
    setLinks(prev => prev.map((link, i) => i === index ? { ...link, [key]: value } : link))
  }

  const handleDragStart = (index: number) => setDragIdx(index)
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === index) return
    
    const newLinks = [...links]
    const dragged = newLinks.splice(dragIdx, 1)[0]
    newLinks.splice(index, 0, dragged)
    
    // Cập nhật order
    const reordered = newLinks.map((link, i) => ({ ...link, order: i }))
    setLinks(reordered)
    setDragIdx(index)
  }

  const handleDragEnd = () => setDragIdx(null)

  const handleSave = () => {
    onSave(links.map((link, i) => ({ ...link, order: i })))
  }

  return (
    <div className="space-y-5">
      <p className="text-[13px] text-slate-500">
        Kéo thả để sắp xếp thứ tự hiển thị. Bật/tắt để hiện/ẩn trên website.
      </p>

      {/* Social Links List */}
      <div className="space-y-2">
        {links.map((link, index) => {
          const info = PLATFORM_INFO[link.platform] || {
            label: link.platform, icon: Globe, color: '#64748b', placeholder: 'https://...'
          }
          const Icon = info.icon
          
          return (
            <div
              key={link.platform}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing
                ${dragIdx === index 
                  ? 'border-[#005496] bg-[#005496]/5 scale-[1.01] shadow-sm' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }
                ${!link.enabled ? 'opacity-60' : ''}
              `}
            >
              {/* Drag handle */}
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />

              {/* Platform icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${info.color}15`, color: info.color }}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>

              {/* Platform name & URL */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-slate-700 mb-1">{info.label}</div>
                <Input
                  value={link.url}
                  onChange={e => updateLink(index, 'url', e.target.value)}
                  className="h-8 rounded-lg border-slate-200 text-xs"
                  placeholder={info.placeholder}
                />
              </div>

              {/* Toggle */}
              <button
                onClick={() => updateLink(index, 'enabled', !link.enabled)}
                className={`
                  p-2 rounded-lg transition-all shrink-0
                  ${link.enabled 
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }
                `}
                title={link.enabled ? 'Đang hiển thị' : 'Đang ẩn'}
              >
                {link.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          )
        })}
      </div>

      {/* Preview */}
      {links.some(l => l.enabled && l.url) && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Preview Footer</p>
          <div className="flex items-center gap-2">
            {links.filter(l => l.enabled && l.url).map(link => {
              const info = PLATFORM_INFO[link.platform] || { icon: Globe, color: '#64748b', label: link.platform }
              const Icon = info.icon
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: info.color, color: 'white' }}
                  title={info.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-6 text-sm font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu mạng xã hội
        </Button>
      </div>
    </div>
  )
}
