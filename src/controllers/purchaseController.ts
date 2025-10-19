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
  try {
    const purchaseData = req.body;
    
    // Calculate total purchase cost if not provided
    if (!purchaseData.totalPurchaseCost) {
      let itemsTotal = 0;
      for (const item of purchaseData.items) {
        itemsTotal += item.quantity * item.unitCost;
      }
      purchaseData.totalPurchaseCost = itemsTotal + (purchaseData.shippingCost || 0) + (purchaseData.otherCosts || 0);
    }
    
    const purchase = new Purchase(purchaseData);
    await purchase.save();
    
    // Simplified for MVP - no complex inventory or expense tracking
    res.status(201).json(purchase);
  } catch (error) {
    next(error);
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