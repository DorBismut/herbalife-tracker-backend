import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import Sale from '../models/Sale';
import Purchase from '../models/Purchase';
import Expense from '../models/Expense';
import MentorshipClient from '../models/MentorshipClient';
import InventoryLot from '../models/InventoryLot';

const router = Router();

router.use(authenticate);

router.get('/dashboard', async (req, res, next) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    // Today's metrics (simplified for MVP)
    const [todaySales, todayPurchases, todayExpenses, todayMentorship] = await Promise.all([
      Sale.aggregate([
        { $match: { date: { $gte: startOfDay } } },
        { $unwind: '$items' },
        { $group: { 
          _id: null, 
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } },
          count: { $sum: 1 }
        }}
      ]),
      Purchase.aggregate([
        { $match: { date: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$totalPurchaseCost' } } }
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      MentorshipClient.aggregate([
        { $match: { startDate: { $gte: startOfDay }, status: 'active' } },
        { $group: { _id: null, revenue: { $sum: '$amountPaid' } } }
      ])
    ]);
    
    // Month to date metrics (simplified for MVP)
    const [mtdSales, mtdPurchases, mtdExpenses, mtdMentorship] = await Promise.all([
      Sale.aggregate([
        { $match: { date: { $gte: startOfMonth } } },
        { $unwind: '$items' },
        { $group: { 
          _id: null, 
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } },
          count: { $sum: 1 }
        }}
      ]),
      Purchase.aggregate([
        { $match: { date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalPurchaseCost' } } }
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      MentorshipClient.aggregate([
        { $match: { startDate: { $gte: startOfMonth } } },
        { $group: { _id: null, revenue: { $sum: '$amountPaid' } } }
      ])
    ]);
    
    // Simplified inventory calculation (MVP)
    const totalPurchases = await Purchase.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPurchaseCost' } } }
    ]);
    
    res.json({
      today: {
        revenue: todaySales[0]?.revenue || 0,
        profit: (todaySales[0]?.revenue || 0) - (todayPurchases[0]?.total || 0),
        purchases: todayPurchases[0]?.total || 0,
        expenses: todayExpenses[0]?.total || 0,
        mentorship: todayMentorship[0]?.revenue || 0
      },
      mtd: {
        revenue: mtdSales[0]?.revenue || 0,
        profit: (mtdSales[0]?.revenue || 0) - (mtdPurchases[0]?.total || 0),
        cogs: mtdPurchases[0]?.total || 0,
        purchases: mtdPurchases[0]?.total || 0,
        expenses: mtdExpenses[0]?.total || 0,
        mentorship: mtdMentorship[0]?.revenue || 0
      },
      inventory: {
        value: totalPurchases[0]?.total || 0,
        units: 0
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/monthly-pnl', async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);
    
    const [sales, purchases, expenses, mentorship] = await Promise.all([
      Sale.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: {
          _id: null,
          revenue: { $sum: '$grossRevenue' },
          cogs: { $sum: '$cogs' },
          grossProfit: { $sum: '$grossProfit' },
          netProfit: { $sum: '$netProfit' }
        }}
      ]),
      Purchase.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$totalPurchaseCost' } } }
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } }
      ]),
      MentorshipClient.aggregate([
        { $match: { startDate: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, revenue: { $sum: '$amountPaid' } } }
      ])
    ]);
    
    res.json({
      period: { year: Number(year), month: Number(month) },
      revenue: {
        sales: sales[0]?.revenue || 0,
        mentorship: mentorship[0]?.revenue || 0,
        total: (sales[0]?.revenue || 0) + (mentorship[0]?.revenue || 0)
      },
      cogs: sales[0]?.cogs || 0,
      grossProfit: sales[0]?.grossProfit || 0,
      expenses: expenses.reduce((acc, cat) => ({ ...acc, [cat._id]: cat.total }), {}),
      totalExpenses: expenses.reduce((sum, cat) => sum + cat.total, 0),
      netProfit: sales[0]?.netProfit || 0
    });
  } catch (error) {
    next(error);
  }
});

export default router;