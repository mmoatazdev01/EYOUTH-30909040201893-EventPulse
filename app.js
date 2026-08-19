const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const User = require('./models/User');
const Registration = require('./models/Registration');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
if (isDevelopment) {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  });
}

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    database: dbStatus
  });
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPulse API',
      version: '1.0.0',
      description: 'Event management and registration API'
    },
    servers: [{ url: 'http://localhost:5000' }]
  },
  apis: ['./routes/*.js', './app.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'EventPulse API is running',
    documentation: '/api-docs',
    health: '/health',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

const isDatabaseReady = () => mongoose.connection.readyState === 1;

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join-event', async (eventId, callback) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.userId);
      const registration = await Registration.exists({ event: eventId, attendee: decoded.userId });

      if (!user || (!registration && user.role !== 'admin')) {
        return callback && callback({ ok: false, message: 'Registration required' });
      }

      socket.join(eventId);
      callback && callback({ ok: true });
    } catch (error) {
      callback && callback({ ok: false, message: 'Authentication required' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

if (require.main === module) {
  connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
module.exports.connectDB = connectDB;
module.exports.server = server;
