import express from 'express';
import { auth } from '../middleware/auth';
import { geLink, generateLink, getUserLinks } from '../controllers/bookingLink';

const router = express.Router();

// Generate booking link
router.post('/', auth, generateLink);

// Get user's booking links
router.get('/', auth, getUserLinks);

// Get booking link by ID (public)
router.get('/:linkId', geLink);

export default router;
