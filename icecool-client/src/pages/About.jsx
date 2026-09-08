import React from 'react';
import { FaUser, FaMapMarkedAlt, FaEnvelope } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About IceCool</h1>
          <p>Bringing joy to your doorstep, one scoop at a time</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              IceCool was founded with a simple mission: to make premium ice cream and customizable ice cream
              and desserts accessible to everyone, 24/7. We connect ice cream lovers with their
              favorite local shops through a seamless mobile-first platform.
            </p>
            <p>
              Whether you're craving a classic Magnum with chocolate chips or want to create your
              own unique dessert masterpiece, IceCool makes it easy to discover, customize, and
              order from nearby shops with real-time tracking and reliable delivery.
            </p>
          </div>
          <div className="about-image">
            <img src="https://via.placeholder.com/600x400?text=Ice+Cool+Illustration" alt="IceCool illustration" />
          </div>
        </div>
      </section>

      <section className="leadership">
        <div className="container">
          <h2>Leadership</h2>
          <div className="leader-card">
            <div className="leader-info">
              <div className="leader-icon">
                <FaUser />
              </div>
              <div>
                <h3>M. Harini</h3>
                <p>Chief Executive Officer</p>
              </div>
            </div>
            <div className="leader-message">
              <p>
                "Harini is the CEO right now, we are developing all things"
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div>
                <h4>Email</h4>
                <p>harinimanghu@gmail.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <FaMapMarkedAlt />
              </div>
              <div>
                <h4>Headquarters</h4>
                <p>IceCool Headquarters</p>
                <p>Available upon request</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mission">
        <div className="container">
          <h2>Our Mission</h2>
          <p>
            To revolutionize the ice cream and dessert delivery experience by providing a
            user-friendly platform that connects customers with local shops, offers extensive
            customization options, and ensures timely delivery of high-quality treats.
          </p>
        </div>
      </section>

      <section className="map">
        <div className="container">
          <h2>Our Service Area</h2>
          <div className="map-placeholder">
            {/* In a real app, this would be an actual map */}
            <div className="map-content">
              <p>OpenStreetMap would be displayed here showing our service areas</p>
              <p>Currently serving major cities across India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;