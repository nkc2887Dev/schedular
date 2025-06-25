import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import BookingLink from '../models/BookingLink';

export const generateLink = async (req: Request | any, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;

    // Generate unique link ID
    const linkId = uuidv4();

    // Create booking link
    const bookingLink = new BookingLink({
      userId,
      linkId,
      title: title || 'My Booking Link',
      description,
    });

    await bookingLink.save();

    res.status(201).json({
      message: 'Booking link created successfully',
      bookingLink: {
        ...bookingLink.toObject(),
        fullUrl: `${req.protocol}://${req.get('host')}/book/${linkId}`,
      },
    });
  } catch (error) {
    console.error('Create booking link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserLinks = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user._id;

    const bookingLinks = await BookingLink.find({
      userId,
      isActive: true,
    }).sort({ createdAt: -1 });

    // Add full URLs to each booking link
    const linksWithUrls = bookingLinks.map(link => ({
      ...link.toObject(),
      fullUrl: `${req.protocol}://${req.get('host')}/book/${link.linkId}`,
    }));

    res.json({ bookingLinks: linksWithUrls });
  } catch (error) {
    console.error('Get booking links error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const geLink = async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params;

    const bookingLink = await BookingLink.findOne({
      linkId,
      isActive: true,
    }).populate('userId', 'name email');

    if (!bookingLink) {
      return res.status(404).json({ message: 'Booking link not found' });
    }

    res.json({
      bookingLink: {
        ...bookingLink.toObject(),
        fullUrl: `${req.protocol}://${req.get('host')}/book/${linkId}`,
      },
    });
  } catch (error) {
    console.error('Get booking link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
