import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  User,
  Phone,
  Mail,
  BookOpen,
  Check,
} from 'lucide-react';
import {
  fetchSlotAvailability,
  initiateBookingHold,
  confirmPaymentVerification,
} from '../api';

export const BookingModal = ({
  isOpen,
  onClose,
  onBookingSuccess,
  initialSlotId,
  initialPurpose,
}) => {
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(initialSlotId || null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    purpose: initialPurpose || 'Course / YouTube Lecture Recording',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      if (initialSlotId) {
        setSelectedSlotId(initialSlotId);
      }
      if (initialPurpose) {
        setFormData((prev) => ({ ...prev, purpose: initialPurpose }));
      }
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialSlotId, initialPurpose]);

  // Load availability when modal opens or date changes
  useEffect(() => {
    if (isOpen) {
      loadAvailability(selectedDate);
    }
  }, [isOpen, selectedDate]);

  const loadAvailability = async (date) => {
    setLoadingSlots(true);
    setSlotError('');
    if (!initialSlotId) {
      setSelectedSlotId(null);
    }
    try {
      const data = await fetchSlotAvailability(date);
      if (data.success) {
        setSlots(data.slots);
        if (initialSlotId) {
          const match = data.slots.find((s) => s.id === initialSlotId && s.isBookable);
          if (match) setSelectedSlotId(initialSlotId);
        }
      }
    } catch (err) {
      console.error('Failed to load slots in modal:', err);
      setSlotError('Unable to load slot availability. Please check server.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setActionError('');

    if (!selectedSlotId) {
      setActionError('Please select a studio time slot.');
      return;
    }

    if (!formData.clientName.trim() || !formData.clientEmail.trim() || !formData.clientPhone.trim()) {
      setActionError('Please fill in your name, email, and 10-digit mobile number.');
      return;
    }

    if (formData.clientPhone.trim().length < 10) {
      setActionError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const holdRes = await initiateBookingHold({
        bookingDate: selectedDate,
        slotId: selectedSlotId,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        purpose: formData.purpose,
      });

      if (!holdRes.success) {
        setActionError(holdRes.message || 'Slot could not be reserved.');
        setIsSubmitting(false);
        return;
      }

      const { bookingId, orderId, amount, keyId, isDemoMode } = holdRes;

      const completeVerification = async (paymentDetails) => {
        try {
          const verifyRes = await confirmPaymentVerification({
            bookingId,
            razorpay_order_id: paymentDetails.razorpay_order_id || orderId,
            razorpay_payment_id: paymentDetails.razorpay_payment_id,
            razorpay_signature: paymentDetails.razorpay_signature,
          });

          if (verifyRes.success) {
            onClose();
            onBookingSuccess(verifyRes.booking);
          } else {
            setActionError(verifyRes.message || 'Payment confirmation failed.');
          }
        } catch (vErr) {
          setActionError(vErr.response?.data?.message || 'Verification failed on server.');
        } finally {
          setIsSubmitting(false);
        }
      };

      if (typeof window.Razorpay !== 'undefined' && !isDemoMode && keyId !== 'rzp_test_placeholder') {
        const options = {
          key: keyId,
          amount: amount * 100,
          currency: 'INR',
          name: 'Ishan Digital Academy',
          description: `Recording Slot (${selectedDate})`,
          order_id: orderId,
          prefill: {
            name: formData.clientName,
            email: formData.clientEmail,
            contact: formData.clientPhone,
          },
          theme: {
            color: '#059669',
          },
          handler: async function (response) {
            await completeVerification(response);
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              setActionError('Payment window closed. Slot hold will expire in 10 minutes.');
              loadAvailability(selectedDate);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setIsSubmitting(false);
          setActionError(`Payment Failed: ${resp.error.description}`);
        });
        rzp.open();
      } else {
        setTimeout(async () => {
          await completeVerification({
            razorpay_order_id: orderId,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: 'test_signature_valid',
          });
        }, 1200);
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          'Failed to proceed with booking. Please choose another date or slot.'
      );
      setIsSubmitting(false);
      loadAvailability(selectedDate);
    }
  };

  if (!isOpen) return null;

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-emerald-100 rounded-2xl sm:rounded-3xl max-w-4xl w-full shadow-2xl relative flex flex-col text-slate-800 max-h-[94vh] md:max-h-none overflow-hidden">
        {/* Modal Header (Sticky on mobile) */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8fdfa] flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Book Recording Slot
              </h3>
              <p className="text-[11px] sm:text-xs text-emerald-700 font-semibold">
                Ishan Digital Academy • Instant Online Reservation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Error if any */}
        {actionError && (
          <div className="mx-4 sm:mx-6 mt-3 p-2.5 sm:p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Modal Content: Scrollable on mobile, completely visible without scroll on desktop! */}
        <div className="overflow-y-auto md:overflow-visible flex-1">
          <form onSubmit={handleProceedToPayment} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
              {/* PART 1 (LEFT COLUMN): Date & Slot Selection */}
              <div className="space-y-3.5 bg-[#f8fdfa] p-3.5 sm:p-4.5 rounded-2xl border border-emerald-100/80">
                {/* Date Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> 1. Select Recording Date
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {new Date(selectedDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </label>
                  <input
                    type="date"
                    min={getTodayStr()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Slots List */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> 2. Choose Time Slot
                    </span>
                    {selectedSlot ? (
                      <span className="text-[11px] font-extrabold text-emerald-700">
                        ₹{selectedSlot.price} Selected
                      </span>
                    ) : (
                      <span className="text-[11px] text-rose-600 font-medium">* Click to select</span>
                    )}
                  </label>

                  {loadingSlots ? (
                    <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Checking live availability...</span>
                    </div>
                  ) : slotError ? (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                      {slotError}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {slots.map((slot) => {
                        const isSelected = selectedSlotId === slot.id;
                        const isAvailable = slot.isBookable;

                        return (
                          <div
                            key={slot.id}
                            onClick={() => {
                              if (isAvailable) setSelectedSlotId(slot.id);
                            }}
                            className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                              !isAvailable
                                ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                                : isSelected
                                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-slate-400 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900">{slot.name}</div>
                                <div className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold">
                                  {slot.timeRange} • {slot.durationHours} Hours
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                                ₹{slot.price}
                              </span>
                              <span
                                className={`text-[10px] font-bold ${
                                  slot.status === 'CONFIRMED'
                                    ? 'text-rose-600'
                                    : slot.status === 'BLOCKED_BY_ADMIN'
                                    ? 'text-amber-600'
                                    : 'text-emerald-700'
                                }`}
                              >
                                {slot.status === 'CONFIRMED'
                                  ? 'Booked'
                                  : slot.status === 'BLOCKED_BY_ADMIN'
                                  ? 'Maintenance'
                                  : 'Available'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* PART 2 (RIGHT COLUMN): Client Details & Instant Checkout */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="clientPhone"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={formData.clientPhone}
                      onChange={handleInputChange}
                      className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" /> Email (For Pass)
                    </label>
                    <input
                      type="email"
                      name="clientEmail"
                      required
                      placeholder="rahul@gmail.com"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Subject / Purpose
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    placeholder="e.g. UPSC Course / YouTube Series"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Compact Summary Box */}
                <div className="bg-[#f0fbf5] border border-emerald-200/80 rounded-xl p-2.5 sm:p-3 text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Selected Slot:</span>
                    <span className="font-bold text-slate-900">
                      {selectedSlot ? `${selectedSlot.name}` : 'None Selected'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-emerald-200">
                    <span className="font-bold text-slate-900">Total Payable:</span>
                    <span className="text-emerald-700 text-base sm:text-lg font-extrabold">
                      ₹{selectedSlot ? selectedSlot.price : 0}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSlotId}
                  className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    !selectedSlotId
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : isSubmitting
                      ? 'bg-emerald-700 cursor-wait'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {selectedSlot
                          ? `Pay ₹${selectedSlot.price} & Reserve Slot`
                          : 'Choose A Slot to Continue'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1 pt-0.5 pb-2">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Razorpay Secured • Instant Email Confirmation</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
