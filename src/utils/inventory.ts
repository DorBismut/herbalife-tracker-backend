import InventoryLot from '../models/InventoryLot';
import mongoose from 'mongoose';

export interface FIFOAllocation {
  lotId: mongoose.Types.ObjectId;
  qty: number;
  unitCost: number;
}

export const allocateInventoryFIFO = async (
  productId: mongoose.Types.ObjectId | string,
  requiredQty: number
): Promise<{ allocations: FIFOAllocation[], totalCost: number, avgUnitCost: number }> => {
  const lots = await InventoryLot.find({
    productId,
    qtyAvailable: { $gt: 0 }
  }).sort({ createdAt: 1 });

  const allocations: FIFOAllocation[] = [];
  let remainingQty = requiredQty;
  let totalCost = 0;

  for (const lot of lots) {
    if (remainingQty <= 0) break;

    const allocatedQty = Math.min(lot.qtyAvailable, remainingQty);
    allocations.push({
      lotId: lot._id as mongoose.Types.ObjectId,
      qty: allocatedQty,
      unitCost: lot.unitCostAfterDiscount
    });

    totalCost += allocatedQty * lot.unitCostAfterDiscount;
    remainingQty -= allocatedQty;
  }

  if (remainingQty > 0) {
    throw new Error(`Insufficient inventory for product ${productId}. Required: ${requiredQty}, Available: ${requiredQty - remainingQty}`);
  }

  const avgUnitCost = totalCost / requiredQty;
  return { allocations, totalCost, avgUnitCost };
};

export const consumeInventory = async (allocations: FIFOAllocation[]): Promise<void> => {
  for (const allocation of allocations) {
    await InventoryLot.updateOne(
      { _id: allocation.lotId },
      { $inc: { qtyAvailable: -allocation.qty } }
    );
  }
};

export const restoreInventory = async (allocations: FIFOAllocation[]): Promise<void> => {
  for (const allocation of allocations) {
    await InventoryLot.updateOne(
      { _id: allocation.lotId },
      { $inc: { qtyAvailable: allocation.qty } }
    );
  }
};