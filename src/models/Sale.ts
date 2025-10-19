import mongoose, { Schema, Document } from 'mongoose';

interface ISaleItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
}

export interface ISale extends Document {
  date: Date;
  customerName: string;
  customerPhone?: string;
  customerIG?: string;
  channel: string;
  paymentMethod: string;
  shippingCost: number;
  notes?: string;
  items: ISaleItem[];
  createdAt: Date;
  updatedAt: Date;
}

const SaleItemSchema = new Schema<ISaleItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 }
});

const SaleSchema = new Schema<ISale>({
  date: { type: Date, required: true, default: Date.now },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  customerIG: { type: String },
  channel: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  shippingCost: { type: Number, default: 0 },
  notes: { type: String },
  items: [SaleItemSchema]
}, {
  timestamps: true
});

SaleSchema.index({ date: -1 });
SaleSchema.index({ channel: 1 });
SaleSchema.index({ customerName: 1 });

export default mongoose.model<ISale>('Sale', SaleSchema);