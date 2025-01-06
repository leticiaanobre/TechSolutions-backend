import express from 'express';
import { createTask, getTasks, getHourBank } from '../controllers/clientController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/tasks', auth, createTask);
router.get('/tasks', auth, getTasks);
router.get('/hour-bank', auth, getHourBank);

export default router;
