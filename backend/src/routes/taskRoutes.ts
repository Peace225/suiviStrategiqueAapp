import { Router } from 'express';
import { startTask, stopTask, validateTask } from '../controllers/taskController';

const router = Router();

// Routes opérationnelles
router.post('/start', startTask);
router.patch('/:id/stop', stopTask);
router.patch('/:id/validate', validateTask);

export default router;