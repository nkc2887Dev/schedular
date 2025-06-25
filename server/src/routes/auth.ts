import express from 'express';
import { authValidation } from '../utils/validation';
import { createUser, getUser, loginUser } from '../controllers/auth';

const router = express.Router();

// Register user
router.post('/register', authValidation, createUser);

// Login user
router.post('/login', authValidation, loginUser);

// Get current user
router.get('/me', getUser);

export default router;
