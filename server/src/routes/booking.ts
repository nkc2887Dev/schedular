import express from 'express';
import { auth } from '../middleware/auth';
import { bookingValidation } from '../utils/validation';
import {
  createBooking,
  getAvailabilitySlotForBooking,
  getBookings,
} from '../controllers/booking';

const router = express.Router();

// Create booking (public)
router.post('/', bookingValidation, createBooking);

// Get available time slots for a booking link (public)
router.get('/available/:linkId', getAvailabilitySlotForBooking);

// Get user's bookings (authenticated)
router.get('/my-bookings', auth, getBookings);

export default router;
