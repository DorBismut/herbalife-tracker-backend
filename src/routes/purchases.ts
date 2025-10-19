import { Router } from 'express';
import { 
  getPurchases, 
  getPurchase, 
  createPurchase, 
  updatePurchase, 
  deletePurchase 
} from '../controllers/purchaseController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getPurchases);
router.get('/:id', getPurchase);
router.post('/', createPurchase);
router.put('/:id', updatePurchase);
router.delete('/:id', deletePurchase);

export default router;