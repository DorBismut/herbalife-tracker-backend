import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorshipPlan extends Document {
  name: string;
  durationDays: number;
  price: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipPlanSchema = new Schema<IMentorshipPlan>({
  name: { type: String, required: true },
  durationDays: { type: Number, required: true },
  price: { type: Number, required: true },
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IMentorshipPlan>('MentorshipPlan', MentorshipPlanSchema);