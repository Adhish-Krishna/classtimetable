import mongoose, { Schema, Document } from 'mongoose';
import { DayOfWeek } from '../constants';

export type RecurrenceType = 'single_date' | 'single_week' | 'repeat_until_date';

export interface ISlotOverride extends Document {
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  recurrenceType: RecurrenceType;
  specificDate?: string;
  startDate?: string;
  endDate?: string;
  courseCode: string;
  venue: string;
  staffName: string;
  batchId?: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SlotOverrideSchema = new Schema<ISlotOverride>(
  {
    dayOfWeek: { type: String, enum: ['MON', 'TUE', 'WED', 'THU', 'FRI'], required: true },
    periodNumber: { type: Number, required: true, min: 1, max: 8 },
    recurrenceType: {
      type: String,
      enum: ['single_date', 'single_week', 'repeat_until_date'],
      required: true,
    },
    specificDate: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    courseCode: { type: String, required: true, trim: true },
    venue: { type: String, default: '', trim: true },
    staffName: { type: String, default: '', trim: true },
    batchId: { type: String, default: null },
    updatedBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.SlotOverride || mongoose.model<ISlotOverride>('SlotOverride', SlotOverrideSchema);
