import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPasswordForEmail } from '../utils/auth';
import './Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            await resetPasswordForEmail(email);
        } catch {
            // Swallow error — never reveal whether email exists
        } finally {
            setIsLoading(false);
            setSubmitted(true);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-form-container">
                    <div className="login-header">
                        <h1>Ascendly</h1>
                        <h2>Forgot Password</h2>
                        <p>Enter your email and we'll send you a reset link.</p>
                    </div>

                    {submitted ? (
                        <div style={{ marginTop: '16px' }}>
                            <span
                                className="success-message"
                                style={{ color: '#00FFEF', fontSize: '15px', lineHeight: '1.6', display: 'block' }}
                            >
                                If an account exists for this email, a reset link has been sent. Please check your inbox.
                            </span>
                            <div className="login-footer" style={{ marginTop: '32px' }}>
                                <Link to="/login" className="forgot-password-link">Back to Login</Link>
                            </div>
                        </div>
                    ) : (
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="fp-email">Email Address</label>
                                <input
                                    type="email"
                                    id="fp-email"
                                    className="form-input"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    disabled={isLoading}
                                />
                                {error && <span className="error-message">{error}</span>}
                            </div>

                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? 'Sending…' : 'Send Reset Link'}
                            </button>

                            <div className="login-footer">
                                Remembered your password? <Link to="/login">Log In</Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className="login-right"></div>
        </div>
    );
};

export default ForgotPassword;
