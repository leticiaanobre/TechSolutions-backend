import express from 'express';
import * as employeeController from '../controllers/employeeController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/tasks', auth, employeeController.getAssignedTasks);
router.put('/tasks/status', auth, employeeController.updateTaskStatus);

export default router;
