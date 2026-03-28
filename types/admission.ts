// ============================================================
// TYPES — Tuyển sinh & Hồ sơ ứng viên
// ============================================================

export type AdmissionLevel = 'THAC_SI' | 'TIEN_SI'
export type AdmissionStatus = 'OPEN' | 'CLOSED' | 'UPCOMING'

export type ApplicationStatus =
  | 'PENDING'       // Chờ xét duyệt
  | 'QUALIFIED'     // Đủ điều kiện dự thi
  | 'ADMITTED'      // Trúng tuyển
  | 'NOT_QUALIFIED' // Không đủ điều kiện
  | 'REJECTED'      // Từ chối

export interface AdmissionRound {
  id: string
  name: string               // VD: "Đợt 1 năm 2025"
  level: AdmissionLevel
  programIds: string[]       // Các chuyên ngành tuyển
  openDate: Date
  closeDate: Date
  examDate?: Date
  resultDate?: Date
  status: AdmissionStatus
  quota: number              // Chỉ tiêu
  applicantCount: number
  brochureUrl?: string       // File thông báo tuyển sinh
  syllabusUrl?: string       // File đề cương ôn thi
  createdAt: Date
  updatedAt: Date
}

export interface Applicant {
  id: string
  roundId: string
  programId: string
  // Thông tin cá nhân
  fullName: string
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  idCard: string             // CCCD/CMND
  phone: string
  email: string
  address: string
  province: string
  // Bằng cấp
  degreeSchool: string
  degreeMajor: string
  degreeYear: number
  degreeGpa?: number
  // Hồ sơ
  cvUrl?: string
  diplomaUrl?: string
  transcriptUrl?: string
  idCardUrl?: string
  photoUrl?: string
  otherFiles: string[]
  // Xét tuyển
  status: ApplicationStatus
  notes?: string             // Ghi chú nội bộ
  reviewedBy?: string        // UserId người duyệt
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}
