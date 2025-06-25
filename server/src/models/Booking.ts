import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  bookingLinkId: mongoose.Types.ObjectId;
  visitorName: string;
  visitorEmail: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingLinkId: {
      type: Schema.Types.ObjectId,
      ref: 'BookingLink',
      required: [true, 'Booking link ID is required'],
    },
    visitorName: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
      maxlength: [100, 'Visitor name cannot exceed 100 characters'],
    },
    visitorEmail: {
      type: String,
      required: [true, 'Visitor email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      validate: {
        validator: function (value: Date) {
          return value >= new Date(new Date().setHours(0, 0, 0, 0));
        },
        message: 'Date must be today or in the future',
      },
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Start time must be in HH:MM format',
      ],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'End time must be in HH:MM format',
      ],
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Validate that end time is after start time
bookingSchema.pre('save', function (next) {
  if (this.startTime >= this.endTime) {
    return next(new Error('End time must be after start time'));
  }
  next();
});

// Index for efficient queries
bookingSchema.index({ bookingLinkId: 1, date: 1 });
bookingSchema.index({ date: 1, status: 1 });
bookingSchema.index({ visitorEmail: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
