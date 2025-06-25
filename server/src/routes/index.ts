import express from 'express';
const router = express.Router();
import authRoutes from './auth';
import availabilityRoutes from './availability';
import bookingRoutes from './booking';
import bookingLinkRoutes from './bookingLink';

// Routes
router.use('/auth', authRoutes);
router.use('/availability', availabilityRoutes);
router.use('/booking', bookingRoutes);
router.use('/booking-link', bookingLinkRoutes);

export default router;
