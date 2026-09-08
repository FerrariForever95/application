// Utility functions for the frontend

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Get query parameters from URL
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const queryParam = {};
  for (const [key, value] of params) {
    queryParam[key] = value;
  }
  return queryParam;
};

// Validate phone number (Indian format)
export const validatePhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  } else if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return phone; // Return as is if format not recognized
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Generate random ID (for mock data)
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Convert price to paisa (for payment processing)
export const toPaisa = (rupees) => {
  return Math.round(rupees * 100);
};

// Convert paisa to rupees
export const toRupees = (paisa) => {
  return paisa / 100;
};