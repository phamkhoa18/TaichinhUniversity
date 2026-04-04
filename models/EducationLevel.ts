import mongoose, { Schema, Document } from 'mongoose';

export interface IEducationLevel extends Document {
  name: string;
  slug: string;
  description?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EducationLevelSchema = new Schema<IEducationLevel>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EducationLevel = mongoose.models.EducationLevel || mongoose.model<IEducationLevel>('EducationLevel', EducationLevelSchema);
export default EducationLevel;
