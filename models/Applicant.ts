import mongoose, { Document, Schema } from 'mongoose'
import { ApplicationStatus } from '@/types/admission'

export interface IApplicant extends Document {
  roundId: mongoose.Types.ObjectId
  programId: string

  // I. THÔNG TIN CÁ NHÂN
  fullName: string
  dateOfBirth: Date
  birthPlace: string        // Nơi sinh (Tỉnh/TP)
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  ethnicity: string         // Dân tộc
  nationality: string       // Quốc tịch
  idCard: string            // CCCD/CMND
  idCardDate?: Date         // Ngày cấp
  idCardPlace?: string      // Nơi cấp
  phone: string
  email: string
  address: string           // Địa chỉ liên lạc đầy đủ
  province: string          // Tỉnh/TP
  district?: string         // Quận/Huyện
  ward?: string             // Phường/Xã
  occupation?: string       // Nghề nghiệp
  workplace?: string        // Cơ quan công tác
  position?: string         // Chức vụ

  // II. QUÁ TRÌNH ĐÀO TẠO
  degreeSchool: string      // Cơ sở đào tạo
  degreeCountry: string     // Quốc gia đào tạo
  degreeSystem?: string     // Hệ đào tạo (Chính quy, VLVH…)
  degreeMajor: string       // Ngành tốt nghiệp
  degreeSpecialization?: string // Chuyên ngành TN
  degreeYear: number        // Năm tốt nghiệp
  degreeClassification?: string // Xếp loại TN
  degreeGpa?: number
  isAlumni?: boolean        // Cựu sinh viên UFM

  // III. DỰ TUYỂN
  entranceExamSubject?: string   // Đăng ký thi ngoại ngữ đầu vào
  orientation?: string           // Định hướng (Ứng dụng / Nghiên cứu)
  supplementaryKnowledge?: boolean // Đăng ký bổ sung kiến thức

  // IV. FILE HỒ SƠ
  photoUrl?: string              // Ảnh thẻ
  diplomaUrl?: string            // Bằng tốt nghiệp ĐH
  transcriptUrl?: string         // Bảng điểm ĐH
  idCardUrl?: string             // CCCD scan
  cvUrl?: string                 // CV / Lý lịch khoa học
  foreignLanguageCertUrl?: string // Bằng/Chứng chỉ ngoại ngữ
  otherFiles: string[]

  // V. REVIEW
  status: ApplicationStatus
  notes?: string
  reviewedBy?: mongoose.Types.ObjectId
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ApplicantSchema = new Schema<IApplicant>(
  {
    roundId: { type: Schema.Types.ObjectId, ref: 'AdmissionRound', required: true },
    programId: { type: String, required: true },

    // I. Thông tin cá nhân
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    birthPlace: { type: String, default: '' },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
    ethnicity: { type: String, default: 'Kinh' },
    nationality: { type: String, default: 'Việt Nam' },
    idCard: { type: String, required: true },
    idCardDate: { type: Date },
    idCardPlace: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String },
    ward: { type: String },
    occupation: { type: String },
    workplace: { type: String },
    position: { type: String },

    // II. Quá trình đào tạo
    degreeSchool: { type: String, required: true },
    degreeCountry: { type: String, default: 'Việt Nam' },
    degreeSystem: { type: String },
    degreeMajor: { type: String, required: true },
    degreeSpecialization: { type: String },
    degreeYear: { type: Number, required: true },
    degreeClassification: { type: String },
    degreeGpa: { type: Number },
    isAlumni: { type: Boolean, default: false },

    // III. Dự tuyển
    entranceExamSubject: { type: String },
    orientation: { type: String },
    supplementaryKnowledge: { type: Boolean, default: false },

    // IV. File hồ sơ
    photoUrl: { type: String },
    diplomaUrl: { type: String },
    transcriptUrl: { type: String },
    idCardUrl: { type: String },
    cvUrl: { type: String },
    foreignLanguageCertUrl: { type: String },
    otherFiles: [{ type: String }],

    // V. Review
    status: { type: String, enum: ['PENDING', 'QUALIFIED', 'ADMITTED', 'NOT_QUALIFIED', 'REJECTED'], default: 'PENDING' },
    notes: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
)

ApplicantSchema.index({ roundId: 1, programId: 1, idCard: 1 }, { unique: true })

export default mongoose.models.Applicant || mongoose.model<IApplicant>('Applicant', ApplicantSchema)
