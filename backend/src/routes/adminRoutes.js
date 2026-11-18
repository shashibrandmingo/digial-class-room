import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getAllBookings,
  blockSlot,
  unblockSlot,
  getBlockedSlots,
  createManualBooking,
} from '../controllers/adminController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin Auth
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(protectAdmin);

router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);
router.post('/manual-booking', createManualBooking);

// Slot Block & Maintenance Controls
router.get('/blocks', getBlockedSlots);
router.post('/block-slot', blockSlot);
router.delete('/unblock/:blockId', unblockSlot);

export default router;
