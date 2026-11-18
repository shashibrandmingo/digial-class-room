import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  ArrowRight,
  Loader2,
  Mail,
  User,
  Phone,
  BookOpen,
  Check,
} from 'lucide-react';
import {
  fetchSlotAvailability,
  initiateBookingHold,
  confirmPaymentVerification,
} from '../api';

export const BookingForm = ({ onBookingSuccess, preselectedSlotId, preselectedPurpose }) => {
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(preselectedSlotId || null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');

  // Update selectedSlotId whenever preselectedSlotId changes
  useEffect(() => {
    if (preselectedSlotId) {
      setSelectedSlotId(preselectedSlotId);
    }
  }, [preselectedSlotId]);

  // Form Fields
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    purpose: preselectedPurpose || 'EdTech / YouTube Course Recording',
  });

  // Update purpose whenever preselectedPurpose changes
  useEffect(() => {
    if (preselectedPurpose) {
      setFormData((prev) => ({ ...prev, purpose: preselectedPurpose }));
    }
  }, [preselectedPurpose]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    loadAvailability(selectedDate);
  }, [selectedDate]);

  const loadAvailability = async (date) => {
    setLoadingSlots(true);
    setSlotError('');
    if (!preselectedSlotId) {
      setSelectedSlotId(null);
    }
    try {
      const data = await fetchSlotAvailability(date);
      if (data.success) {
        setSlots(data.slots);
        if (preselectedSlotId) {
          const match = data.slots.find((s) => s.id === preselectedSlotId && s.isBookable);
          if (match) setSelectedSlotId(preselectedSlotId);
        }
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
      setSlotError('Unable to load slot availability. Please check server connection.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setActionError('');
  };

  const addDays = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
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
      setActionError('Please choose an available recording slot first.');
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
        setActionError(holdRes.message || 'Slot could not be held.');
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
          description: `Studio Slot Reservation (${selectedDate})`,
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
        console.log('⚡ Running in Test Mode (Instant Simulated Payment)');
        setTimeout(async () => {
          await completeVerification({
            razorpay_order_id: orderId,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: 'test_signature_valid',
          });
        }, 1200);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setActionError(
        err.response?.data?.message ||
          'Failed to proceed with booking. The slot might have been booked just now.'
      );
      setIsSubmitting(false);
      loadAvailability(selectedDate);
    }
  };

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  return (
    <section id="booking" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Left Column: Visual Guide & Detailed Slot Info */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 1: Visual Date Selector */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">Select Recording Date</h2>
                  <p className="text-[11px] sm:text-xs text-slate-500">Pick any upcoming date to check live availability</p>
                </div>
              </div>
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>

            {/* Quick Date Buttons */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
              {[
                { label: 'Today', date: getTodayStr() },
                { label: 'Tomorrow', date: addDays(1) },
                { label: 'Day After', date: addDays(2) },
                { label: 'In 3 Days', date: addDays(3) },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleDateChange(item.date)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                    selectedDate === item.date
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50/70 text-slate-700 hover:bg-emerald-100 border border-emerald-200/80'
                  }`}
                >
                  {item.label} ({new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="date"
                min={getTodayStr()}
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Step 2: Visual Slot Cards */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">Studio Time Slots</h2>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Showing status for{' '}
                    <strong className="text-emerald-700">
                      {new Date(selectedDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </strong>
                  </p>
                </div>
              </div>
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>

            {loadingSlots ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                <span className="text-xs">Checking real-time slot availability...</span>
              </div>
            ) : slotError ? (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{slotError}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const isAvailable = slot.isBookable;

                  let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                  let statusText = 'Available Now';

                  if (slot.status === 'CONFIRMED') {
                    badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
                    statusText = 'Booked';
                  } else if (slot.status === 'BLOCKED_BY_ADMIN') {
                    badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
                    statusText = 'Under Maintenance';
                  } else if (slot.status === 'HELD') {
                    badgeBg = 'bg-yellow-100 text-yellow-900 border-yellow-300';
                    statusText = 'Held for Checkout';
                  }

                  return (
                    <div
                      key={slot.id}
                      onClick={() => {
                        if (isAvailable) setSelectedSlotId(slot.id);
                      }}
                      className={`relative rounded-xl border p-3.5 sm:p-4 transition-all flex flex-col justify-between cursor-pointer ${
                        !isAvailable
                          ? 'opacity-65 cursor-not-allowed bg-slate-50 border-slate-200'
                          : isSelected
                          ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-2xs'
                      }`}
                    >
                      {/* Top Row: Badges & Price */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border ${badgeBg}`}
                          >
                            {statusText}
                          </span>
                          <span className="text-[10px] sm:text-xs font-semibold text-emerald-800">
                            {slot.durationHours} Hours Studio Access
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">
                            ₹{slot.price}
                          </span>
                          <span className="text-[10px] text-slate-500 block">All Inclusive</span>
                        </div>
                      </div>

                      {/* Title & Time */}
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900">{slot.name}</h3>
                        <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{slot.timeRange}</span>
                        </p>
                        <p className="text-xs text-slate-600 pt-0.5 leading-relaxed">
                          {slot.description}
                        </p>
                      </div>

                      {/* Bottom Selection Bar */}
                      {isAvailable ? (
                        <div
                          className={`mt-3 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {isSelected ? '✓ Selected for Booking' : 'Tap to Choose This Slot'}
                        </div>
                      ) : (
                        <div className="mt-2.5 pt-2 border-t border-slate-200 text-xs text-rose-600 font-medium">
                          {slot.status === 'CONFIRMED' ? (
                            <span>⚠️ Already booked for this date. Please choose another date or slot.</span>
                          ) : slot.status === 'BLOCKED_BY_ADMIN' ? (
                            <span>🛠️ {slot.reason || 'Closed for maintenance.'}</span>
                          ) : (
                            <span>⏳ Someone is currently in checkout for this slot.</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Complete Checkout Form (With Date & Slot Chooser Inside!) */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-6 shadow-xs sticky top-24">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Client Details & Checkout</h2>
                <p className="text-xs text-slate-500">Select date, slot & your contact information</p>
              </div>
            </div>

            {actionError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{actionError}</span>
              </div>
            )}

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              {/* Option 1: Date Chooser Directly Inside Form */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Recording Date
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
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
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Option 2: Studio Time Slot Selector Directly Inside Form */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Studio Time Slot
                  </span>
                  {selectedSlot ? (
                    <span className="text-[11px] font-bold text-emerald-700">
                      ₹{selectedSlot.price} Selected
                    </span>
                  ) : (
                    <span className="text-[11px] text-rose-600 font-medium">* Required</span>
                  )}
                </label>

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
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          !isAvailable
                            ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 text-slate-900 shadow-xs'
                            : 'bg-[#f8fdfa] border-slate-300 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
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
                            <div className="text-xs font-bold text-slate-900">
                              {slot.name}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-medium">
                              {slot.timeRange} ({slot.durationHours} Hours)
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-extrabold text-slate-900 block">
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
              </div>

              {/* Personal Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Full Name
                </label>
                <input
                  type="text"
                  name="clientName"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Mobile Number
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" /> Email Address (For Receipt & Slot Pass)
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  required
                  placeholder="e.g. rahul@example.com"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Recording Purpose / Subject
                </label>
                <input
                  type="text"
                  name="purpose"
                  placeholder="e.g. Math Lectures / UPSC Series / YouTube"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Order Summary Box */}
              <div className="bg-[#f0fbf5] border border-emerald-200/80 rounded-xl p-4 space-y-2 mt-5">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Reservation Summary
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Selected Date:</span>
                  <span className="font-semibold text-slate-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Selected Slot:</span>
                  <span className="font-semibold text-emerald-800">
                    {selectedSlot ? `${selectedSlot.name} (${selectedSlot.timeRange})` : 'None Selected'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Amenities:</span>
                  <span className="text-emerald-700 font-semibold">4K + Mic + Smartboard Included</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-lg text-emerald-700 font-extrabold">
                    ₹{selectedSlot ? selectedSlot.price : 0}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedSlotId}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                  !selectedSlotId
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isSubmitting
                    ? 'bg-emerald-700 cursor-wait'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {selectedSlot
                        ? `Pay ₹${selectedSlot.price} & Reserve Slot`
                        : 'Select a Slot to Proceed'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5 pt-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>100% Encrypted via Razorpay • Instant Confirmation Email</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
