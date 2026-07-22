import mongoose, { Schema, Document } from 'mongoose';
import { DayOfWeek } from '../constants';

export interface IMasterSlot extends Document {
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  courseCode: string;
  venue: string;
  staffName: string;
  createdAt: Date;
  updatedAt: Date;
}

const MasterSlotSchema = new Schema<IMasterSlot>(
  {
    dayOfWeek: { type: String, enum: ['MON', 'TUE', 'WED', 'THU', 'FRI'], required: true },
    periodNumber: { type: Number, required: true, min: 1, max: 8 },
    courseCode: { type: String, required: true, trim: true },
    venue: { type: String, default: '', trim: true },
    staffName: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

MasterSlotSchema.index({ dayOfWeek: 1, periodNumber: 1 }, { unique: true });

export default mongoose.models.MasterSlot || mongoose.model<IMasterSlot>('MasterSlot', MasterSlotSchema);
