import { Router } from 'express';
import { stats } from '../controllers/dashboardController.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.use(protect, adminOnly);
router.get('/stats', stats);
export default router;