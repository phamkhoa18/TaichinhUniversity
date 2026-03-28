export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface NewsBase {
  _id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  thumbnail?: string
  status: NewsStatus
  category: any  // ObjectId or populated Category
  tags: string[]
  author: any
  publishedAt?: string | Date
  views: number
  isPinned: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export type CreateNewsInput = Omit<NewsBase, '_id' | 'views' | 'createdAt' | 'updatedAt' | 'author'> & {
  author?: string
}
