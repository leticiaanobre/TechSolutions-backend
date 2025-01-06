import express from 'express';
import * as adminController from '../controllers/adminController.js';
import auth from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/users', auth, isAdmin, adminController.getUsers);
router.post('/tasks/assign', auth, isAdmin, adminController.assignTask);
router.post('/tasks/reject', auth, isAdmin, adminController.rejectTask);

export default router;
