import mongoose, { Document, Schema } from 'mongoose';

export interface IBookingLink extends Document {
  userId: mongoose.Types.ObjectId;
  linkId: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingLinkSchema = new Schema<IBookingLink>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    linkId: {
      type: String,
      required: [true, 'Link ID is required'],
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
bookingLinkSchema.index({ userId: 1 });
bookingLinkSchema.index({ linkId: 1, isActive: 1 });

export default mongoose.model<IBookingLink>('BookingLink', bookingLinkSchema);
