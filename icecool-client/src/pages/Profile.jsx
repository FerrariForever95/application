import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || {}
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      address: {
        ...(prev.address || {}),
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, this would be an API call to update user
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update context
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address
      };

      updateUser(updatedUser);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setLoading(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <h2>Profile</h2>
          <p>Please <Link to="/login">log in</Link> to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-container">Saving changes...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h2>
          <Link to="/" className="btn-outline">
            Back to Home
          </Link>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {/* Avatar would go here */}
              <div className="avatar-placeholder">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="profile-info">
              <h2>{user.name || 'User'}</h2>
              <p>{user.role === 'user' ? 'Customer' : user.role === 'shop_owner' ? 'Shop Owner' : user.role}</p>
            </div>
          </div>

          {!editing ? (
            <div className="profile-details">
              <div className="detail-group">
                <h3>Personal Information</h3>
                <div className="detail-item">
                  <FaUser />
                  <div>
                    <p>Name</p>
                    <p>{user.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <FaEnvelope />
                  <div>
                    <p>Email</p>
                    <p>{user.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <FaPhone />
                  <div>
                    <p>Phone Number</p>
                    <p>{user.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="detail-group">
                <h3>Address</h3>
                {user.address ? (
                  <>
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <div>
                        <p>Street</p>
                        <p>{user.address.street || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <div>
                        <p>City</p>
                        <p>{user.address.city || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <div>
                        <p>State</p>
                        <p>{user.address.state || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <div>
                        <p>Postal Code</p>
                        <p>{user.address.postalCode || 'Not provided'}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>No address provided</p>
                )}
              </div>

              <div className="profile-actions">
                <button
                  onClick={() => setEditing(true)}
                  className="btn-outline"
                >
                  Edit Profile
                </button>
                <Link to="/orders" className="btn-outline">
                  View Order History
                </Link>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave}>
              <div className="detail-group">
                <h3>Personal Information</h3>
                <div className="detail-item">
                  <FaUser />
                  <div>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="detail-item">
                  <FaEnvelope />
                  <div>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="detail-item">
                  <FaPhone />
                  <div>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber || ''}
                      onChange={handleChange}
                      required
                    />
                    <small>This is used for login and cannot be changed</small>
                  </div>
                </div>
              </div>

              <div className="detail-group">
                <h3>Address</h3>
                <div className="detail-item">
                  <FaMapMarkerAlt />
                  <div>
                    <label htmlFor="street">Street</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={profileData.address?.street || ''}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                <div className="detail-item">
                  <FaMapMarkerAlt />
                  <div>
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profileData.address?.city || ''}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                <div className="detail-item">
                  <FaMapMarkerAlt />
                  <div>
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={profileData.address?.state || ''}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                <div className="detail-item">
                  <FaMapMarkerAlt />
                  <div>
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={profileData.address?.postalCode || ''}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default Profile;