import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const validateTimeRange = (
  startTime: string,
  endTime: string
): boolean => {
  if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
    return false;
  }

  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);

  return start < end;
};

export const validateDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate >= today;
};

// Validation chains for common operations
export const availabilityValidation = [
  body('date').isISO8601().withMessage('Date must be a valid ISO date'),
  body('startTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  body('endTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  handleValidationErrors,
];

export const bookingValidation = [
  body('visitorName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      'Visitor name is required and must be less than 100 characters'
    ),
  body('visitorEmail').isEmail().withMessage('Valid email is required'),
  body('date').isISO8601().withMessage('Date must be a valid ISO date'),
  body('startTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  body('endTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  handleValidationErrors,
];

export const authValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
];
