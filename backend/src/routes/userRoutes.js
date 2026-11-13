import { Router } from 'express';
import { listUsers, createUser } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.use(protect, adminOnly);
router.get('/', listUsers);
router.post('/', createUser);
export default router;