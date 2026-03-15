import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // In a real app, this would register with backend
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-right">
        {/* Gradient background */}
      </div>

      <div className="auth-left">
        <div className="auth-form-wrapper">
          <div className="auth-logo">Ascendly</div>
          <h1 className="auth-title">Welcome</h1>
          <p className="auth-subtitle">Register in to access your dashboard.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Role</label>
              <select
                name="role"
                className="input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="founder">Founder</option>
                <option value="investor">Investor</option>
                <option value="advisor">Business Advisor</option>
                <option value="team">Team Member</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="input"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="input"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span 
                  className="input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="input"
                  placeholder="Enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span 
                  className="input-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
              Register
            </button>
          </form>

          <div className="auth-link">
            Don't have an account? <Link to="/">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
