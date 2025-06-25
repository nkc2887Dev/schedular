import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import BookingLink from '../models/BookingLink';
import AvailabilitySlot from '../models/AvailabilitySlot';
import { auth } from '../middleware/auth';
import { bookingValidation } from '../utils/validation';

const router = express.Router();

// Create booking (public)
router.post('/', bookingValidation, async (req: Request, res: Response) => {
  try {
    const {
      linkId,
      visitorName,
      visitorEmail,
      date,
      startTime,
      endTime,
      notes,
    } = req.body;

    // Verify booking link exists and is active
    const bookingLink = await BookingLink.findOne({ linkId, isActive: true });
    if (!bookingLink) {
      return res.status(404).json({ message: 'Booking link not found' });
    }

    // Check if the requested time slot is available
    const availabilitySlot = await AvailabilitySlot.findOne({
      userId: bookingLink.userId,
      date: new Date(date),
      startTime: { $lte: startTime },
      endTime: { $gte: endTime },
      isActive: true,
    });

    if (!availabilitySlot) {
      return res
        .status(400)
        .json({ message: 'Requested time slot is not available' });
    }

    // Check if the time slot is already booked
    const existingBooking = await Booking.findOne({
      bookingLinkId: bookingLink._id,
      date: new Date(date),
      status: { $ne: 'cancelled' },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    // Create booking
    const booking = new Booking({
      bookingLinkId: bookingLink._id,
      visitorName,
      visitorEmail,
      date: new Date(date),
      startTime,
      endTime,
      notes,
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available time slots for a booking link (public)
router.get('/available/:linkId', async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    // Verify booking link exists and is active
    const bookingLink = await BookingLink.findOne({ linkId, isActive: true });
    if (!bookingLink) {
      return res.status(404).json({ message: 'Booking link not found' });
    }

    // Get availability slots for the specified date
    const availabilitySlots = await AvailabilitySlot.find({
      userId: bookingLink.userId,
      date: new Date(date as string),
      isActive: true,
    }).sort({ startTime: 1 });

    // Get existing bookings for the same date and booking link
    const existingBookings = await Booking.find({
      bookingLinkId: bookingLink._id,
      date: new Date(date as string),
      status: { $ne: 'cancelled' },
    });

    // Generate available time slots (30-minute intervals)
    const availableSlots = [];

    for (const slot of availabilitySlots) {
      const start = new Date(`2000-01-01T${slot.startTime}:00`);
      const end = new Date(`2000-01-01T${slot.endTime}:00`);

      // Generate 30-minute intervals
      let currentTime = new Date(start);
      while (currentTime < end) {
        const slotStart = currentTime.toTimeString().slice(0, 5);
        currentTime.setMinutes(currentTime.getMinutes() + 30);
        const slotEnd = currentTime.toTimeString().slice(0, 5);

        // Check if this 30-minute slot is available
        const isBooked = existingBookings.some(booking => {
          const bookingStart = new Date(`2000-01-01T${booking.startTime}:00`);
          const bookingEnd = new Date(`2000-01-01T${booking.endTime}:00`);
          const slotStartTime = new Date(`2000-01-01T${slotStart}:00`);
          const slotEndTime = new Date(`2000-01-01T${slotEnd}:00`);

          return bookingStart < slotEndTime && bookingEnd > slotStartTime;
        });

        if (!isBooked) {
          availableSlots.push({
            startTime: slotStart,
            endTime: slotEnd,
          });
        }
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings (authenticated)
router.get('/my-bookings', auth, async (req: Request | any, res: Response) => {
  try {
    const userId = req.user._id;

    // Get user's booking links
    const bookingLinks = await BookingLink.find({ userId, isActive: true });
    const bookingLinkIds = bookingLinks.map(link => link._id);

    // Get all bookings for user's booking links
    const bookings = await Booking.find({
      bookingLinkId: { $in: bookingLinkIds },
    })
      .populate('bookingLinkId', 'title linkId')
      .sort({ date: -1, startTime: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
