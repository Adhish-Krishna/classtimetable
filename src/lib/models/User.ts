import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string; // Roll No for Reps, or 'admin'
  passwordHash: string;
  role: 'admin' | 'rep';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, uppercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'rep'], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
