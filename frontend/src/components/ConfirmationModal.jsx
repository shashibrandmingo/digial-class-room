import React, { useEffect } from 'react';
import {
  CheckCircle,
  Mail,
  Calendar,
  Clock,
  Printer,
  X,
  HardDrive,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ConfirmationModal = ({ booking, onClose }) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-emerald-100 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/10 hover:bg-black/25 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-xl font-extrabold tracking-tight">Booking Confirmed!</h3>
          <p className="text-emerald-100 text-xs mt-1">
            Your studio recording slot is locked & reserved.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Email Notification Alert */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
            <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-emerald-900 block">Confirmation Email Sent!</span>
              <span className="text-emerald-800">
                A formal pass & receipt has been sent to{' '}
                <strong className="text-emerald-950 font-bold">{booking.clientEmail}</strong>.
              </span>
            </div>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-[#f8fcf9] border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Booking Reference:</span>
              <span className="font-mono font-bold text-emerald-700">{booking.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Client Name:</span>
              <span className="font-semibold text-slate-900">{booking.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Recording Date:</span>
              <span className="font-semibold text-slate-900">{booking.bookingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Slot & Timing:</span>
              <span className="font-semibold text-emerald-700">
                {booking.slotName} ({booking.slotTime})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment ID:</span>
              <span className="font-mono text-slate-600 text-[11px]">{booking.paymentId}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
              <span className="text-slate-800">Amount Paid:</span>
              <span className="text-emerald-700">₹{booking.amount}</span>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <span>Studio Day Guidelines:</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
              <li>Please reach 15 minutes before the scheduled time.</li>
              <li>Carry a Pen Drive / SSD (min 64 GB) for your high-res video files.</li>
              <li>Interactive 4K Smartboard, teleprompter, and lapel mics will be set up.</li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" /> Print / Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
