import React from 'use client';

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRegUser, FaShoppingCart, FaList, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" className="logo-link">
            IceCool
          </Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/shops" className="nav-link">
                Shops
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {/* Cart badge would go here */}
                  </Link>
                </li>
                <li className="nav-item">
                  {user.role === 'shop_owner' ? (
                    <Link to="/shop/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  ) : (
                    <Link to="/orders" className="nav-link">
                      Orders
                    </Link>
                  )}
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn-link">
                    Logout
                  </button>
                </li>
              </>
            )}
            {!user && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;