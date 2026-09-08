import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChartBar, FaUtensils, FaUser, FaSignOutAlt, FaPlusCircle, FaEdit, FaTimes, FaClock, FaTruckLoading, FaCheckCircle } from 'react-icons/fa';

const ShopDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be API calls to get shop stats and orders
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockStats = {
          totalOrders: 124,
          totalRevenue: 24500,
          ordersToday: 12,
          revenueToday: 2450,
          avgRating: 4.6,
          totalRatings: 89
        };

        const mockRecentOrders = [
          {
            id: '2001',
            placedAt: '2026-09-08T10:30:00Z',
            status: 'preparing',
            customerName: 'John Doe',
            items: [
              { name: 'Classic Magnum', quantity: 2 },
              { name: 'Chocolate Chips (extra)', quantity: 1 }
            ],
            totalAmount: 280
          },
          {
            id: '2002',
            placedAt: '2026-09-08T09:15:00Z',
            status: 'confirmed',
            customerName: 'Jane Smith',
            items: [
              { name: 'Strawberry Cheesecake Ice Cream', quantity: 1 }
            ],
            totalAmount: 140
          },
          {
            id: '2003',
            placedAt: '2026-09-07T22:45:00Z',
            status: 'delivered',
            customerName: 'Mike Johnson',
            items: [
              { name: 'Chocolate Brownie Sundae', quantity: 1 },
              { name: 'Whipped Cream (extra)', quantity: 1 }
            ],
            totalAmount: 200
          }
        ];

        setStats(mockStats);
        setRecentOrders(mockRecentOrders);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    if (user && (user.role === 'shop_owner' || user.role === 'admin')) {
      fetchDashboardData();
    }
  }, [user]);

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
      <div className="shop-dashboard-page">
        <div className="container">
          <h2>Shop Dashboard</h2>
          <p>Please <Link to="/login">log in</Link> to access the shop dashboard.</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'shop_owner' && user.role !== 'admin') {
    return (
      <div className="shop-dashboard-page">
        <div className="container">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the shop dashboard.</p>
          <Link to="/" className="btn-outline">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="shop-dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Shop Dashboard</h1>
          <div className="user-info">
            <p>Welcome back, {user.name}!</p>
            <Link to="/shops" className="btn-outline">
              View Your Shop
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
            <FaChartBar />
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>₹{stats.totalRevenue.toLocaleString()}</p>
            <FaUtensils />
          </div>
          <div className="stat-card">
            <h3>Orders Today</h3>
            <p>{stats.ordersToday}</p>
            <FaClock />
          </div>
          <div className="stat-card">
            <h3>Revenue Today</h3>
            <p>₹{stats.revenueToday.toLocaleString()}</p>
            <FaTruckLoading />
          </div>
          <div className="stat-card">
            <h3>Average Rating</h3>
            <p>{stats.avgRating}/5</p>
            <FaUser />
          </div>
        </div>

        <div className="recent-orders">
          <h2>Recent Orders</h2>
          <div className="orders-table">
            <div className="table-header">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Items</div>
              <div>Status</div>
              <div>Total</div>
              <div>Actions</div>
            </div>
            <div className="table-body">
              {recentOrders.length === 0 ? (
                <div className="empty-state">
                  <p>No recent orders</p>
                </div>
              ) : (
                recentOrders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  return (
                    <div key={order.id} className="table-row">
                      <div>#{order.id}</div>
                      <div>{order.customerName}</div>
                      <div className="order-items-list">
                        {order.items.map((item, index) => (
                          <span key={index}>
                            {item.quantity}× {item.name}{index < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                      <div>
                        <span className={`status-badge ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <div>₹{order.totalAmount}</div>
                      <div className="table-actions">
                        <button className="btn-outline">View</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/products" className="action-card">
              <FaPlusCircle />
              <h3>Add Product</h3>
              <p>Add new items to your shop's menu</p>
            </Link>

            <Link to={`/shops/${user.id}`} className="action-card">
              <FaEdit />
              <h3>Edit Shop</h3>
              <p>Update your shop information</p>
            </Link>

            <button onClick={() => {/* Logout logic */}} className="action-card">
              <FaSignOutAlt />
              <h3>Logout</h3>
              <p>Sign out of your account</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;