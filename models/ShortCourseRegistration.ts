import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IShortCourseRegistration extends Document {
  lastName: string
  firstName: string
  birthDate?: Date
  phone: string
  email: string
  workplace: string
  courses: mongoose.Types.ObjectId[]
  totalFee: number
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED'
  registrationCode: string
  note: string
  createdAt: Date
  updatedAt: Date
}

const shortCourseRegistrationSchema = new Schema<IShortCourseRegistration>(
  {
    lastName: { type: String, required: [true, 'Họ và tên lót là bắt buộc'], trim: true },
    firstName: { type: String, required: [true, 'Tên là bắt buộc'], trim: true },
    birthDate: { type: Date },
    phone: { type: String, required: [true, 'Số điện thoại là bắt buộc'], trim: true, index: true },
    email: { type: String, required: [true, 'Email là bắt buộc'], trim: true, lowercase: true },
    workplace: { type: String, default: '', trim: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'ShortCourse' }],
    totalFee: { type: Number, default: 0, min: 0 },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'CANCELLED'], default: 'PENDING' },
    registrationCode: { type: String, unique: true, trim: true },
    note: { type: String, default: '' },
  },
  { timestamps: true }
)

// Auto-generate registration code before save
shortCourseRegistrationSchema.pre('save', async function () {
  if (!this.registrationCode) {
    const count = await mongoose.model('ShortCourseRegistration').countDocuments()
    this.registrationCode = `DTNH${String(count + 1).padStart(4, '0')}`
  }
})

if (mongoose.models.ShortCourseRegistration) {
  delete mongoose.models.ShortCourseRegistration
}

const ShortCourseRegistration: Model<IShortCourseRegistration> = mongoose.model<IShortCourseRegistration>(
  'ShortCourseRegistration',
  shortCourseRegistrationSchema
)

export default ShortCourseRegistration
