import mongoose, { Document, Schema } from 'mongoose'
import { AdmissionLevel, AdmissionStatus } from '@/types/admission'

export interface IAdmissionRound extends Document {
  name: string
  level: AdmissionLevel
  programIds: string[]
  openDate: Date
  closeDate: Date
  examDate?: Date
  resultDate?: Date
  status: AdmissionStatus
  quota: number
  brochureUrl?: string
  syllabusUrl?: string
  createdAt: Date
  updatedAt: Date
  
  // Virtual field
  applicantCount: number
}

const AdmissionRoundSchema = new Schema<IAdmissionRound>(
  {
    name: { 
      type: String, 
      required: [true, 'Vui lòng nhập tên đợt tuyển sinh'],
      trim: true 
    },
    level: { 
      type: String, 
      enum: ['THAC_SI', 'TIEN_SI'], 
      required: true 
    },
    programIds: [{ 
      type: String // Tương lai có thể đổi thành ObjectId tham chiếu đến model Program
    }],
    openDate: { 
      type: Date, 
      required: true 
    },
    closeDate: { 
      type: Date, 
      required: true 
    },
    examDate: { 
      type: Date 
    },
    resultDate: { 
      type: Date 
    },
    status: { 
      type: String, 
      enum: ['OPEN', 'CLOSED', 'UPCOMING'], 
      default: 'UPCOMING' 
    },
    quota: { 
      type: Number, 
      required: true,
      min: [1, 'Chỉ tiêu phải lớn hơn 0']
    },
    brochureUrl: { 
      type: String 
    },
    syllabusUrl: { 
      type: String 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtual for applicant count
AdmissionRoundSchema.virtual('applicantCount', {
  ref: 'Applicant',
  localField: '_id',
  foreignField: 'roundId',
  count: true
})

// Tự động phân loại status dựa trên open/close date nếu document được cập nhật/khởi tạo
AdmissionRoundSchema.pre('save', function() {
  const now = new Date()
  if (this.isModified('openDate') || this.isModified('closeDate')) {
    if (now < this.openDate) {
      this.status = 'UPCOMING'
    } else if (now >= this.openDate && now <= this.closeDate) {
      this.status = 'OPEN'
    } else if (now > this.closeDate) {
      this.status = 'CLOSED'
    }
  }
})

export default mongoose.models.AdmissionRound || mongoose.model<IAdmissionRound>('AdmissionRound', AdmissionRoundSchema)
