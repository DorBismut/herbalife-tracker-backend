import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  unitCostList: number;
  defaultDiscountPct: number;
  barcode?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  unitCostList: { type: Number, required: true },
  defaultDiscountPct: { type: Number, default: 0 },
  barcode: { type: String },
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);