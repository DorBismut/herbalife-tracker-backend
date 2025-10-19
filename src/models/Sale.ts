import mongoose, { Schema, Document } from 'mongoose';

interface ISaleItem {
  productId: mongoose.Types.ObjectId;
  qty: number;
  unitSalePrice: number;
  discountPctVsList: number;
  cogsUnit: number;
  cogsLineTotal: number;
  lineRevenue: number;
}

export interface ISale extends Document {
  date: Date;
  channel: string;
  customerName: string;
  items: ISaleItem[];
  deliveryMethod: string;
  deliveryCostPaidByMe: number;
  deliveryFeeChargedToCustomer: number;
  paymentProcessorFee: number;
  grossRevenue: number;
  cogs: number;
  variableExpenses: number;
  grossProfit: number;
  netProfit: number;
  createdAt: Date;
  updatedAt: Date;
}

const SaleItemSchema = new Schema<ISaleItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true },
  unitSalePrice: { type: Number, required: true },
  discountPctVsList: { type: Number, default: 0 },
  cogsUnit: { type: Number, required: true },
  cogsLineTotal: { type: Number, required: true },
  lineRevenue: { type: Number, required: true }
});

const SaleSchema = new Schema<ISale>({
  date: { type: Date, required: true, default: Date.now },
  channel: { type: String, required: true },
  customerName: { type: String, required: true },
  items: [SaleItemSchema],
  deliveryMethod: { type: String, required: true },
  deliveryCostPaidByMe: { type: Number, default: 0 },
  deliveryFeeChargedToCustomer: { type: Number, default: 0 },
  paymentProcessorFee: { type: Number, default: 0 },
  grossRevenue: { type: Number, required: true },
  cogs: { type: Number, required: true },
  variableExpenses: { type: Number, required: true },
  grossProfit: { type: Number, required: true },
  netProfit: { type: Number, required: true }
}, {
  timestamps: true
});

SaleSchema.index({ date: -1 });
SaleSchema.index({ channel: 1 });
SaleSchema.index({ customerName: 1 });

export default mongoose.model<ISale>('Sale', SaleSchema);