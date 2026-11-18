export const SLOTS = [
  {
    id: "slot-5-12",
    name: "Morning Slot (5 AM - 12 PM)",
    timeRange: "05:00 AM - 12:00 PM",
    startHour: 5,
    endHour: 12,
    durationHours: 7,
    price: 3999,
    description: "7 Hours deep focus slot. Perfect for extensive course lectures & uninterrupted multi-video batches.",
    badge: "Most Popular for Courses"
  },
  {
    id: "slot-3-9",
    name: "Evening Slot (3 PM - 9 PM)",
    timeRange: "03:00 PM - 09:00 PM",
    startHour: 15,
    endHour: 21,
    durationHours: 6,
    price: 4999,
    description: "6 Hours prime evening slot with full pro-lighting, digital smartboard & sound isolation setup.",
    badge: "Prime Lighting & Setup"
  }
];

export const BOOKING_STATUS = {
  AVAILABLE: "AVAILABLE",
  HELD: "HELD",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  BLOCKED_BY_ADMIN: "BLOCKED_BY_ADMIN"
};
