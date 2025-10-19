import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  date: Date;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  relatedPurchase?: mongoose.Types.ObjectId;
  relatedSale?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>({
  date: { type: Date, required: true, default: Date.now },
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  relatedPurchase: { type: Schema.Types.ObjectId, ref: 'Purchase' },
  relatedSale: { type: Schema.Types.ObjectId, ref: 'Sale' }
}, {
  timestamps: true
});

ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1 });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);