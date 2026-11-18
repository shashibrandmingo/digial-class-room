import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { apiLimiter } from './middlewares/security.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { Admin } from './models/Admin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' })); // Body limit prevents payload attacks
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Digital Classroom Studio API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Seed Initial Admin user if not exists
const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: 'admin@studio.com' });
    if (!existing) {
      const admin = new Admin({
        name: 'Head Administrator',
        email: 'admin@studio.com',
        password: 'admin123',
        role: 'admin',
      });
      await admin.save();
      console.log('👑 Default Admin created: admin@studio.com / admin123 (Change in production)');
    }
  } catch (error) {
    console.warn('Note: Admin seeding skipped or database offline:', error.message);
  }
};

// Start Server
const startServer = async () => {
  await connectDB();
  await seedAdmin();

  app.listen(PORT, () => {
    console.log(`\n🚀 Digital Classroom Backend running on http://localhost:${PORT}`);
    console.log(`📡 Ready for bookings & slot tracking.`);
  });
};

startServer();
