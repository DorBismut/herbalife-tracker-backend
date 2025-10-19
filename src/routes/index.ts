import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import purchaseRoutes from './purchases';
import saleRoutes from './sales';
import mentorshipRoutes from './mentorship';
import expenseRoutes from './expenses';
import reportRoutes from './reports';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/sales', saleRoutes);
router.use('/mentorship', mentorshipRoutes);
router.use('/expenses', expenseRoutes);
router.use('/reports', reportRoutes);

router.get('/healthz', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

export default router;