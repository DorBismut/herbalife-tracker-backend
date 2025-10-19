import mongoose, { Schema, Document } from 'mongoose';

interface IPurchaseItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitCost: number;
  expiryDate?: Date;
}

export interface IPurchase extends Document {
  date: Date;
  supplier: string;
  invoice?: string;
  paymentMethod: string;
  shippingCost: number;
  otherCosts: number;
  isSelfUse: boolean;
  notes?: string;
  items: IPurchaseItem[];
  totalPurchaseCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseItemSchema = new Schema<IPurchaseItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitCost: { type: Number, required: true },
  expiryDate: { type: Date }
});

const PurchaseSchema = new Schema<IPurchase>({
  date: { type: Date, required: true, default: Date.now },
  supplier: { type: String, default: 'Herbalife Distributor' },
  invoice: { type: String },
  paymentMethod: { type: String, required: true },
  shippingCost: { type: Number, default: 0 },
  otherCosts: { type: Number, default: 0 },
  isSelfUse: { type: Boolean, default: false },
  notes: { type: String },
  items: [PurchaseItemSchema],
  totalPurchaseCost: { type: Number, required: true }
}, {
  timestamps: true
});

PurchaseSchema.index({ date: -1 });
PurchaseSchema.index({ isSelfUse: 1 });

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);