import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingPage.css';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface BookingLink {
  _id: string;
  title: string;
  description?: string;
  userId: {
    name: string;
    email: string;
  };
}

const BookingPage: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [bookingLink, setBookingLink] = useState<BookingLink | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [step, setStep] = useState<'date' | 'time' | 'details'>('date');

  useEffect(() => {
    if (linkId) {
      fetchBookingLink();
    }
  }, [linkId]);

  useEffect(() => {
    if (selectedDate && linkId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, linkId]);

  const fetchBookingLink = async () => {
    try {
      const response = await axios.get(`/booking-link/${linkId}`);
      setBookingLink(response.data.bookingLink);
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Booking link not found');
      } else {
        toast.error('Failed to load booking link');
      }
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !linkId) return;

    setLoading(true);
    try {
      const response = await axios.get(`/booking/available/${linkId}`, {
        params: {
          date: selectedDate.toISOString(),
        },
      });
      setAvailableSlots(response.data.availableSlots);
    } catch (error: any) {
      toast.error('Failed to fetch available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep('date');
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('time');
  };

  const handleContinueToDetails = () => {
    if (selectedSlot) {
      setStep('details');
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !visitorName || !visitorEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setBookingLoading(true);
    try {
      await axios.post('/booking', {
        linkId,
        visitorName,
        visitorEmail,
        date: selectedDate.toISOString(),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes,
      });

      toast.success('Booking confirmed successfully!');
      // Reset form
      setSelectedDate(null);
      setSelectedSlot(null);
      setVisitorName('');
      setVisitorEmail('');
      setNotes('');
      setStep('date');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to create booking';
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!bookingLink) {
    return (
      <div className='booking-page'>
        <div className='booking-container'>
          <div className='error-message'>
            <h1>Booking Link Not Found</h1>
            <p>
              The booking link you're looking for doesn't exist or has been
              deactivated.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='booking-page'>
      <div className='booking-container'>
        <div className='booking-header'>
          <h1>{bookingLink.title}</h1>
          {bookingLink.description && (
            <p className='booking-description'>{bookingLink.description}</p>
          )}
          <p className='booking-host'>Hosted by {bookingLink.userId.name}</p>
        </div>

        <div className='booking-steps'>
          <div className={`step ${step === 'date' ? 'active' : ''}`}>
            <h2>Select Date</h2>
            <div className='date-selection'>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateSelect}
                minDate={new Date()}
                placeholderText='Choose a date'
                className='date-picker'
              />
            </div>
          </div>

          {selectedDate && (
            <div className={`step ${step === 'time' ? 'active' : ''}`}>
              <h2>Select Time</h2>
              {loading ? (
                <div className='loading'>Loading available times...</div>
              ) : availableSlots.length === 0 ? (
                <div className='no-slots'>
                  <p>No available time slots for this date.</p>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className='back-button'
                  >
                    Choose a different date
                  </button>
                </div>
              ) : (
                <div className='time-slots'>
                  <div className='slots-grid'>
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotSelect(slot)}
                        className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                      >
                        {formatTime(slot.startTime)} -{' '}
                        {formatTime(slot.endTime)}
                      </button>
                    ))}
                  </div>
                  {selectedSlot && (
                    <button
                      onClick={handleContinueToDetails}
                      className='continue-button'
                    >
                      Continue
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedSlot && (
            <div className={`step ${step === 'details' ? 'active' : ''}`}>
              <h2>Your Details</h2>
              <div className='booking-summary'>
                <p>
                  <strong>Date:</strong> {selectedDate?.toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {formatTime(selectedSlot.startTime)} -{' '}
                  {formatTime(selectedSlot.endTime)}
                </p>
              </div>

              <div className='booking-form'>
                <div className='form-group'>
                  <label htmlFor='visitorName'>Name *</label>
                  <input
                    type='text'
                    id='visitorName'
                    value={visitorName}
                    onChange={e => setVisitorName(e.target.value)}
                    required
                    placeholder='Enter your name'
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='visitorEmail'>Email *</label>
                  <input
                    type='email'
                    id='visitorEmail'
                    value={visitorEmail}
                    onChange={e => setVisitorEmail(e.target.value)}
                    required
                    placeholder='Enter your email'
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='notes'>Notes (Optional)</label>
                  <textarea
                    id='notes'
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder='Any additional information...'
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading || !visitorName || !visitorEmail}
                  className='book-button'
                >
                  {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
