import mongoose, { Schema, Document } from 'mongoose';

export interface IAllowedRep extends Document {
  rollNo: string;
  isRegistered: boolean;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const AllowedRepSchema = new Schema<IAllowedRep>(
  {
    rollNo: { type: String, required: true, unique: true, uppercase: true, trim: true },
    isRegistered: { type: Boolean, default: false },
    addedBy: { type: String, default: 'ADMIN' },
  },
  { timestamps: true }
);

export default mongoose.models.AllowedRep || mongoose.model<IAllowedRep>('AllowedRep', AllowedRepSchema);
