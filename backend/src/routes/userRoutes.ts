import { Router } from 'express';
import { getUsers, updateUserProfile } from '../controllers/userController';
import { isAdmin } from '../middleware/roleMiddleware';
// Supposons que vous avez un middleware authenticateToken
// import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Seuls les admins connectés peuvent lister et modifier les comptes
router.get('/', isAdmin, getUsers);
router.patch('/:uid', isAdmin, updateUserProfile);

export default router;