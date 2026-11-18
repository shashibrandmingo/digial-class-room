import mongoose from 'mongoose';

const slotBlockSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    slotId: {
      type: String, // 'all' (entire day) or 'slot-5-12' or 'slot-3-9'
      required: true,
    },
    reason: {
      type: String,
      default: 'Studio Maintenance / Private Booking',
      trim: true,
    },
    blockedBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

slotBlockSchema.index({ date: 1, slotId: 1 }, { unique: true });
slotBlockSchema.index({ date: 1, createdAt: -1 });

export const SlotBlock = mongoose.model('SlotBlock', slotBlockSchema);
