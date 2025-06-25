import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Dashboard.css';

interface AvailabilitySlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface BookingLink {
  _id: string;
  linkId: string;
  title: string;
  description?: string;
  fullUrl: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [availabilitySlots, setAvailabilitySlots] = useState<
    AvailabilitySlot[]
  >([]);
  const [bookingLinks, setBookingLinks] = useState<BookingLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [linkTitle, setLinkTitle] = useState('My Booking Link');
  const [linkDescription, setLinkDescription] = useState('');

  useEffect(() => {
    fetchAvailabilitySlots();
    fetchBookingLinks();
  }, []);

  const fetchAvailabilitySlots = async () => {
    try {
      const response = await axios.get('/availability');
      setAvailabilitySlots(response.data.slots);
    } catch (error) {
      console.error('Error fetching availability slots:', error);
    }
  };

  const fetchBookingLinks = async () => {
    try {
      const response = await axios.get('/booking-link');
      setBookingLinks(response.data.bookingLinks);
    } catch (error) {
      console.error('Error fetching booking links:', error);
    }
  };

  const handleAddAvailability = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/availability', {
        date: selectedDate.toISOString(),
        startTime,
        endTime,
      });

      setAvailabilitySlots(prev => [...prev, response.data.slot]);
      toast.success('Availability slot added successfully!');

      // Reset form
      setSelectedDate(null);
      setStartTime('09:00');
      setEndTime('17:00');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to add availability slot';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/booking-link', {
        title: linkTitle,
        description: linkDescription,
      });

      setBookingLinks(prev => [...prev, response.data.bookingLink]);
      toast.success('Booking link generated successfully!');

      // Reset form
      setLinkTitle('My Booking Link');
      setLinkDescription('');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to generate booking link';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <div className='header-content'>
          <h1>Welcome, {user?.name}!</h1>
          <button onClick={logout} className='logout-button'>
            Logout
          </button>
        </div>
      </header>

      <div className='dashboard-content'>
        <div className='dashboard-section'>
          <h2>Add Availability</h2>
          <div className='availability-form'>
            <div className='form-row'>
              <div className='form-group'>
                <label>Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  minDate={new Date()}
                  placeholderText='Select date'
                  className='date-picker'
                />
              </div>

              <div className='form-group'>
                <label>Start Time</label>
                <input
                  type='time'
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className='time-input'
                />
              </div>

              <div className='form-group'>
                <label>End Time</label>
                <input
                  type='time'
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className='time-input'
                />
              </div>
            </div>

            <button
              onClick={handleAddAvailability}
              disabled={loading || !selectedDate}
              className='add-button'
            >
              {loading ? 'Adding...' : 'Add Availability'}
            </button>
          </div>
        </div>

        <div className='dashboard-section'>
          <h2>Your Availability Slots</h2>
          <div className='slots-list'>
            {availabilitySlots.length === 0 ? (
              <p className='empty-state'>No availability slots added yet.</p>
            ) : (
              availabilitySlots.map(slot => (
                <div key={slot._id} className='slot-item'>
                  <span className='slot-date'>{formatDate(slot.date)}</span>
                  <span className='slot-time'>
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className='dashboard-section'>
          <h2>Generate Booking Link</h2>
          <div className='link-form'>
            <div className='form-group'>
              <label>Link Title</label>
              <input
                type='text'
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
                placeholder='Enter link title'
                className='text-input'
              />
            </div>

            <div className='form-group'>
              <label>Description (Optional)</label>
              <textarea
                value={linkDescription}
                onChange={e => setLinkDescription(e.target.value)}
                placeholder='Enter description'
                className='text-area'
                rows={3}
              />
            </div>

            <button
              onClick={handleGenerateLink}
              disabled={loading}
              className='generate-button'
            >
              {loading ? 'Generating...' : 'Generate Link'}
            </button>
          </div>
        </div>

        <div className='dashboard-section'>
          <h2>Your Booking Links</h2>
          <div className='links-list'>
            {bookingLinks.length === 0 ? (
              <p className='empty-state'>No booking links generated yet.</p>
            ) : (
              bookingLinks.map(link => (
                <div key={link._id} className='link-item'>
                  <div className='link-info'>
                    <h3>{link.title}</h3>
                    {link.description && <p>{link.description}</p>}
                    <div className='link-url'>
                      <span>{link.fullUrl}</span>
                      <button
                        onClick={() => copyToClipboard(link.fullUrl)}
                        className='copy-button'
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
