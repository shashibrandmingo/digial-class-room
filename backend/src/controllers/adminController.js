import { Admin } from '../models/Admin.js';
import { Booking } from '../models/Booking.js';
import { SlotBlock } from '../models/SlotBlock.js';
import { BOOKING_STATUS, SLOTS } from '../config/constants.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// 1. Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
      process.env.JWT_SECRET || 'digital_classroom_jwt_secret_dev_key_2026_xyz9876543210!',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error in adminLogin:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// 2. Dashboard Statistics & Overview
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Total confirmed bookings & revenue (lean for ultra-fast response)
    const confirmedBookings = await Booking.find({
      status: BOOKING_STATUS.CONFIRMED,
    }).select('amount').lean();

    const totalRevenue = confirmedBookings.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    // Today's bookings
    const todayBookings = await Booking.find({
      bookingDate: today,
      status: BOOKING_STATUS.CONFIRMED,
    }).lean();

    // Upcoming blocks
    const totalBlocks = await SlotBlock.countDocuments({
      date: { $gte: today },
    });

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      stats: {
        totalConfirmedBookings: confirmedBookings.length,
        totalRevenue,
        todayBookingsCount: todayBookings.length,
        activeBlocksCount: totalBlocks,
      },
      todayBookings,
      recentBookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};

// 3. Get All Bookings with Filter & Search
export const getAllBookings = async (req, res) => {
  try {
    const { date, status, search } = req.query;
    const query = {};

    if (date) query.bookingDate = date;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { clientPhone: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(query)
      .sort({ bookingDate: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
};

// 4. Block Slot or Entire Day (Maintenance / Offline Walk-in / Holiday)
export const blockSlot = async (req, res) => {
  try {
    const { date, slotId, reason } = req.body;

    if (!date || !slotId) {
      return res.status(400).json({
        success: false,
        message: 'Date and slotId (all, slot-5-12, or slot-3-9) are required.',
      });
    }

    // Check if slot is already booked on this date
    const query = {
      bookingDate: date,
      status: BOOKING_STATUS.CONFIRMED,
    };
    if (slotId !== 'all') {
      query.slotId = slotId;
    }

    const alreadyBooked = await Booking.findOne(query);
    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: `Cannot block: A confirmed booking (${alreadyBooked.bookingId} - ${alreadyBooked.clientName}) already exists for this slot/date!`,
      });
    }

    // Upsert the block
    const block = await SlotBlock.findOneAndUpdate(
      { date, slotId },
      {
        date,
        slotId,
        reason: reason || 'Studio Maintenance',
        blockedBy: req.admin?.email || 'Admin',
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Slot successfully blocked for ${date}`,
      block,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to block slot',
      error: error.message,
    });
  }
};

// 5. Unblock Slot
export const unblockSlot = async (req, res) => {
  try {
    const { blockId } = req.params;
    const deleted = await SlotBlock.findByIdAndDelete(blockId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Block entry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Slot has been unblocked and is now open for booking.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to unblock slot',
      error: error.message,
    });
  }
};

// 6. Get All Blocked Slots
export const getBlockedSlots = async (req, res) => {
  try {
    const blocks = await SlotBlock.find().sort({ date: 1 });
    return res.status(200).json({
      success: true,
      blocks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blocked slots',
      error: error.message,
    });
  }
};

// 7. Manual Walk-In Booking by Admin
export const createManualBooking = async (req, res) => {
  try {
    const { bookingDate, slotId, clientName, clientPhone, clientEmail, notes } = req.body;

    const slot = SLOTS.find((s) => s.id === slotId);
    if (!slot) {
      return res.status(400).json({ success: false, message: 'Invalid slot' });
    }

    // Check conflict
    const existing = await Booking.findOne({
      bookingDate,
      slotId,
      status: BOOKING_STATUS.CONFIRMED,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Slot is already booked for this date!',
      });
    }

    const bookingId = `DCR-MANUAL-${Date.now().toString().slice(-6)}`;
    const manualBooking = await Booking.create({
      bookingId,
      clientName: clientName.trim(),
      clientEmail: (clientEmail || 'walkin@studio.local').trim().toLowerCase(),
      clientPhone: clientPhone.trim(),
      purpose: 'Offline / Walk-in Booking',
      bookingDate,
      slotId: slot.id,
      slotName: slot.name,
      slotTime: slot.timeRange,
      amount: slot.price,
      status: BOOKING_STATUS.CONFIRMED,
      razorpayPaymentId: 'MANUAL_CASH_OR_UPI_OFFLINE',
      notes: notes || 'Booked directly by Admin via Dashboard',
    });

    return res.status(201).json({
      success: true,
      message: 'Manual booking created successfully',
      booking: manualBooking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create manual booking',
      error: error.message,
    });
  }
};
