import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Purchase from '../models/Purchase';
import InventoryLot from '../models/InventoryLot';
import Expense from '../models/Expense';

export const getPurchases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { isSelfUse, startDate, endDate } = req.query;
    const filter: any = {};
    
    if (isSelfUse !== undefined) filter.isSelfUse = isSelfUse === 'true';
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    
    const purchases = await Purchase.find(filter)
      .populate('items.productId')
      .sort({ date: -1 });
    res.json(purchases);
  } catch (error) {
    next(error);
  }
};

export const getPurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('items.productId');
    if (!purchase) {
      res.status(404).json({ error: 'Purchase not found' });
      return;
    }
    res.json(purchase);
  } catch (error) {
    next(error);
  }
};

export const createPurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const purchaseData = req.body;
    
    // Calculate totals
    let subtotal = 0;
    for (const item of purchaseData.items) {
      item.unitCostAfterDiscount = item.unitListPrice * (1 - item.discountPct / 100);
      item.lineTotal = item.unitCostAfterDiscount * item.qty;
      subtotal += item.lineTotal;
    }
    
    purchaseData.subtotal = subtotal;
    purchaseData.totalPurchaseCost = subtotal + (purchaseData.shipping || 0) + (purchaseData.otherFees || 0);
    
    const purchase = new Purchase(purchaseData);
    await purchase.save({ session });
    
    if (purchaseData.isSelfUse) {
      // Create expense for self-use
      const expense = new Expense({
        date: purchase.date,
        category: 'Self-Use Products',
        description: `Self-use purchase #${purchase._id}`,
        amount: purchase.totalPurchaseCost,
        paymentMethod: purchase.paymentMethod,
        relatedPurchase: purchase._id
      });
      await expense.save({ session });
    } else {
      // Add to inventory
      for (const item of purchase.items) {
        const inventoryLot = new InventoryLot({
          productId: item.productId,
          qtyReceived: item.qty,
          purchaseId: purchase._id,
          unitCostAfterDiscount: item.unitCostAfterDiscount,
          qtyAvailable: item.qty,
          location: 'Main'
        });
        await inventoryLot.save({ session });
      }
    }
    
    await session.commitTransaction();
    res.status(201).json(purchase);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updatePurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Note: Updating purchases requires careful inventory management
    // This is a simplified version - in production, handle inventory adjustments
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!purchase) {
      res.status(404).json({ error: 'Purchase not found' });
      return;
    }
    res.json(purchase);
  } catch (error) {
    next(error);
  }
};

export const deletePurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Soft delete or handle inventory restoration
    res.status(501).json({ error: 'Purchase deletion not implemented - requires inventory management' });
  } catch (error) {
    next(error);
  }
};