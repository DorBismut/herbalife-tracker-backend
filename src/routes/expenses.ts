import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import Expense from '../models/Expense';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { category, startDate, endDate } = req.query;
    const filter: any = {};
    
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    
    const expenses = await Expense.find(filter)
      .populate('relatedPurchase relatedSale')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('relatedPurchase relatedSale');
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json(expense);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json(expense);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;