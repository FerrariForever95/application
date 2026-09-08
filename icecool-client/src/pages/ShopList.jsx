import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaFilter, FaSort, FaIceCream } from 'react-icons/fa';

const ShopList = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    minRating: 0,
    openNow: false
  });

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to /api/shops with filters
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockShops = [
          {
            id: 1,
            name: 'Cold Treats',
            description: 'Premium ice cream parlor',
            rating: 4.5,
            image: 'https://via.placeholder.com/300x200?text=Cold+Treats',
            address: {
              street: '123 Ice Cream Ave',
              city: 'Mumbai',
              state: 'MH'
            },
            isOpenNow: true
          },
          {
            id: 2,
            name: 'Sweet Scoops',
            description: 'Artisanal desserts & ice cream',
            rating: 4.8,
            image: 'https://via.placeholder.com/300x200?text=Sweet+Scoops',
            address: {
              street: '456 Dessert Lane',
              city: 'Delhi',
              state: 'DL'
            },
            isOpenNow: false
          },
          {
            id: 3,
            name: 'Frozen Delights',
            description: 'Family-friendly ice cream shop',
            rating: 4.2,
            image: 'https://via.placeholder.com/300x200?text=Frozen+Delights',
            address: {
              street: '789 Frosty Blvd',
              city: 'Bangalore',
              state: 'KA'
            },
            isOpenNow: true
          },
          {
            id: 4,
            name: 'Chill Zone',
            description: 'Modern ice cream bar',
            rating: 4.6,
            image: 'https://via.placeholder.com/300x200?text=Chill+Zone',
            address: {
              street: '321 Chill Street',
              city: 'Hyderabad',
              state: 'TG'
            },
            isOpenNow: true
          }
        ];

        // Apply filters
        let filteredShops = mockShops;

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredShops = filteredShops.filter(shop =>
            shop.name.toLowerCase().includes(searchTerm) ||
            shop.description.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.minRating > 0) {
          filteredShops = filteredShops.filter(shop => shop.rating >= filters.minRating);
        }

        if (filters.openNow) {
          filteredShops = filteredShops.filter(shop => shop.isOpenNow);
        }

        setShops(filteredShops);
        setLoading(false);
      } catch (err) {
        setError('Failed to load shops. Please try again.');
        setLoading(false);
      }
    };

    fetchShops();
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleRatingChange = (e) => {
    setFilters(prev => ({ ...prev, minRating: parseInt(e.target.value) || 0 }));
  };

  const handleOpenNowChange = (e) => {
    setFilters(prev => ({ ...prev, openNow: e.target.checked }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      minRating: 0,
      openNow: false
    });
  };

  if (loading) {
    return <div className="loading-container">Loading shops...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="shop-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Find Ice Cream Shops</h1>
          <p>Discover local shops near you</p>
        </div>

        <div className="filters-card">
          <h3>Filter Results</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="search">Search shops</label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search by name or description"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="minRating">Minimum Rating</label>
              <select
                id="minRating"
                value={filters.minRating}
                onChange={handleRatingChange}
              >
                <option value="0">Any Rating</option>
                <option value="1">1+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="openNow">
                <input
                  type="checkbox"
                  id="openNow"
                  checked={filters.openNow}
                  onChange={handleOpenNowChange}
                />
                Open Now
              </label>
            </div>

            <div className="filter-actions">
              <button
                type="button"
                onClick={resetFilters}
                className="btn-outline"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="shops-header">
          <h2>
            {shops.length} {shops.length === 1 ? 'Shop' : 'Shops'} Found
          </h2>
          {shops.length > 0 && (
            <div className="sort-options">
              <label htmlFor="sortBy">Sort by:</label>
              <select id="sortBy">
                <option value="rating-desc">Highest Rating</option>
                <option value="rating-asc">Lowest Rating</option>
                <option value="name-az">Name A-Z</option>
                <option value="name-za">Name Z-A</option>
              </select>
            </div>
          )}
        </div>

        <div className="shops-grid">
          {shops.length === 0 ? (
            <div className="no-results">
              <p>No shops found matching your criteria.</p>
              <button onClick={resetFilters} className="btn-outline">
                Clear Filters
              </button>
            </div>
          ) : (
            shops.map((shop) => (
              <div key={shop.id} className="shop-card">
                <div className="shop-image">
                  <img src={shop.image} alt={shop.name} />
                  {shop.isOpenNow && (
                    <span className="open-badge">Open Now</span>
                  )}
                </div>
                <div className="shop-info">
                  <h3>{shop.name}</h3>
                  <p className="shop-description">{shop.description}</p>
                  <div className="shop-details">
                    <p>
                      <FaMapMarkerAlt /> {shop.address.city}, {shop.address.state}
                    </p>
                    <div className="shop-rating">
                      <span>{shop.rating}/5</span>
                    </div>
                  </div>
                  <Link to={`/shops/${shop.id}`} className="btn-primary">
                    View Shop
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopList;