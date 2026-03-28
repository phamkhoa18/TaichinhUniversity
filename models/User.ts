import mongoose, { Document, Model, Schema } from 'mongoose'
import { Role } from '@/types/auth'

export interface IUser extends Document {
  email: string
  name: string
  passwordHash: string
  role: Role
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Họ tên là bắt buộc'],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
    },
    role: {
      type: String,
      enum: ['ADMIN', 'EDITOR', 'ADMISSION_OFFICER'],
      default: 'EDITOR',
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User
