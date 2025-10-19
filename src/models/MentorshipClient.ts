import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorshipClient extends Document {
  fullName: string;
  phone: string;
  email?: string;
  igHandle?: string;
  planId?: mongoose.Types.ObjectId;
  customPlanName?: string;
  duration: number;
  pricePerMonth: number;
  totalAmount: number;
  amountPaid: number;
  paymentMethod: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipClientSchema = new Schema<IMentorshipClient>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  igHandle: { type: String },
  planId: { type: Schema.Types.ObjectId, ref: 'MentorshipPlan' },
  customPlanName: { type: String },
  duration: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
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