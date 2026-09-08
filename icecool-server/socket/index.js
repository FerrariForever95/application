const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Socket.IO connection handler
const setupSocketIO = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    // Join user room
    socket.on('join-user-room', () => {
      socket.join(`user-${socket.userId}`);
      console.log(`User ${socket.userId} joined their room`);
    });

    // Join shop room (if user is shop owner)
    socket.on('join-shop-room', async (shopId) => {
      try {
        const shop = await User.findById(socket.userId);
        // In a real app, you'd check if the user owns the shop
        socket.join(`shop-${shopId}`);
        console.log(`User ${socket.userId} joined shop ${shopId} room`);
      } catch (error) {
        console.error('Error joining shop room:', error);
      }
    });

    // Notify shop of new order
    socket.on('notify-new-order', async ({ shopId, order }) => {
      try {
        // In a real app, verify the user is authorized to notify this shop
        io.to(`shop-${shopId}`).emit('new-order', order);
        console.log(`Notified shop ${shopId} of new order`);
      } catch (error) {
        console.error('Error notifying shop:', error);
      }
    });

    // Notify user of order status update
    socket.on('notify-order-status', async ({ userId, order }) => {
      try {
        io.to(`user-${userId}`).emit('order-status-update', order);
        console.log(`Notified user ${userId} of order status update`);
      } catch (error) {
        console.error('Error notifying user:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });
};

module.exports = setupSocketIO;