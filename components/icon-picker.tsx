'use client'

import React, { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// A sane subset of general purpose icons from Lucide for categorization
const COMMON_ICONS = [
  'Bell', 'Book', 'Bookmark', 'Briefcase', 'Calendar', 'Camera', 'Check', 'Box',
  'Clock', 'Cloud', 'Code', 'Compass', 'CreditCard', 'Database', 'File', 
  'FileText', 'Filter', 'Flag', 'Folder', 'Globe', 'Heart', 'Home', 
  'Image', 'Info', 'Key', 'Layers', 'Layout', 'Link', 'Lock', 'Mail', 
  'Map', 'Menu', 'MessageCircle', 'MessageSquare', 'Mic', 'Monitor', 
  'Moon', 'Music', 'Paperclip', 'Phone', 'Play', 'Search', 'Send', 'Settings', 
  'Share', 'Shield', 'ShoppingBag', 'ShoppingCart', 'Star', 'Sun', 'Tag', 
  'Terminal', 'Tool', 'Trash', 'TrendingUp', 'User', 'Users', 'Video', 
  'Wifi', 'Zap', 'GraduationCap', 'Activity', 'Award', 'BookOpen', 'CheckCircle', 
  'Clipboard', 'FileCheck', 'FileCode', 'FileDigit', 'FileEdit', 'FileKey', 
  'FilePlus', 'FileSearch', 'Lightbulb', 'PenTool', 'Speaker', 'Megaphone',
  'Newspaper', 'Radio', 'MailOpen', 'HelpCircle', 'FolderOpen', 'Network', 'Globe2'
]

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.FolderOpen
  const displayIcon = value ? (LucideIcons as any)[value] : null

  const filteredIcons = COMMON_ICONS.filter(name => 
    name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox"
          className="w-full justify-start gap-2 h-9 border-slate-200 bg-white"
        >
          {displayIcon ? <CurrentIcon className="w-4 h-4" /> : <LucideIcons.Search className="w-4 h-4 text-slate-400" />}
          <span className="truncate flex-1 text-left text-slate-600 font-normal">
            {value || 'Chọn icon...'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-2" align="start">
        <Input 
          placeholder="Tìm kiếm icon..." 
          className="h-8 mb-2 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="h-[200px] overflow-y-auto pr-1">
          <div className="grid grid-cols-5 gap-1">
            {filteredIcons.map(name => {
              const Icon = (LucideIcons as any)[name]
              if (!Icon) return null
              return (
                <Button
                  key={name}
                  variant={value === name ? "default" : "ghost"}
                  className={`h-10 w-10 p-0 rounded-lg ${value === name ? 'bg-[#005496] hover:bg-[#004882]' : 'hover:bg-slate-100 text-slate-600'}`}
                  onClick={() => {
                    onChange(name)
                    setOpen(false)
                  }}
                  title={name}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              )
            })}
          </div>
          {filteredIcons.length === 0 && (
            <p className="text-center text-xs text-slate-500 py-4">Không tìm thấy icon nào</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
