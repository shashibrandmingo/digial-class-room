import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      default: 'Digital Course / Lecture Recording',
    },
    bookingDate: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    slotId: {
      type: String, // 'slot-5-12' or 'slot-3-9'
      required: true,
    },
    slotName: {
      type: String,
      required: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['HELD', 'CONFIRMED', 'CANCELLED', 'EXPIRED'],
      default: 'HELD',
      index: true,
    },
    holdExpiresAt: {
      type: Date,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to help fast lookup of date + slot + status
bookingSchema.index({ bookingDate: 1, slotId: 1, status: 1 });

// Fast search & filter indexes for admin dashboard & client availability
bookingSchema.index({ bookingDate: -1, createdAt: -1 });
bookingSchema.index({ clientPhone: 1 });
bookingSchema.index({ clientEmail: 1 });
bookingSchema.index({ clientName: 1 });
bookingSchema.index({ status: 1, bookingDate: 1 });

// Text index for rapid full-text search across bookings
bookingSchema.index({
  clientName: 'text',
  clientEmail: 'text',
  clientPhone: 'text',
  bookingId: 'text',
});

export const Booking = mongoose.model('Booking', bookingSchema);
