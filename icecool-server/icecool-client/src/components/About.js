import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About IceCool</h1>
      </header>
      
      <section className="about-content">
        <div className="ceo-info">
          <h2>Our Leadership</h2>
          <div className="ceo-details">
            <p><strong>Name:</strong> M. Harini</p>
            <p><strong>Title:</strong> Chief Executive Officer (CEO)</p>
            <p><strong>Email:</strong> <a href="mailto:harinimanghu@gmail.com">harinimanghu@gmail.com</a></p>
            <p><strong>Message from the CEO:</strong></p>
            <p className="ceo-message">
              "Harini is the CEO right now, we are developing all things"
            </p>
          </div>
        </div>
        
        <div className="map-section">
          <h2>Our Reach</h2>
          <div id="map" style={{ height: '400px', width: '100%', border: '1px solid #ccc' }}>
            {/* OpenStreetMap would go here - for now showing placeholder */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              Map showing our service areas (Powered by OpenStreetMap)
            </div>
          </div>
          <p className="map-caption">
            We serve customers across multiple locations - find ice cream shops near you
          </p>
        </div>
        
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            At IceCool, we're passionate about bringing the finest ice creams and desserts 
            right to your doorstep. We partner with local shops to offer exclusive, 
            customizable treats available 24/7 through our seamless delivery platform.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
