import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMobileAlt, FaUserPlus, FaCheckCircle } from 'react-icons/fa';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: enter info, 2: enter OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (step === 1) {
        // Step 1: Send OTP
        // In a real app, this would be an API call to /api/auth/register
        // For now, we'll simulate
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }

        if (!phoneNumber.trim()) {
          setError('Please enter your phone number');
          setLoading(false);
          return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, you'd check if user exists or create new one
        setStep(2);
        setLoading(false);
      } else if (step === 2) {
        // Step 2: Verify OTP
        // In a real app, this would be an API call to /api/auth/verify-otp
        // For now, we'll simulate
        if (!otp.trim() || otp.length !== 6) {
          setError('Please enter a valid 6-digit OTP');
          setLoading(false);
          return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate successful registration
        const userData = {
          id: '2',
          name: name,
          phoneNumber: phoneNumber,
          role: 'user',
          isVerified: true
        };

        login(userData);
        navigate('/');
        setLoading(false);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    // In a real app, this would be an API call to /api/auth/resend-otp
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess('OTP resent successfully!');
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-logo">
          <h2>IceCool</h2>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {step === 1 && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                />
                <small>We'll send a one-time password to this number</small>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="otp">One-Time Password</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
                <p className="otp-hint">
                  We sent an OTP to {phoneNumber}
                </p>
                <button
                  type="button"
                  onClick={resendOTP}
                  className="btn-link"
                  disabled={loading}
                >
                  {loading ? 'Resending...' : 'Resend OTP'}
                </button>
                {success && <p className="success-message">{success}</p>}
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Register'}
              </button>
            </>
          )}
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;