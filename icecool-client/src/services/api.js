// API service for making requests to the backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiService = {
  // Auth endpoints
  register: (userData) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  }).then(res => res.json()),

  verifyOTP: (phoneNumber, otp) => fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phoneNumber, otp })
  }).then(res => res.json()),

  login: (phoneNumber) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phoneNumber })
  }).then(res => res.json()),

  getMe: (token) => fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json()),

  // Shop endpoints
  getShops: (params) => {
    const queryParams = new URLSearchParams(params);
    return fetch(`${API_BASE_URL}/shops?${queryParams}`).then(res => res.json());
  },

  getShopById: (id) => fetch(`${API_BASE_URL}/shops/${id}`).then(res => res.json()),

  createShop: (shopData, token) => fetch(`${API_BASE_URL}/shops`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(shopData)
  }).then(res => res.json()),

  // Product endpoints
  getProducts: (params) => {
    const queryParams = new URLSearchParams(params);
    return fetch(`${API_BASE_URL}/products?${queryParams}`).then(res => res.json());
  },

  getProductById: (id) => fetch(`${API_BASE_URL}/products/${id}`).then(res => res.json()),

  createProduct: (productData, token) => fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  }).then(res => res.json()),

  // Order endpoints
  createOrder: (orderData, token) => fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  }).then(res => res.json()),

  getUserOrders: (token, params) => {
    const queryParams = new URLSearchParams(params);
    return fetch(`${API_BASE_URL}/orders?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json());
  },

  getOrderById: (id, token) => fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json()),

  updateOrderStatus: (id, statusData, token) => fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(statusData)
  }).then(res => res.json())
};

export default apiService;