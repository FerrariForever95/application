// Generate OTP function
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Send OTP function (placeholder - integrate with SMS service like Twilio, AWS SNS, etc.)
const sendOTP = async (phoneNumber, otp) => {
  // In a real application, you would integrate with an SMS service here
  console.log(`OTP for ${phoneNumber}: ${otp}`);
  // For development, we'll just log it
  return true;
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Format phone number
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Assuming Indian phone numbers (+91)
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  } else if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  return phoneNumber; // Return as is if format not recognized
};

// Validate Indian phone number
const validateIndianPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
};

module.exports = {
  generateOTP,
  sendOTP,
  calculateDistance,
  formatPhoneNumber,
  validateIndianPhoneNumber
};