import rateLimit from 'express-rate-limit';

// General API rate limiter: 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for booking initiation: 20 per 10 minutes
export const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many booking attempts. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
