import React from 'react';

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to IceCool</h1>
        <p>Your premium ice cream and dessert delivery platform</p>
      </header>
      
      <section className="features">
        <h2>Why Choose IceCool?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>🍦 Exclusive Ice Creams</h3>
            <p>Access to premium and customizable ice creams from local shops</p>
          </div>
          <div className="feature-item">
            <h3>⏰ 24/7 Availability</h3>
            <p>Order your favorite treats anytime, anywhere</p>
          </div>
          <div className="feature-item">
            <h3>🚚 Fast Delivery</h3>
            <p>Quick delivery right to your doorstep</p>
          </div>
          <div className="feature-item">
            <h3>🛒 Easy Customization</h3>
            <p>Create your perfect ice cream with toppings and sauces</p>
          </div>
        </div>
      </section>
      
      <section className="call-to-action">
        <h2>Ready to satisfy your sweet cravings?</h2>
        <p>
          Download our app or visit our website to start ordering today!
        </p>
      </section>
    </div>
  );
};

export default Home;
