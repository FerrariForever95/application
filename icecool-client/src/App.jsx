import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import './App.css';

// Page components
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopList from './pages/ShopList';
import ShopDetail from './pages/ShopDetail';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import ShopDashboard from './pages/ShopDashboard';

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on load
  useEffect(() => {
    // In a real app, check for token in localStorage or cookies
    // For now, we'll simulate this
    const checkAuth = async () => {
      try {
        // Simulate auth check
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to check authentication status');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shops" element={<ShopList />} />
            <Route path="/shops/:id" element={<ShopDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Protected routes */}
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/profile" element={<Profile />} />

            {/* Shop owner routes */}
            <Route path="/shop/dashboard" element={<ShopDashboard />} />

            {/* Redirect to home for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;