import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IShortCourse extends Document {
  title: string
  code: string
  slug: string
  description: string
  excerpt: string
  thumbnail: string
  price: number
  schedule: string
  duration: string
  startDate: Date
  endDate?: Date
  location: string
  instructor: string
  maxStudents: number
  currentStudents: number
  status: 'OPEN' | 'CLOSED' | 'DRAFT'
  isHot: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const shortCourseSchema = new Schema<IShortCourse>(
  {
    title: { type: String, required: [true, 'Tên khóa học là bắt buộc'], trim: true },
    code: { type: String, required: [true, 'Mã lớp là bắt buộc'], unique: true, trim: true, uppercase: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    excerpt: { type: String, default: '', maxlength: 500 },
    thumbnail: { type: String, default: '' },
    price: { type: Number, required: true, default: 0, min: 0 },
    schedule: { type: String, default: '' },
    duration: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    location: { type: String, default: '' },
    instructor: { type: String, default: '' },
    maxStudents: { type: Number, default: 0 },
    currentStudents: { type: Number, default: 0 },
    status: { type: String, enum: ['OPEN', 'CLOSED', 'DRAFT'], default: 'DRAFT' },
    isHot: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

if (mongoose.models.ShortCourse) {
  delete mongoose.models.ShortCourse
}

const ShortCourse: Model<IShortCourse> = mongoose.model<IShortCourse>('ShortCourse', shortCourseSchema)

export default ShortCourse
