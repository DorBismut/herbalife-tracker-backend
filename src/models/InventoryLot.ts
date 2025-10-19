import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryLot extends Document {
  productId: mongoose.Types.ObjectId;
  qtyReceived: number;
  purchaseId: mongoose.Types.ObjectId;
  expiryDate?: Date;
  unitCostAfterDiscount: number;
  qtyAvailable: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryLotSchema = new Schema<IInventoryLot>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qtyReceived: { type: Number, required: true },
  purchaseId: { type: Schema.Types.ObjectId, ref: 'Purchase', required: true },
  expiryDate: { type: Date },
  unitCostAfterDiscount: { type: Number, required: true },
  qtyAvailable: { type: Number, required: true },
  location: { type: String, default: 'Main' }
}, {
  timestamps: true
});

InventoryLotSchema.index({ productId: 1, expiryDate: 1 });
InventoryLotSchema.index({ qtyAvailable: 1 });

export default mongoose.model<IInventoryLot>('InventoryLot', InventoryLotSchema);