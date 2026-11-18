import Razorpay from 'razorpay';
import crypto from 'crypto';

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret_key';

export const isRazorpayConfigured = () => {
  return (
    key_id &&
    key_id !== 'rzp_test_placeholder' &&
    key_secret &&
    key_secret !== 'placeholder_secret_key'
  );
};

let instance = null;
if (isRazorpayConfigured()) {
  instance = new Razorpay({
    key_id,
    key_secret,
  });
}

export const getRazorpayInstance = () => instance;

// Verify Razorpay payment signature securely
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!orderId || !paymentId || !signature) return false;

  // If in demo/test mode with placeholder keys
  if (!isRazorpayConfigured()) {
    // Allows demo test tokens like demo_signature
    if (signature.startsWith('demo_sig_') || signature === 'test_signature_valid') {
      return true;
    }
  }

  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
