import mongoose, { Document, Schema } from 'mongoose'
import { ApplicationStatus } from '@/types/admission'

export interface IApplicant extends Document {
  roundId: mongoose.Types.ObjectId
  programId: string
  fullName: string
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  idCard: string
  phone: string
  email: string
  address: string
  province: string
  degreeSchool: string
  degreeMajor: string
  degreeYear: number
  degreeGpa?: number
  cvUrl?: string
  diplomaUrl?: string
  transcriptUrl?: string
  idCardUrl?: string
  photoUrl?: string
  otherFiles: string[]
  status: ApplicationStatus
  notes?: string
  reviewedBy?: mongoose.Types.ObjectId
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ApplicantSchema = new Schema<IApplicant>(
  {
    roundId: { 
      type: Schema.Types.ObjectId, 
      ref: 'AdmissionRound', 
      required: true 
    },
    programId: { 
      type: String, 
      required: true 
    },
    fullName: { 
      type: String, 
      required: true,
      trim: true 
    },
    dateOfBirth: { 
      type: Date, 
      required: true 
    },
    gender: { 
      type: String, 
      enum: ['MALE', 'FEMALE', 'OTHER'], 
      required: true 
    },
    idCard: { 
      type: String, 
      required: true
    },
    phone: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true,
      lowercase: true,
      trim: true
    },
    address: { 
      type: String, 
      required: true 
    },
    province: { 
      type: String, 
      required: true 
    },
    degreeSchool: { 
      type: String, 
      required: true 
    },
    degreeMajor: { 
      type: String, 
      required: true 
    },
    degreeYear: { 
      type: Number, 
      required: true 
    },
    degreeGpa: { 
      type: Number 
    },
    cvUrl: { type: String },
    diplomaUrl: { type: String },
    transcriptUrl: { type: String },
    idCardUrl: { type: String },
    photoUrl: { type: String },
    otherFiles: [{ type: String }],
    status: { 
      type: String, 
      enum: ['PENDING', 'QUALIFIED', 'ADMITTED', 'NOT_QUALIFIED', 'REJECTED'], 
      default: 'PENDING' 
    },
    notes: { type: String },
    reviewedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
)

// Index để chặn 1 người nộp nhiều hồ sơ vào cùng 1 Đợt + Ngành học
ApplicantSchema.index({ roundId: 1, programId: 1, idCard: 1 }, { unique: true })

export default mongoose.models.Applicant || mongoose.model<IApplicant>('Applicant', ApplicantSchema)
