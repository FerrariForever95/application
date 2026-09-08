import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaIceCream, FaUtensils, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar, FaShoppingCart } from 'react-icons/fa';

const ShopDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        // In a real app, this would be API calls to /api/shops/:id and /api/shops/:id/products
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock shop data
        const mockShop = {
          id: '1',
          name: 'Cold Treats',
          description: 'Premium ice cream parlor serving homemade ice creams and desserts since 2010',
          rating: 4.5,
          totalRatings: 128,
          image: 'https://via.placeholder.com/400x300?text=Cold+Treats+Shop',
          address: {
            street: '123 Ice Cream Ave',
            city: 'Mumbai',
            state: 'MH',
            postalCode: '400001'
          },
          contactInfo: {
            phone: '+91 98765 43210',
            email: 'contact@coldtreats.com'
          },
          operatingHours: {
            monday: { open: '10:00', close: '22:00', isClosed: false },
            tuesday: { open: '10:00', close: '22:00', isClosed: false },
            wednesday: { open: '10:00', close: '22:00', isClosed: false },
            thursday: { open: '10:00', close: '22:00', isClosed: false },
            friday: { open: '10:00', close: '22:00', isClosed: false },
            saturday: { open: '10:00', close: '23:00', isClosed: false },
            sunday: { open: '11:00', close: '22:00', isClosed: false }
          },
          isOpenNow: true
        };

        // Mock products
        const mockProducts = [
          {
            id: '1',
            name: 'Classic Magnum',
            description: 'Premium vanilla ice cream coated with thick chocolate',
            category: 'ice_cream',
            basePrice: 120,
            image: 'https://via.placeholder.com/200x200?text=Magnum',
            isAvailable: true,
            customizationOptions: [
              {
                name: 'Coating',
                type: 'radio',
                options: [
                  { label: 'Milk Chocolate', value: 'milk_chocolate', additionalPrice: 0, isDefault: true },
                  { label: 'Dark Chocolate', value: 'dark_chocolate', additionalPrice: 10 },
                  { label: 'White Chocolate', value: 'white_chocolate', additionalPrice: 15 }
                ],
                isRequired: true
              },
              {
                name: 'Toppings',
                type: 'checkbox',
                options: [
                  { label: 'Chocolate Chips', value: 'chocolate_chips', additionalPrice: 20 },
                  { label: 'Rainbow Sprinkles', value: 'rainbow_sprinkles', additionalPrice: 15 },
                  { label: 'Crushed Nuts', value: 'crushed_nuts', additionalPrice: 25 },
                  { label: 'Caramel Drizzle', value: 'caramel_drizzle', additionalPrice: 20 }
                ],
                isRequired: false,
                maxSelections: 3
              }
            ]
          },
          {
            id: '2',
            name: 'Strawberry Cheesecake Ice Cream',
            description: 'Creamy cheesecake ice cream with strawberry swirl',
            category: 'ice_cream',
            basePrice: 140,
            image: 'https://via.placeholder.com/200x200?text=Strawberry+Cheesecake',
            isAvailable: true,
            customizationOptions: [
              {
                name: 'Extra Toppings',
                type: 'checkbox',
                options: [
                  { label: 'Graham Cracker Crumbs', value: 'graham_crumbs', additionalPrice: 15 },
                  { label: 'Strawberry Pieces', value: 'strawberry_pieces', additionalPrice: 20 },
                  { label: 'Whipped Cream', value: 'whipped_cream', additionalPrice: 10 }
                ],
                isRequired: false
              }
            ]
          },
          {
            id: '3',
            name: 'Chocolate Brownie Sundae',
            description: 'Warm brownie with vanilla ice cream and chocolate sauce',
            category: 'dessert',
            basePrice: 180,
            image: 'https://via.placeholder.com/200x200?text=Brownie+Sundae',
            isAvailable: true,
            customizationOptions: [
              {
                name: 'Ice Cream Flavor',
                type: 'radio',
                options: [
                  { label: 'Vanilla', value: 'vanilla', additionalPrice: 0, isDefault: true },
                  { label: 'Chocolate', value: 'chocolate', additionalPrice: 10 },
                  { label: 'Strawberry', value: 'strawberry', additionalPrice: 10 }
                ],
                isRequired: true
              },
              {
                name: 'Sauce',
                type: 'radio',
                options: [
                  { label: 'Chocolate', value: 'chocolate', additionalPrice: 0, isDefault: true },
                  { label: 'Caramel', value: 'caramel', additionalPrice: 15 },
                  { label: 'Strawberry', value: 'strawberry', additionalPrice: 15 }
                ],
                isRequired: true
              },
              {
                name: 'Toppings',
                type: 'checkbox',
                options: [
                  { label: 'Whipped Cream', value: 'whipped_cream', additionalPrice: 10 },
                  { label: 'Chocolate Sprinkles', value: 'chocolate_sprinkles', additionalPrice: 15 },
                  { label: 'Cherry', value: 'cherry', additionalPrice: 10 }
                ],
                isRequired: false
              }
            ]
          }
        ];

        setShop(mockShop);
        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load shop details. Please try again.');
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [id]);

  if (loading) {
    return <div className="loading-container">Loading shop details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!shop) {
    return <div className="error-message">Shop not found</div>;
  }

  return (
    <div className="shop-detail-page">
      <div className="container">
        <div className="shop-header">
          <div className="shop-cover">
            <img src={shop.image} alt={`${shop.name} cover`} />
            <div className="shop-overlay">
              <div className="shop-info">
                <h1>{shop.name}</h1>
                <div className="shop-rating">
                  <FaStar /> {shop.rating} ({shop.totalRatings} reviews)
                </div>
                <p className="shop-description">{shop.description}</p>
                <div className="shop-status">
                  <span className={shop.isOpenNow ? 'status-open' : 'status-closed'}>
                    {shop.isOpenNow ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="shop-contact">
            <div className="contact-item">
              <FaMapMarkerAlt />
              <div>
                <h4>Address</h4>
                <p>
                  {shop.address.street}<br />
                  {shop.address.city}, {shop.address.state} {shop.address.postalCode}
                </p>
              </div>
            </div>
            <div className="contact-item">
              <FaPhone />
              <div>
                <h4>Phone</h4>
                <p>{shop.contactInfo.phone}</p>
              </div>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <div>
                <h4>Email</h4>
                <p>{shop.contactInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button className="tab-active">Menu</button>
          <button className="tab-inactive">Reviews</button>
          <button className="tab-inactive">About</button>
        </div>

        <div className="tab-content active">
          <h2>Menu</h2>
          <div className="products-grid">
            {products.length === 0 ? (
              <p>No products available</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {!product.isAvailable && (
                      <span className="availability-badge">Out of Stock</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">
                      <span>₹{product.basePrice}</span>
                    </div>
                    <div className="product-actions">
                      {!user ? (
                        <Link to="/login" className="btn-outline">
                          Login to Order
                        </Link>
                      ) : (
                        <button
                          className="btn-primary"
                          onClick={() => {
                            // In a real app, this would add to cart
                            alert(`Added ${product.name} to cart!`);
                          }}
                        >
                          Add to Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="tab-content">
          <h2>Reviews</h2>
          <p>No reviews yet. Be the first to review!</p>
        </div>

        <div className="tab-content">
          <h2>About This Shop</h2>
          <div className="operating-hours">
            <h3>Operating Hours</h3>
            <div className="hours-table">
              <div className="hour-row">
                <span>Monday</span>
                <span>
                  {shop.operatingHours.monday.isClosed ? 'Closed' : `${shop.operatingHours.monday.open} - ${shop.operatingHours.monday.close}`}
                </span>
            </div>
              <div className="hour-row">
                <span>Tuesday</span>
                <span>
                  {shop.operatingHours.tuesday.isClosed ? 'Closed' : `${shop.operatingHours.tuesday.open} - ${shop.operatingHours.tuesday.close}`}
                </span>
              </div>
              <div className="hour-row">
                <span>Wednesday</span>
                <span>
                  {shop.operatingHours.wednesday.isClosed ? 'Closed' : `${shop.operatingHours.wednesday.open} - ${shop.operatingHours.wednesday.close}`}
                </span>
              </div>
              <div className="hour-row">
                <span>Thursday</span>
                <span>
                  {shop.operatingHours.thursday.isClosed ? 'Closed' : `${shop.operatingHours.thursday.open} - ${shop.operatingHours.thursday.close}`}
                </span>
              </div>
              <div className="hour-row">
                <span>Friday</span>
                <span>
                  {shop.operatingHours.friday.isClosed ? 'Closed' : `${shop.operatingHours.friday.open} - ${shop.operatingHours.friday.close}`}
                </span>
              </div>
              <div className="hour-row">
                <span>Saturday</span>
                <span>
                  {shop.operatingHours.saturday.isClosed ? 'Closed' : `${shop.operatingHours.saturday.open} - ${shop.operatingHours.saturday.close}`}
                </span>
              </div>
              <div className="hour-row">
                <span>Sunday</span>
                <span>
                  {shop.operatingHours.sunday.isClosed ? 'Closed' : `${shop.operatingHours.sunday.open} - ${shop.operatingHours.sunday.close}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;