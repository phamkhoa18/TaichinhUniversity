import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainingProgram extends Document {
  // Basic info
  name: string;
  slug: string;
  level: mongoose.Types.ObjectId; // Ref to EducationLevel
  type: string; // VD: Tiêu chuẩn, Nghiên cứu, Ứng dụng
  faculty: string; // Khoa phụ trách
  thumbnail?: string; // Ảnh nhỏ danh sách
  status: 'DRAFT' | 'PUBLISHED';

  // Hero Section
  heroBg?: string; // Ảnh cover lớn
  heroDescription?: string;

  // Overview 
  overviewDesc?: string;
  overviewImgMain?: string;
  overviewImgSub?: string;
  programCode?: string; // Mã ngành
  degreeIssued?: string; // Văn bằng tốt nghiệp
  duration?: string; // Thời gian đào tạo
  
  // ExtraRequirements (Môn bổ sung)
  extraRequirements: {
    title: string;
    items: string[];
  }[];

  // Features
  featuresBg?: string;
  featuresDesc?: string;
  featureCards: {
    title: string;
    desc: string;
  }[];

  // Outcomes
  outcomesDesc?: string;
  outcomesImage?: string;
  outcomeSkills: {
    title: string;
    desc: string;
  }[];

  // Careers
  careersDesc?: string;
  careerItems: {
    title: string;
    desc: string;
    image?: string;
  }[];

  // Curriculum
  curriculumDesc?: string;
  curriculumPdfUrl?: string;
  semesters: {
    name: string;
    subjectGroups: {
      name: string;
      subjects: {
        code: string;
        nameVi: string;
        nameEn: string;
        credits: number;
      }[];
    }[];
  }[];

  // Faculty Team
  instructors: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const ExtraRequirementSchema = new Schema({
  title: { type: String, default: '' },
  items: [{ type: String, default: '' }]
});

const FeatureCardSchema = new Schema({
  title: { type: String, default: '' },
  desc: { type: String, default: '' }
});

const OutcomeSkillSchema = new Schema({
  title: { type: String, default: '' },
  desc: { type: String, default: '' }
});

const CareerItemSchema = new Schema({
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  image: { type: String, default: '' }
});

const SubjectSchema = new Schema({
  code: { type: String, default: '' },
  nameVi: { type: String, default: '' },
  nameEn: { type: String, default: '' },
  credits: { type: Number, default: 0 }
});

const SubjectGroupSchema = new Schema({
  name: { type: String, default: '' },
  subjects: [SubjectSchema]
});

const SemesterSchema = new Schema({
  name: { type: String, default: '' },
  subjectGroups: [SubjectGroupSchema]
});

const TrainingProgramSchema = new Schema<ITrainingProgram>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    level: { type: Schema.Types.ObjectId, ref: 'EducationLevel', required: true },
    type: { type: String, default: 'Tiêu chuẩn' },
    faculty: { type: String, default: 'Viện Sau đại học' },
    thumbnail: { type: String, default: '' },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' },

    heroBg: { type: String, default: '' },
    heroDescription: { type: String, default: '' },

    overviewDesc: { type: String, default: '' },
    overviewImgMain: { type: String, default: '' },
    overviewImgSub: { type: String, default: '' },
    programCode: { type: String, default: '' },
    degreeIssued: { type: String, default: '' },
    duration: { type: String, default: '' },
    extraRequirements: [ExtraRequirementSchema],

    featuresBg: { type: String, default: '' },
    featuresDesc: { type: String, default: '' },
    featureCards: [FeatureCardSchema],

    outcomesDesc: { type: String, default: '' },
    outcomesImage: { type: String, default: '' },
    outcomeSkills: [OutcomeSkillSchema],

    careersDesc: { type: String, default: '' },
    careerItems: [CareerItemSchema],

    curriculumDesc: { type: String, default: '' },
    curriculumPdfUrl: { type: String, default: '' },
    semesters: [SemesterSchema],

    instructors: [{ type: Schema.Types.ObjectId, ref: 'Team' }] // Reference to existing team schema
  },
  { timestamps: true }
);

delete mongoose.models.TrainingProgram;
const TrainingProgram = mongoose.model<ITrainingProgram>('TrainingProgram', TrainingProgramSchema);

export default TrainingProgram;
