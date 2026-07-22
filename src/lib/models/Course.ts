import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  code: string;
  title: string;
  staffName: string;
  type: 'free' | 'lab' | 'theory';
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    staffName: { type: String, default: '', trim: true },
    type: { type: String, enum: ['free', 'lab', 'theory'], default: 'theory' },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
