import { Router } from 'express';
import { getGlobalReport, getMyDepartmentReport } from '../controllers/userController';
// import { isAdmin, isManager } from '../middleware/roleMiddleware';

const router = Router();

// Route pour la Direction Générale (Admin)
router.get('/global', getGlobalReport);

// Route pour les Chefs de département
router.get('/department', getMyDepartmentReport);

export default router;