import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from './User'
import { NewsStatus } from '@/types/news'

export interface INews extends Document {
  title: string
  slug: string
  content: string
  excerpt?: string
  seoDescription?: string
  thumbnail?: string
  status: NewsStatus
  category: mongoose.Types.ObjectId
  tags: string[]
  attachedFile?: {
    name: string
    url: string
  }
  author: mongoose.Types.ObjectId | IUser
  publishedAt?: Date
  views: number
  isPinned: boolean
  hideThumbnail: boolean
  hidePdfPreview: boolean
  tocEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề là bắt buộc'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Nội dung là bắt buộc'],
    },
    excerpt: {
      type: String,
      maxlength: 500,
    },
    seoDescription: {
      type: String,
      maxlength: 500,
    },
    thumbnail: {
      type: String,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    attachedFile: {
      name: String,
      url: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    hideThumbnail: {
      type: Boolean,
      default: false,
    },
    hidePdfPreview: {
      type: Boolean,
      default: false,
    },
    tocEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

if (mongoose.models.News) {
  delete mongoose.models.News;
}

const News: Model<INews> = mongoose.model<INews>('News', newsSchema)

export default News
