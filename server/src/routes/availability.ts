import express, { Request, Response } from 'express';
import AvailabilitySlot from '../models/AvailabilitySlot';
import { auth } from '../middleware/auth';
import {
  availabilityValidation,
  validateTimeRange,
  validateDate,
} from '../utils/validation';

const router = express.Router();

// Create availability slot
router.post(
  '/',
  auth,
  availabilityValidation,
  async (req: Request | any, res: Response) => {
    try {
      const { date, startTime, endTime } = req.body;
      const userId = req.user._id;

      // Additional validation
      if (!validateDate(new Date(date))) {
        return res
          .status(400)
          .json({ message: 'Date must be today or in the future' });
      }

      if (!validateTimeRange(startTime, endTime)) {
        return res
          .status(400)
          .json({ message: 'End time must be after start time' });
      }

      // Check for overlapping slots on the same date
      const existingSlot = await AvailabilitySlot.findOne({
        userId,
        date: new Date(date),
        isActive: true,
        $or: [
          {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
          },
        ],
      });

      if (existingSlot) {
        return res.status(400).json({
          message: 'Time slot overlaps with existing availability',
        });
      }

      // Create new availability slot
      const availabilitySlot = new AvailabilitySlot({
        userId,
        date: new Date(date),
        startTime,
        endTime,
      });

      await availabilitySlot.save();

      res.status(201).json({
        message: 'Availability slot created successfully',
        slot: availabilitySlot,
      });
    } catch (error) {
      console.error('Create availability error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's availability slots
router.get('/', auth, async (req: Request | any, res: Response) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;

    let query: any = { userId, isActive: true };

    if (date) {
      query.date = new Date(date as string);
    }

    const slots = await AvailabilitySlot.find(query).sort({
      date: 1,
      startTime: 1,
    });

    res.json({ slots });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update availability slot
router.put(
  '/:id',
  auth,
  availabilityValidation,
  async (req: Request | any, res: Response) => {
    try {
      const { id } = req.params;
      const { date, startTime, endTime } = req.body;
      const userId = req.user._id;

      // Find and validate ownership
      const slot = await AvailabilitySlot.findOne({ _id: id, userId });
      if (!slot) {
        return res.status(404).json({ message: 'Availability slot not found' });
      }

      // Additional validation
      if (!validateDate(new Date(date))) {
        return res
          .status(400)
          .json({ message: 'Date must be today or in the future' });
      }

      if (!validateTimeRange(startTime, endTime)) {
        return res
          .status(400)
          .json({ message: 'End time must be after start time' });
      }

      // Check for overlapping slots (excluding current slot)
      const existingSlot = await AvailabilitySlot.findOne({
        userId,
        _id: { $ne: id },
        date: new Date(date),
        isActive: true,
        $or: [
          {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
          },
        ],
      });

      if (existingSlot) {
        return res.status(400).json({
          message: 'Time slot overlaps with existing availability',
        });
      }

      // Update slot
      slot.date = new Date(date);
      slot.startTime = startTime;
      slot.endTime = endTime;

      await slot.save();

      res.json({
        message: 'Availability slot updated successfully',
        slot,
      });
    } catch (error) {
      console.error('Update availability error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete availability slot
router.delete('/:id', auth, async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const slot = await AvailabilitySlot.findOneAndDelete({ _id: id, userId });

    if (!slot) {
      return res.status(404).json({ message: 'Availability slot not found' });
    }

    res.json({ message: 'Availability slot deleted successfully' });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
