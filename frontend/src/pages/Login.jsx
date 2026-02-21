import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

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

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
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
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Temporary: navigate to dashboard for any valid credentials
            navigate('/dashboard/startup');
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

                        {/* Login Button */}
                        <button type="submit" className="login-button">
                            Log In
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
