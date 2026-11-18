import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Admin JWT Token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dcr_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Slot & Booking API
export const fetchSlotAvailability = async (date) => {
  const res = await api.get(`/bookings/availability?date=${date}`);
  return res.data;
};

export const initiateBookingHold = async (bookingData) => {
  const res = await api.post('/bookings/hold', bookingData);
  return res.data;
};

export const confirmPaymentVerification = async (paymentData) => {
  const res = await api.post('/bookings/verify-payment', paymentData);
  return res.data;
};

export const fetchBookingReceipt = async (bookingId) => {
  const res = await api.get(`/bookings/receipt/${bookingId}`);
  return res.data;
};

// Admin API
export const adminLoginRequest = async (email, password) => {
  const res = await api.post('/admin/login', { email, password });
  return res.data;
};

export const fetchDashboardStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const fetchAllBookings = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/admin/bookings?${query}`);
  return res.data;
};

export const requestSlotBlock = async ({ date, slotId, reason }) => {
  const res = await api.post('/admin/block-slot', { date, slotId, reason });
  return res.data;
};

export const requestSlotUnblock = async (blockId) => {
  const res = await api.delete(`/admin/unblock/${blockId}`);
  return res.data;
};

export const fetchBlockedSlots = async () => {
  const res = await api.get('/admin/blocks');
  return res.data;
};

export const createManualWalkIn = async (data) => {
  const res = await api.post('/admin/manual-booking', data);
  return res.data;
};

export default api;
