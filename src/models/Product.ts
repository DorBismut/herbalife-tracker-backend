import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  barcode?: string;
  description?: string;
  distributorPrice: number;
  retailPrice: number;
  suggestedPrice: number;
  volumePoints: number;
  minStock: number;
  currentStock: number;
  unit: string;
  weight: number;
  dimensions?: string;
  supplier?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  sku: { type: String, required: false, unique: true, sparse: true },
  category: { type: String, required: true },
  barcode: { type: String },
  description: { type: String },
  distributorPrice: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  suggestedPrice: { type: Number, default: 0 },
  volumePoints: { type: Number, default: 0 },
  minStock: { type: Number, default: 5 },
  currentStock: { type: Number, default: 0 },
  unit: { type: String, default: 'יחידה' },
  weight: { type: Number, default: 0 },
  dimensions: { type: String },
  supplier: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);