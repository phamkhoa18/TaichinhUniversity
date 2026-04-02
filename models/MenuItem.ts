// ============================================================
// MODEL — Menu (Tree Structure)
// Lưu menu dạng nested — hỗ trợ mega menu nhiều cấp
// ============================================================

import mongoose, { Document, Model, Schema } from 'mongoose'

// Sub-link trong 1 group
const menuSubLinkSchema = new Schema({
  label: { type: String, required: true },
  href: { type: String, default: '#' },
  order: { type: Number, default: 0 },
}, { _id: true })

// Sub-group (tiêu đề + list links)
const menuSubGroupSchema = new Schema({
  title: { type: String, required: true },
  links: [menuSubLinkSchema],
  order: { type: Number, default: 0 },
}, { _id: true })

// Promo block (hiển thị bên trái mega menu)
const menuPromoSchema = new Schema({
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  cta: { type: String, default: '' },
  href: { type: String, default: '#' },
}, { _id: false })

// Main menu item interface
export interface IMenuItem extends Document {
  label: string
  href: string
  type: 'link' | 'mega'       // 'link' = link thường, 'mega' = có mega dropdown
  target: '_self' | '_blank'
  enabled: boolean
  order: number
  groups: Array<{
    _id?: string
    title: string
    links: Array<{
      _id?: string
      label: string
      href: string
      order: number
    }>
    order: number
  }>
  overview: {
    label: string
    href: string
  }
  promo: {
    title: string
    desc: string
    cta: string
    href: string
  }
}

// Main menu item schema
const menuItemSchema = new Schema<IMenuItem>(
  {
    label: { type: String, required: true },
    href: { type: String, default: '#' },
    type: { type: String, enum: ['link', 'mega'], default: 'link' },
    target: { type: String, enum: ['_self', '_blank'], default: '_self' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    groups: {
      type: [menuSubGroupSchema],
      default: [],
    },
    overview: {
      label: { type: String, default: '' },
      href: { type: String, default: '' },
    },
    promo: {
      type: menuPromoSchema,
      default: { title: '', desc: '', cta: '', href: '#' },
    },
  },
  {
    timestamps: true,
    collection: 'menus',
  }
)

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', menuItemSchema)

export default MenuItem
