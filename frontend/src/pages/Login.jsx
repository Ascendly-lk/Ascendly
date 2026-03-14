import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Login.css';
import { login, getRoleDashboardRoute, signInWithGoogle, completeProfile } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useAuth();

    // Check if user just registered
    const [successMessage, setSuccessMessage] = useState(
        new URLSearchParams(location.search).get('registered')
            ? 'Your account was created successfully.'
            : ''
    );

    // If already logged in (e.g., from a mock session or valid token), redirect to dashboard
    useEffect(() => {
        if (user && user.onboarding_completed) {
            const route = getRoleDashboardRoute(user.role);
            navigate(route, { replace: true });
        }
    }, [user, navigate]);

// Form state
const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
});

// Password visibility state
const [showPassword, setShowPassword] = useState(false);

// Error state
const [errors, setErrors] = useState({});

// Loading & server error state
const [isLoading, setIsLoading] = useState(false);
const [isGoogleLoading, setIsGoogleLoading] = useState(false);
const [serverError, setServerError] = useState('');

// Handle input changes
const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors when user types
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
};

// Validate form
const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
        newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

// Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');

    try {
        const result = await login({
            email: formData.email,
            password: formData.password,
        });

        // Update auth context with logged-in user
        setUser({ ...result.user, onboarding_completed: true });
    } catch (err) {
        setServerError(err.message || 'Login failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
};

// Handle Google Login
const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setServerError('');

    try {
        await signInWithGoogle();
    } catch (err) {
        setServerError(err.message || 'Google login failed. Please try again.');
    } finally {
        setIsGoogleLoading(false);
    }
};

// Auto-redirect successfully registered or completely logged-in users
useEffect(() => {
    if (user && user.onboarding_completed) {
        const route = getRoleDashboardRoute(user.role);
        navigate(route, { replace: true });
    }
}, [user, navigate]);

// Complete Profile state & handler (For Google OAuth users missing roles)
const [profileData, setProfileData] = useState({ role: '' });

const handleCompleteProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.role) {
        setServerError('Please select a role to continue.');
        return;
    }
    setIsLoading(true);
    setServerError('');
    try {
        const result = await completeProfile({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            role: profileData.role
        });
        setUser(prev => ({ ...prev, role: result.role, onboarding_completed: true }));
    } catch (err) {
        setServerError(err.message || 'Failed to complete profile.');
    } finally {
        setIsLoading(false);
    }
};

// Eye icon SVG for password visibility toggle
const EyeIcon = ({ show }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
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

// If an authenticated user doesn't have a role yet, intercept them here
if (user && user.onboarding_completed === false) {
    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-form-container">
                    <div className="login-header">
                        <h1>Ascendly</h1>
                        <h2>Complete Profile</h2>
                        <p>Almost there! Please select your role to continue.</p>
                    </div>
                    <form className="login-form" onSubmit={handleCompleteProfileSubmit}>
                        <div className="form-group">
                            <label htmlFor="role">I am a...</label>
                            <select
                                id="role"
                                name="role"
                                className="form-input"
                                value={profileData.role}
                                onChange={(e) => setProfileData({ role: e.target.value })}
                                disabled={isLoading}
                                style={{ paddingRight: '40px', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L6 6.5L11 1.5\' stroke=\'%239CA3AF\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="Startup Founder">Startup Founder</option>
                                <option value="Investor">Investor</option>
                                <option value="Marketing Agency">Marketing Agency</option>
                                <option value="Patent Firm">Patent Firm</option>
                                <option value="Business Advisor">Business Advisor</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        {serverError && (
                            <span className="error-message" style={{ display: 'block', marginBottom: '8px' }}>
                                {serverError}
                            </span>
                        )}

                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Finish Setup'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="login-right"></div>
        </div>
    );
}

// Standard Login view
return (
    <div className="login-container">
        {/* Left Side - Login Form */}
        <div className="login-left">
            <div className="login-form-container">
                {/* Header */}
                <div className="login-header">
                    <h1>Ascendly</h1>
                    <h2>Welcome Back</h2>
                    <p>Login in to access your dashboard.</p>
                </div>

                {/* Login Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Email Address */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                <EyeIcon show={showPassword} />
                            </button>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="form-row-between">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-password-link">Forgot Password?</a>
                    </div>

                    {/* Server-side error message */}
                    {serverError && (
                        <span className="error-message" style={{ display: 'block', marginBottom: '8px' }}>
                            {serverError}
                        </span>
                    )}

                    {/* Success message */}
                    {successMessage && (
                        <span className="success-message" style={{ color: '#00FFEF', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                            {successMessage}
                        </span>
                    )}

                    {/* Login Button */}
                    <button type="submit" className="login-button" disabled={isLoading || isGoogleLoading}>
                        {isLoading ? 'Logging in…' : 'Log In'}
                    </button>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    {/* Google Auth Button */}
                    <button
                        type="button"
                        className="google-auth-button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading || isGoogleLoading}
                    >
                        {isGoogleLoading ? (
                            'Connecting...'
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>
            </div>
        </div>

        {/* Right Side - Gradient Background */}
        <div className="login-right"></div>
    </div>
);
};

export default Login;
