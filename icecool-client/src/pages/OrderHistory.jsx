import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaListAlt, FaClock, FaMapMarkerAlt, FaTruckLoading, FaCheckCircle, FaTimesCircle, FaMoneyBill } from 'react-icons/fa';

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, placed, preparing, delivered, cancelled

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to /api/orders with filter
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockOrders = [
          {
            id: '1001',
            placedAt: '2026-09-05T14:30:00Z',
            status: 'delivered',
            items: [
              {
                name: 'Classic Magnum',
                quantity: 2,
                price: 120,
                image: 'https://via.placeholder.com/100x100?text=Magnum'
              },
              {
                name: 'Strawberry Cheesecake Ice Cream',
                quantity: 1,
                price: 140,
                image: 'https://via.placeholder.com/100x100?text=Strawberry+Cheesecake'
              }
            ],
            shop: {
              name: 'Cold Treats',
              image: 'https://via.placeholder.com/100x100?text=Cold+Treats'
            },
            totalAmount: 380,
            deliveryFee: 0,
            taxAmount: 19
          },
          {
            id: '1002',
            placedAt: '2026-09-06T16:45:00Z',
            status: 'preparing',
            items: [
              {
                name: 'Chocolate Brownie Sundae',
                quantity: 1,
                price: 180,
                image: 'https://via.placeholder.com/100x100?text=Brownie+Sundae'
              }
            ],
            shop: {
              name: 'Sweet Scoops',
              image: 'https://via.placeholder.com/100x100?text=Sweet+Scoops'
            },
            totalAmount: 180,
            deliveryFee: 0,
            taxAmount: 9
          },
          {
            id: '1003',
            placedAt: '2026-09-04T12:15:00Z',
            status: 'cancelled',
            items: [
              {
                name: 'Vanilla Ice Cream',
                quantity: 1,
                price: 100,
                image: 'https://via.placeholder.com/100x100?text=Vanilla'
              }
            ],
            shop: {
              name: 'Frozen Delights',
              image: 'https://via.placeholder.com/100x100?text=Frozen+Delights'
            },
            totalAmount: 100,
            deliveryFee: 0,
            taxAmount: 5
          }
        ];

        // Apply filter
        let filteredOrders = mockOrders;
        if (filter !== 'all') {
          filteredOrders = mockOrders.filter(order => order.status === filter);
        }

        setOrders(filteredOrders);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, filter]);

  const getStatusBadge = (status) => {
    const statusMap = {
      placed: { text: 'Order Placed', color: 'bg-blue-100 text-blue-800' },
      confirmed: { text: 'Order Confirmed', color: 'bg-blue-100 text-blue-800' },
      preparing: { text: 'Preparing', color: 'bg-yellow-100 text-yellow-800' },
      ready: { text: 'Ready for Pickup', color: 'bg-green-100 text-green-800' },
      out_for_delivery: { text: 'Out for Delivery', color: 'bg-purple-100 text-purple-800' },
      delivered: { text: 'Delivered', color: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Cancelled', color: 'bg-red-100 text-red-800' }
    };

    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (!user) {
    return (
      <div className="order-history-page">
        <div className="container">
          <h2>Order History</h2>
          <p>Please <Link to="/login">log in</Link> to view your order history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-container">Loading orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="order-history-page">
      <div className="container">
        <div className="page-header">
          <h1>Order History</h2>
          <Link to="/" className="btn-outline">
            Continue Shopping
          </Link>
        </div>

        <div className="order-filters">
          <h3>Filter by Status</h3>
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'filter-active' : 'filter-inactive'}
              onClick={() => setFilter('all')}
            >
              All Orders
            </button>
            <button
              className={filter === 'placed' ? 'filter-active' : 'filter-inactive'}
              onClick={() => setFilter('placed')}
            >
              Placed
            </button>
            <button
              className={filter === 'preparing' ? 'filter-active' : 'filter-inactive'}
              onClick={() => setFilter('preparing')}
            >
              Preparing
            </button>
            <button
              className={filter === 'delivered' ? 'filter-active' : 'filter-inactive'}
              onClick={() => setFilter('delivered')}
            >
              Delivered
            </button>
            <button
              className={filter === 'cancelled' ? 'filter-active' : 'filter-inactive'}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet.</p>
            <Link to="/shops" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.id}</h3>
                      <p className="order-date">
                        <FaClock /> {new Date(order.placedAt).toLocaleString()}
                      </p>
                      <span className={`status-badge ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    <div className="order-total">
                      <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="shop-info">
                      <img src={shop.image} alt={shop.name} />
                      <div>
                        <h4>{shop.name}</h4>
                        <p>Ice Cream Shop</p>
                      </div>
                    </div>

                    <div className="order-items">
                      <h4>Items</h4>
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.name}`} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div>
                            <p>{item.name}</p>
                            <p>Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-actions">
                    <Link to={`/orders/${order.id}`} className="btn-outline">
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;