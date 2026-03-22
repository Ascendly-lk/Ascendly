import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updatePassword, supabase } from '../utils/auth';
import './Login.css';

const MIN_PASSWORD_LENGTH = 8;

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);

    // Supabase sends the user back with a fragment like #access_token=...&type=recovery
    // We listen for the PASSWORD_RECOVERY event which fires when the fragment is processed.
    useEffect(() => {
        if (!supabase) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setSessionReady(true);
            }
        });

        // Also check if a session already exists (e.g. user refreshed the page)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setSessionReady(true);
        });

        return () => subscription.unsubscribe();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < MIN_PASSWORD_LENGTH) {
            newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password.';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setServerError('');
        try {
            await updatePassword(password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setServerError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const EyeIcon = ({ show }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {show ? (
                <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </>
            ) : (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            )}
        </svg>
    );

    if (!sessionReady) {
        return (
            <div className="login-container">
                <div className="login-left">
                    <div className="login-form-container">
                        <div className="login-header">
                            <h1>Ascendly</h1>
                            <h2>Reset Password</h2>
                            <p style={{ color: '#94A3B8', marginTop: '12px' }}>
                                This link may have expired or is invalid.{' '}
                                <Link to="/forgot-password" className="forgot-password-link">Request a new one</Link>.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="login-right"></div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-form-container">
                    <div className="login-header">
                        <h1>Ascendly</h1>
                        <h2>Reset Password</h2>
                        <p>Enter and confirm your new password below.</p>
                    </div>

                    {success ? (
                        <div style={{ marginTop: '16px' }}>
                            <span style={{ color: '#00FFEF', fontSize: '15px', display: 'block', lineHeight: '1.6' }}>
                                Your password has been reset successfully. Redirecting to Login…
                            </span>
                        </div>
                    ) : (
                        <form className="login-form" onSubmit={handleSubmit}>
                            {/* New Password */}
                            <div className="form-group">
                                <label htmlFor="rp-password">New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="rp-password"
                                        className="form-input"
                                        placeholder="At least 8 characters"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label="Toggle password visibility"
                                    >
                                        <EyeIcon show={showPassword} />
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label htmlFor="rp-confirm">Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        id="rp-confirm"
                                        className="form-input"
                                        placeholder="Repeat your new password"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirm(v => !v)}
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        <EyeIcon show={showConfirm} />
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>

                            {serverError && (
                                <span className="error-message" style={{ display: 'block' }}>{serverError}</span>
                            )}

                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? 'Saving…' : 'Set New Password'}
                            </button>

                            <div className="login-footer">
                                <Link to="/login">Back to Login</Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className="login-right"></div>
        </div>
    );
};

export default ResetPassword;
