import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPortal.css';

const PaymentPortal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan = 'Pro', price = 25 } = location.state || {};

    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '');
        const matched = digits.match(/.{1,4}/g);
        return matched ? matched.join(' ').substring(0, 19) : digits;
    };

    const getCardType = (number) => {
        const digits = number.replace(/\D/g, '');
        if (digits.startsWith('4')) return 'Visa';
        if (/^(5[1-5]|2[2-7])/.test(digits)) return 'MasterCard';
        return '';
    };

    const formatExpiryDate = (value) => {
        let digits = value.replace(/\D/g, '');
        if (digits.length >= 2) {
            let month = parseInt(digits.substring(0, 2));
            if (month > 12) digits = '12' + digits.substring(2);
            if (month === 0) digits = '01' + digits.substring(2);
        }
        if (digits.length > 2) {
            return `${digits.substring(0, 2)}/${digits.substring(2, 6)}`;
        }
        return digits;
    };

    const formatCVV = (value) => {
        return value.replace(/\D/g, '').substring(0, 3);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') formattedValue = formatCardNumber(value);
        if (name === 'expiryDate') formattedValue = formatExpiryDate(value);
        if (name === 'cvv') formattedValue = formatCVV(value);

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Normalize card number for comparison (remove spaces)
        const normalizedCardNumber = formData.cardNumber.replace(/\s+/g, '');
        
        // Exact test case validation
        const isValidTest = 
            formData.cardholderName === 'Janathan' &&
            normalizedCardNumber === '4588681002583214' &&
            formData.expiryDate === '05/2028' &&
            formData.cvv === '455';

        if (!isValidTest) {
            setError('Invalid test payment details');
            return;
        }

        setIsProcessing(true);

        // Simulate network delay
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            
            // Redirect after showing success for a bit
            setTimeout(() => {
                navigate('/dashboard/startup');
            }, 3000);
        }, 1500);
    };

    return (
        <div className="pp-container">
            <div className="pp-card">
                <div className="pp-header">
                    <h1 className="pp-title">Payment Details</h1>
                    <p className="pp-subtitle">
                        You're subscribing to: <span className="pp-plan-highlight">{plan} - ${price}/month</span>
                    </p>
                </div>

                <form className="pp-form" onSubmit={handleSubmit}>
                    {error && <div className="pp-error-msg">{error}</div>}
                    
                    <div className="pp-field">
                        <label htmlFor="cardholderName">Cardholder Name</label>
                        <input
                            type="text"
                            id="cardholderName"
                            name="cardholderName"
                            placeholder="Janathan"
                            required
                            value={formData.cardholderName}
                            onChange={handleChange}
                            className="pp-input"
                        />
                    </div>

                    <div className="pp-field">
                        <div className="pp-label-row">
                            <label htmlFor="cardNumber">Card Number</label>
                            {getCardType(formData.cardNumber) && (
                                <span className="pp-card-type">{getCardType(formData.cardNumber)}</span>
                            )}
                        </div>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="4588 6810 0258 3214"
                            required
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className="pp-input"
                        />
                    </div>

                    <div className="pp-row">
                        <div className="pp-field">
                            <label htmlFor="expiryDate">Expiry Date (MM/YYYY)</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                placeholder="05/2028"
                                required
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="pp-input"
                            />
                        </div>
                        <div className="pp-field">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                placeholder="455"
                                required
                                value={formData.cvv}
                                onChange={handleChange}
                                className="pp-input"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="pp-pay-btn"
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                    </button>

                    <button 
                        type="button" 
                        className="pp-cancel-btn"
                        onClick={() => navigate(-1)}
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                </form>
            </div>

            {showSuccess && (
                <div className="pp-success-overlay">
                    <div className="pp-success-modal">
                        <div className="pp-success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 className="pp-success-title">Payment Successful!</h2>
                        <p className="pp-success-text">Your plan has been activated. Redirecting you to dashboard...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPortal;
