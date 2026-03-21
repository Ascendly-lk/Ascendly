import React, { useState } from 'react';
import './BookingModal.css';

const BookingModal = ({ advisor, onClose }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [sessionType, setSessionType] = useState('Strategy Call');
    const [notes, setNotes] = useState('');
    const [dateError, setDateError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    if (!advisor) return null;

    const timeSlots = [
        '09:00 AM',
        '10:30 AM',
        '02:00 PM',
        '04:00 PM',
    ];

    const sessionTypes = [
        'Strategy Call',
        'Mentorship Session',
        'Business Review',
        'Custom',
    ];

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            setIsSuccess(true);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bm-overlay" onClick={onClose}>
            <div className="bm-modal" onClick={(e) => e.stopPropagation()}>
                {isSuccess ? (
                    <div className="bm-success-state">
                        <div className="bm-success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h3 className="bm-success-title">Session Requested!</h3>
                        <p className="bm-success-text">
                            Your session request with <strong>{advisor.name}</strong> has been sent successfully.
                        </p>
                        <button className="bm-close-btn-primary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bm-header">
                            <div className="bm-header-info">
                                <h2 className="bm-title">Book Session</h2>
                                <p className="bm-subtitle">with {advisor.name}</p>
                            </div>
                            <button className="bm-close-icon" onClick={onClose} aria-label="Close modal">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="bm-body">
                            {/* Date Picker */}
                            <div className="bm-field">
                                <label className="bm-label">Select Date</label>
                                <input
                                    type="date"
                                    className="bm-date-input"
                                    min={today}
                                    value={selectedDate}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedDate(val);
                                        if (val && val < today) {
                                            setDateError('Selected date is outdated');
                                        } else {
                                            setDateError('');
                                        }
                                    }}
                                />
                                {dateError && <span className="bm-error-text">{dateError}</span>}
                            </div>

                            {/* Time Slots */}
                            <div className="bm-field">
                                <label className="bm-label">Available Time Slots</label>
                                <div className="bm-time-grid">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            className={`bm-time-slot ${selectedTime === slot ? 'active' : ''}`}
                                            onClick={() => setSelectedTime(slot)}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Session Type */}
                            <div className="bm-field">
                                <label className="bm-label">Session Type</label>
                                <select
                                    className="bm-select"
                                    value={sessionType}
                                    onChange={(e) => setSessionType(e.target.value)}
                                >
                                    {sessionTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Notes */}
                            <div className="bm-field">
                                <label className="bm-label">Notes</label>
                                <textarea
                                    className="bm-textarea"
                                    placeholder="Describe your goals or what you need help with..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bm-footer">
                            <button className="bm-cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                className="bm-confirm-btn"
                                onClick={handleConfirm}
                                disabled={!selectedDate || !selectedTime || !!dateError}
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
