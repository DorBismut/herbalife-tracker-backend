import mongoose, { Schema, Document } from 'mongoose';

interface IPurchaseItem {
  productId: mongoose.Types.ObjectId;
  qty: number;
  unitListPrice: number;
  discountPct: number;
  unitCostAfterDiscount: number;
  lineTotal: number;
}

export interface IPurchase extends Document {
  date: Date;
  supplier: string;
  currency: string;
  items: IPurchaseItem[];
  shipping: number;
  otherFees: number;
  paymentMethod: string;
  isSelfUse: boolean;
  subtotal: number;
  totalPurchaseCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseItemSchema = new Schema<IPurchaseItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true },
  unitListPrice: { type: Number, required: true },
  discountPct: { type: Number, default: 0 },
  unitCostAfterDiscount: { type: Number, required: true },
  lineTotal: { type: Number, required: true }
});

const PurchaseSchema = new Schema<IPurchase>({
  date: { type: Date, required: true, default: Date.now },
  supplier: { type: String, default: 'Herbalife Distributor' },
  currency: { type: String, default: 'ILS' },
  items: [PurchaseItemSchema],
  shipping: { type: Number, default: 0 },
  otherFees: { type: Number, default: 0 },
  paymentMethod: { type: String, required: true },
  isSelfUse: { type: Boolean, default: false },
  subtotal: { type: Number, required: true },
  totalPurchaseCost: { type: Number, required: true }
}, {
  timestamps: true
});

PurchaseSchema.index({ date: -1 });
PurchaseSchema.index({ isSelfUse: 1 });

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);