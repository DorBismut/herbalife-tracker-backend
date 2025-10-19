import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Sale from '../models/Sale';
import { allocateInventoryFIFO, consumeInventory, restoreInventory } from '../utils/inventory';

export const getSales = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { channel, customerName, startDate, endDate } = req.query;
    const filter: any = {};
    
    if (channel) filter.channel = channel;
    if (customerName) filter.customerName = new RegExp(customerName as string, 'i');
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    
    const sales = await Sale.find(filter)
      .populate('items.productId')
      .sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    next(error);
  }
};

export const getSale = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('items.productId');
    if (!sale) {
      res.status(404).json({ error: 'Sale not found' });
      return;
    }
    res.json(sale);
  } catch (error) {
    next(error);
  }
};

export const createSale = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const saleData = req.body;
    let grossRevenue = 0;
    let totalCogs = 0;
    const allocations: any[] = [];
    
    // Process each item with FIFO
    for (const item of saleData.items) {
      const { allocations: itemAllocations, avgUnitCost } = await allocateInventoryFIFO(
        item.productId,
        item.qty
      );
      
      allocations.push(...itemAllocations);
      item.cogsUnit = avgUnitCost;
      item.cogsLineTotal = avgUnitCost * item.qty;
      item.lineRevenue = item.unitSalePrice * item.qty;
      
      grossRevenue += item.lineRevenue;
      totalCogs += item.cogsLineTotal;
    }
    
    // Add delivery fee to revenue if charged
    grossRevenue += saleData.deliveryFeeChargedToCustomer || 0;
    
    // Calculate expenses
    const variableExpenses = (saleData.deliveryCostPaidByMe || 0) + 
                            (saleData.paymentProcessorFee || 0);
    
    saleData.grossRevenue = grossRevenue;
    saleData.cogs = totalCogs;
    saleData.variableExpenses = variableExpenses;
    saleData.grossProfit = grossRevenue - totalCogs;
    saleData.netProfit = grossRevenue - totalCogs - variableExpenses;
    
    const sale = new Sale(saleData);
    await sale.save({ session });
    
    // Consume inventory
    await consumeInventory(allocations);
    
    await session.commitTransaction();
    res.status(201).json(sale);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateSale = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Note: Updating sales requires careful inventory management
    // This is a simplified version
    res.status(501).json({ error: 'Sale update not implemented - requires complex inventory management' });
  } catch (error) {
    next(error);
  }
};

export const deleteSale = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Would need to restore inventory
    res.status(501).json({ error: 'Sale deletion not implemented - requires inventory restoration' });
  } catch (error) {
    next(error);
  }
};