# IceCool - Ice Cream & Dessert Delivery Platform

IceCool is a full-stack web application for ordering ice cream and desserts from local shops, similar to Swiggy but focused exclusively on frozen treats and desserts.

## Features

### For Customers
- Mobile number-based authentication (OTP verification)
- Location-based shop discovery
- Browse ice cream shops and dessert parlors
- Customizable ice cream and dessert options (e.g., Magnum with chocolate chips)
- Real-time order tracking
- Secure checkout process
- Order history and profile management

### For Shop Owners
- Shop registration and management
- Product catalog management with customization options
- Order management dashboard
- Real-time order notifications
- Sales analytics and reporting

### Platform Features
- First-come-first-served order fulfillment
- Delivery personnel management
- Real-time notifications via WebSocket
- Geospatial search for nearby shops
- Responsive design for mobile and desktop

## Technology Stack

### Frontend
- React 18+ with Vite
- React Router for navigation
- React Icons for UI icons
- Zustand for state management
- Axios for HTTP requests
- Tailwind CSS (planned) / Custom CSS (current)

### Backend
- Node.js 18+ with Express.js
- MongoDB with Mongoose ODM
- JWT-based authentication
- Socket.IO for real-time communication
- Geospatial queries for location-based services

## Project Structure

```
icecool/
├── icecool-client/     # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context (Auth, Cart, etc.)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── services/   # API service calls
│   │   ├── utils/      # Utility functions
│   │   └── App.jsx     # Main App component
│   ├── public/         # Static assets
│   ├── index.html      # HTML template
│   ├── package.json    # Frontend dependencies
│   └── vite.config.js  # Vite configuration
│
└── icecool-server/     # Backend Node.js/Express API
    ├── src/
    │   ├── controllers/  # Request handlers
    │   ├── models/       # Database models
    │   ├── routes/       # API route definitions
    │   ├── middleware/   # Custom middleware (auth, validation)
    │   ├── utils/        # Helper functions
    │   ├── socket/       # Socket.IO handlers
    │   └── server.js     # Entry point
    ├── .env              # Environment variables
    ├── package.json      # Backend dependencies
    └── README.md         # Backend documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd icecool
```

2. Install backend dependencies
```bash
cd icecool-server
npm install
```

3. Install frontend dependencies
```bash
cd ../icecool-client
npm install
```

4. Set up environment variables
Create a `.env` file in the `icecool-server` directory:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/icecool
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

5. Start MongoDB (if not already running)
```bash
# For local MongoDB
mongod
```

6. Start the backend server
```bash
# From icecool-server directory
npm run dev
# or
node server.js
```

7. Start the frontend development server
```bash
# From icecool-client directory
npm run dev
```

8. Open your browser and visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/verify-otp` - Verify OTP and login
- POST `/api/auth/login` - Login with verified phone
- GET `/api/auth/me` - Get current user profile
- POST `/api/auth/resend-otp` - Resend OTP

### Shops
- GET `/api/shops` - Get list of shops (with filters)
- GET `/api/shops/:id` - Get specific shop
- POST `/api/shops` - Create new shop (shop owners only)
- PUT `/api/shops/:id` - Update shop (owner only)
- DELETE `/api/shops/:id` - Delete shop (owner only)
- GET `/api/shops/:id/products` - Get shop's products

### Products
- GET `/api/products` - Get list of products (with filters)
- GET `/api/products/:id` - Get specific product
- POST `/api/products` - Create new product (shop owners only)
- PUT `/api/products/:id` - Update product (owner only)
- DELETE `/api/products/:id` - Delete product (owner only)
- PATCH `/api/products/:id/toggle-availability` - Toggle product availability

### Orders
- GET `/api/orders` - Get user's orders
- POST `/api/orders` - Create new order
- GET `/api/orders/:id` - Get specific order
- PATCH `/api/orders/:id/status` - Update order status
- GET `/api/orders/shop/:shopId` - Get shop's orders (shop owners only)

### Users
- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get specific user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user (admin only)

## Customization System

IceCool features a flexible customization system that allows shops to define:
- **Base Products**: Ice creams, desserts, beverages, toppings
- **Customization Options**: Checkboxes, radio buttons, dropdowns, text inputs
- **Pricing Rules**: Base price + additional costs for customizations
- **Availability Controls**: Schedule-based availability, inventory tracking

Example: A Magnum ice cream can have:
- Coating options (Milk chocolate, Dark chocolate, White chocolate)
- Toppings (Chocolate chips, Sprinkles, Nuts, Caramel drizzle)
- Each option can have additional pricing

## Real-time Features

The platform uses Socket.IO for real-time updates:
- Shop owners receive instant notifications for new orders
- Customers receive real-time order status updates
- Live tracking of order preparation and delivery progress

## Future Enhancements

1. **Payment Integration**: Stripe, Razorpay, or other payment gateways
2. **Delivery Tracking**: Real-time GPS tracking of deliveries
3. **Advanced Analytics**: Detailed sales reports and customer insights
4. **Loyalty Program**: Rewards and referral system
5. **Multi-language Support**: Internationalization (i18n)
6. **Admin Panel**: Comprehensive platform administration
7. **Promotions & Coupons**: Discount system and promotional codes
8. **Social Features**: User reviews, ratings, and social sharing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by food delivery platforms like Swiggy, Zomato, Uber Eats
- Built with ❤️ for ice cream lovers everywhere
- Special thanks to the open-source community