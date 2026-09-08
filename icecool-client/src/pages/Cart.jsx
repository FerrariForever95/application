import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaTrashAlt, FaMapMarkerAlt, FaTruckLoading, FaCreditCard } from 'react-icons/fa';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({});

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 0; // In a real app, calculate based on distance
  const taxAmount = subtotal * 0.05; // 5% tax
  const totalAmount = subtotal + deliveryFee + taxAmount;

  useEffect(() => {
    // Load cart from localStorage (simulating)
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify([
      ...cartItems,
      ...(cartItems.find(item => item.id === product.id) ? [] : [{ ...product, quantity: 1 }])
    ]));
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (itemId, change) => {
    setCartItems(prev => {
      const newCart = prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity < 1 ? { ...item, quantity: 1 } : { ...item, quantity: newQuantity };
        }
        return item;
      });
      // Remove items with quantity < 1
      const filteredCart = newCart.filter(item => item.quantity >= 1);
      localStorage.setItem('cartItems', JSON.stringify(filteredCart));
      return filteredCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    setDeliveryAddress({});
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Validate address
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.postalCode) {
      setError('Please fill in your delivery address');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would be an API call to create order call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear cart after successful order
      clearCart();
      navigate('/orders');
      setLoading(false);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="cart-page">
        <div className="container">
          <h2>Your Cart</h2>
          <p>Please <Link to="/login">log in</Link> to view and manage your cart.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-container">Processing...</div>;
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <Link to="/" className="btn-outline">
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some delicious treats to get started!</p>
            <Link to="/shops" className="btn-primary">
              Explore Shops
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              <h2>Cart Items</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-price">₹{item.price}</div>
                    </div>
                  </div>
                  <div className="item-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="btn-control"
                    >
                      <FaMinus />
                    </button>
                    <span className="item-quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="btn-control"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn-control remove"
                      title="Remove item"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-form">
              <h2>Delivery Information</h2>
              <form onSubmit={handleCheckout}>
                <div className="form-group">
                  <label htmlFor="street">Street Address</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={deliveryAddress.street || ''}
                    onChange={handleAddressChange}
                    placeholder="Enter your street address"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={deliveryAddress.city || ''}
                      onChange={handleAddressChange}
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={deliveryAddress.state || ''}
                      onChange={handleAddressChange}
                      placeholder="Enter your state"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={deliveryAddress.postalCode || ''}
                    onChange={handleAddressChange}
                    placeholder="Enter your postal code"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="payment-options">
                    <label className="payment-option">
                      <input type="radio" name="paymentMethod" value="cod" checked />
                      <FaCreditCard /> Cash on Delivery
                    </label>
                    <label className="payment-option">
                      <input type="radio" name="paymentMethod" value="card" />
                      <FaCreditCard /> Card Payment
                    </label>
                    <label className="payment-option">
                      <input type="radio" name="paymentMethod" value="upi" />
                      <FaCreditCard /> UPI
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Placing Order...' : 'Proceed to Checkout'}
                </button>
              </form>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default Cart;