import { Router } from 'express';
import authRoutes from './authRoutes.js';
import vlogRoutes from './vlogRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vlogs', vlogRoutes);

export default router;
