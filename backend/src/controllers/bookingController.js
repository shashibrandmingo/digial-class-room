import { SLOTS, BOOKING_STATUS } from '../config/constants.js';
import { Booking } from '../models/Booking.js';
import { SlotBlock } from '../models/SlotBlock.js';
import {
  getRazorpayInstance,
  isRazorpayConfigured,
  verifyRazorpaySignature,
} from '../config/razorpay.js';
import { sendBookingConfirmationEmail } from '../utils/mailer.js';
import crypto from 'crypto';

// Helper to generate readable unique Booking ID
const generateBookingId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `DCR-${dateStr}-${randomChars}`;
};

// 1. Get Slots Availability for a Date
export const getSlotsAvailability = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "date" (YYYY-MM-DD) is required.',
      });
    }

    // 1. Check Admin Blocks for this date
    const adminBlocks = await SlotBlock.find({ date }).lean();
    const isFullDayBlocked = adminBlocks.some((b) => b.slotId === 'all');
    const blockedSlotMap = new Map();
    adminBlocks.forEach((b) => blockedSlotMap.set(b.slotId, b.reason));

    // 2. Check Confirmed Bookings for this date
    const confirmedBookings = await Booking.find({
      bookingDate: date,
      status: BOOKING_STATUS.CONFIRMED,
    }).select('slotId').lean();
    const bookedSlotIds = new Set(confirmedBookings.map((b) => b.slotId));

    // 3. Check Active HELD Bookings (temporary lock)
    const now = new Date();
    const activeHolds = await Booking.find({
      bookingDate: date,
      status: BOOKING_STATUS.HELD,
      holdExpiresAt: { $gt: now },
    }).select('slotId').lean();
    const heldSlotIds = new Set(activeHolds.map((b) => b.slotId));

    // Map through standard slots and attach dynamic status
    const slotsWithStatus = SLOTS.map((slot) => {
      let status = BOOKING_STATUS.AVAILABLE;
      let reason = null;

      if (isFullDayBlocked) {
        status = BOOKING_STATUS.BLOCKED_BY_ADMIN;
        reason = blockedSlotMap.get('all') || 'Studio maintenance / Closed';
      } else if (blockedSlotMap.has(slot.id)) {
        status = BOOKING_STATUS.BLOCKED_BY_ADMIN;
        reason = blockedSlotMap.get(slot.id) || 'Slot under maintenance';
      } else if (bookedSlotIds.has(slot.id)) {
        status = BOOKING_STATUS.CONFIRMED;
        reason = 'Already booked for this date';
      } else if (heldSlotIds.has(slot.id)) {
        status = BOOKING_STATUS.HELD;
        reason = 'Checkout in progress by another customer';
      }

      return {
        ...slot,
        status,
        reason,
        isBookable: status === BOOKING_STATUS.AVAILABLE,
      };
    });

    return res.status(200).json({
      success: true,
      date,
      slots: slotsWithStatus,
    });
  } catch (error) {
    console.error('Error in getSlotsAvailability:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch slot availability',
      error: error.message,
    });
  }
};

// 2. Create Booking Hold & Razorpay Order
export const createBookingHold = async (req, res) => {
  try {
    const { bookingDate, slotId, clientName, clientEmail, clientPhone, purpose } = req.body;

    // Basic Validations
    if (!bookingDate || !slotId || !clientName || !clientEmail || !clientPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (date, slot, name, email, phone).',
      });
    }

    const slot = SLOTS.find((s) => s.id === slotId);
    if (!slot) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slot selected.',
      });
    }

    // Verify date is not in past
    const today = new Date().toISOString().split('T')[0];
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book for a past date.',
      });
    }

    // 1. Check if Blocked by Admin
    const isBlocked = await SlotBlock.findOne({
      date: bookingDate,
      slotId: { $in: ['all', slotId] },
    });
    if (isBlocked) {
      return res.status(409).json({
        success: false,
        message: `This slot is currently unavailable (${isBlocked.reason || 'Under Maintenance'}). Please choose another date or slot.`,
      });
    }

    // 2. Check if already Confirmed
    const existingConfirmed = await Booking.findOne({
      bookingDate,
      slotId,
      status: BOOKING_STATUS.CONFIRMED,
    });
    if (existingConfirmed) {
      return res.status(409).json({
        success: false,
        message: 'This slot is already booked for this date! Please choose another date or time.',
      });
    }

    // 3. Check if active HELD by someone else
    const now = new Date();
    const existingHeld = await Booking.findOne({
      bookingDate,
      slotId,
      status: BOOKING_STATUS.HELD,
      holdExpiresAt: { $gt: now },
      clientEmail: { $ne: clientEmail.toLowerCase() },
    });
    if (existingHeld) {
      return res.status(409).json({
        success: false,
        message: 'Someone is currently checking out this slot. Please try again in 5-10 minutes if they do not complete payment.',
      });
    }

    // 4. Generate Unique Booking ID & Set 10-minute hold
    const bookingId = generateBookingId();
    const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // 5. Create Razorpay Order
    let razorpayOrderId = `order_sim_${Date.now()}`;
    const razorpay = getRazorpayInstance();

    if (isRazorpayConfigured() && razorpay) {
      const order = await razorpay.orders.create({
        amount: slot.price * 100, // paise
        currency: 'INR',
        receipt: bookingId,
        notes: {
          slotName: slot.name,
          bookingDate,
          clientPhone,
        },
      });
      razorpayOrderId = order.id;
    }

    // 6. Save or Update Hold in Database
    const newBooking = await Booking.create({
      bookingId,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: clientPhone.trim(),
      purpose: purpose ? purpose.trim() : 'Digital Classroom Recording',
      bookingDate,
      slotId: slot.id,
      slotName: slot.name,
      slotTime: slot.timeRange,
      amount: slot.price,
      status: BOOKING_STATUS.HELD,
      holdExpiresAt,
      razorpayOrderId,
    });

    return res.status(201).json({
      success: true,
      bookingId: newBooking.bookingId,
      orderId: razorpayOrderId,
      amount: slot.price,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      isDemoMode: !isRazorpayConfigured(),
      holdExpiresAt,
      slotDetails: {
        name: slot.name,
        time: slot.timeRange,
        date: bookingDate,
      },
    });
  } catch (error) {
    console.error('Error in createBookingHold:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate booking',
      error: error.message,
    });
  }
};

// 3. Verify Payment & Confirm Booking
export const verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!bookingId || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification details.',
      });
    }

    // Find the booking
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found.',
      });
    }

    // Idempotency: if already confirmed
    if (booking.status === BOOKING_STATUS.CONFIRMED) {
      return res.status(200).json({
        success: true,
        message: 'Booking is already confirmed.',
        booking,
      });
    }

    // Verify Razorpay Cryptographic Signature
    const isValidSignature = verifyRazorpaySignature(
      razorpay_order_id || booking.razorpayOrderId,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid cryptographic signature.',
      });
    }

    // Double check conflict before final confirmation
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      bookingDate: booking.bookingDate,
      slotId: booking.slotId,
      status: BOOKING_STATUS.CONFIRMED,
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Unfortunately this slot was just confirmed by another customer. Your payment will be refunded immediately.',
      });
    }

    // Mark as CONFIRMED
    booking.status = BOOKING_STATUS.CONFIRMED;
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    await booking.save();

    // Trigger confirmation email
    sendBookingConfirmationEmail({
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      bookingId: booking.bookingId,
      bookingDate: booking.bookingDate,
      slotName: booking.slotName,
      slotTime: booking.slotTime,
      amount: booking.amount,
      paymentId: razorpay_payment_id,
    })
      .then(async (emailRes) => {
        if (emailRes && emailRes.success) {
          booking.emailSent = true;
          booking.emailSentAt = new Date();
          await booking.save();
        }
      })
      .catch((err) => console.error('Email send background error:', err));

    return res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: {
        bookingId: booking.bookingId,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        bookingDate: booking.bookingDate,
        slotName: booking.slotName,
        slotTime: booking.slotTime,
        amount: booking.amount,
        status: booking.status,
        paymentId: razorpay_payment_id,
      },
    });
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment confirmation failed',
      error: error.message,
    });
  }
};

// 4. Public Receipt Lookup
export const getBookingReceipt = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    return res.status(200).json({
      success: true,
      booking: {
        bookingId: booking.bookingId,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        bookingDate: booking.bookingDate,
        slotName: booking.slotName,
        slotTime: booking.slotTime,
        amount: booking.amount,
        status: booking.status,
        paymentId: booking.razorpayPaymentId,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking receipt',
      error: error.message,
    });
  }
};
