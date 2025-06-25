import express from 'express';
import { auth } from '../middleware/auth';
import { availabilityValidation } from '../utils/validation';
import {
  createAvailabilitySlot,
  deleteUserAvailabilitySlot,
  getUserAvailabilitySlot,
  updateUserAvailabilitySlot,
} from '../controllers/availability';

const router = express.Router();

// Create availability slot
router.post('/', auth, availabilityValidation, createAvailabilitySlot);

// Get user's availability slots
router.get('/', auth, getUserAvailabilitySlot);

// Update availability slot
router.put('/:id', auth, availabilityValidation, updateUserAvailabilitySlot);

// Delete availability slot
router.delete('/:id', auth, deleteUserAvailabilitySlot);

export default router;
