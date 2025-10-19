import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import MentorshipPlan from '../models/MentorshipPlan';
import MentorshipClient from '../models/MentorshipClient';

const router = Router();

router.use(authenticate);

// Plans
router.get('/plans', async (req, res, next) => {
  try {
    const plans = await MentorshipPlan.find({ isActive: true }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    next(error);
  }
});

router.post('/plans', async (req, res, next) => {
  try {
    const plan = new MentorshipPlan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
});

// Clients
router.get('/clients', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    
    const clients = await MentorshipClient.find(filter)
      .populate('planId')
      .sort({ startDate: -1 });
    res.json(clients);
  } catch (error) {
    next(error);
  }
});

router.post('/clients', async (req, res, next) => {
  try {
    const client = new MentorshipClient(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
});

router.put('/clients/:id', async (req, res, next) => {
  try {
    const client = await MentorshipClient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
});

export default router;