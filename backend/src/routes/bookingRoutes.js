import express from 'express';
import {
  getSlotsAvailability,
  createBookingHold,
  verifyPayment,
  getBookingReceipt,
} from '../controllers/bookingController.js';
import { bookingLimiter } from '../middlewares/security.js';

const router = express.Router();

// Public: Get availability for selected date
router.get('/availability', getSlotsAvailability);

// Public: Hold slot and initialize Razorpay Order (Rate limited)
router.post('/hold', bookingLimiter, createBookingHold);

// Public: Verify Razorpay payment signature & confirm booking + send email
router.post('/verify-payment', verifyPayment);

// Public: Fetch confirmed booking receipt
router.get('/receipt/:bookingId', getBookingReceipt);

export default router;
