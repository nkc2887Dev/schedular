import mongoose, { Document, Schema } from 'mongoose';

export interface IAvailabilitySlot extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const availabilitySlotSchema = new Schema<IAvailabilitySlot>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validate that end time is after start time
availabilitySlotSchema.pre('save', function (next) {
  if (this.startTime >= this.endTime) {
    return next(new Error('End time must be after start time'));
  }
  next();
});

// Index for efficient queries
availabilitySlotSchema.index({ userId: 1, date: 1 });
availabilitySlotSchema.index({ date: 1, isActive: 1 });

export default mongoose.model<IAvailabilitySlot>(
  'AvailabilitySlot',
  availabilitySlotSchema
);
