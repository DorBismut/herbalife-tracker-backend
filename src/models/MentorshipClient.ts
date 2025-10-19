import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorshipClient extends Document {
  fullName: string;
  igHandle?: string;
  phone: string;
  planId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  amountPaid: number;
  paymentMethod: string;
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipClientSchema = new Schema<IMentorshipClient>({
  fullName: { type: String, required: true },
  igHandle: { type: String },
  phone: { type: String, required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'MentorshipPlan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amountPaid: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled', 'paused'],
    default: 'active'
  },
  notes: { type: String }
}, {
  timestamps: true
});

MentorshipClientSchema.index({ status: 1 });
MentorshipClientSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model<IMentorshipClient>('MentorshipClient', MentorshipClientSchema);