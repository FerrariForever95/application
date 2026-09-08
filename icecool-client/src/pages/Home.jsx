import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaIceCream, FaStore, FaTruckLoading, FaMobileAlt } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    // Simulate fetching shops
    const fetchShops = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        setShops([
          {
            id: 1,
            name: 'Cold Treats',
            description: 'Premium ice cream parlor',
            rating: 4.5,
            image: 'https://via.placeholder.com/300x200?text=Ice+Cream+Shop+1'
          },
          {
            id: 2,
            name: 'Sweet Scoops',
            description: 'Artisanal desserts & ice cream',
            rating: 4.8,
            image: 'https://via.placeholder.com/300x200?text=Ice+Cream+Shop+2'
          },
          {
            id: 3,
            name: 'Frozen Delights',
            description: 'Family-friendly ice cream shop',
            rating: 4.2,
            image: 'https://via.placeholder.com/300x200?text=Ice+Cream+Shop+3'
          }
        ]);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to IceCool</h1>
          <p>Your favorite ice cream and dessert delivery platform</p>
          <div className="hero-actions">
            <Link to="/shops" className="btn-primary">
              Explore Shops
            </Link>
            {!user && (
              <Link to="/login" className="btn-secondary">
                Login to Order
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose IceCool?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaIceCream />
              </div>
              <h3>Wide Selection</h3>
              <p>Hundreds of ice cream flavors and desserts from local shops</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaMobileAlt />
              </div>
              <h3>Easy Ordering</h3>
              <p>Login with your mobile number and order in seconds</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTruckLoading />
              </div>
              <h3>Fast Delivery</h3>
              <p>Get your treats delivered right to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaStore />
              </div>
              <h3>Support Local</h3>
              <p>We partner with local ice cream shops and dessert parlors</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-shops">
        <div className="container">
          <h2>Featured Shops</h2>
          <div className="shops-grid">
            {shops.map((shop) => (
              <div key={shop.id} className="shop-card">
                <img src={shop.image} alt={shop.name} />
                <div className="shop-info">
                  <h3>{shop.name}</h3>
                  <p>{shop.description}</p>
                  <div className="shop-rating">
                    {/* Star rating would go here */}
                    <span>{shop.rating}/5</span>
                  </div>
                  <Link to={`/shops/${shop.id}`} className="btn-outline">
                    View Shop
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready for your favorite treat?</h2>
          <p>Login with your mobile number and start exploring!</p>
          {!user && (
            <Link to="/login" className="btn-primary">
              Login / Register
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;