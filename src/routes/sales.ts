import { Router } from 'express';
import { 
  getSales, 
  getSale, 
  createSale, 
  updateSale, 
  deleteSale 
} from '../controllers/saleController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getSales);
router.get('/:id', getSale);
router.post('/', createSale);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);

export default router;