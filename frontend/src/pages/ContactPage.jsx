import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Studio Visit & Recording Query',
    message: '',
  });

  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'Do I need to bring my own laptop or camera?',
      a: 'No! The studio is 100% turnkey. We provide Sony 4K broadcast cameras, Sennheiser/Rode wireless lapel mics, and an 86" interactive smartboard pre-connected with presentations. You only need to carry your presentation on a Pen Drive or your laptop if you prefer your own device.',
    },
    {
      q: 'How do I take my recorded videos after the session?',
      a: 'Immediately after your slot finishes, our studio technician transfers the raw 4K / 1080p MP4 or ProRes footage directly onto your USB drive or high-speed portable SSD. Handover is instantaneous.',
    },
    {
      q: 'What are the available slots and their pricing?',
      a: 'We have two fixed daily slots: Morning Slot (05:00 AM - 12:00 PM) for ₹3,999 (7 Hours), and Evening Slot (03:00 PM - 09:00 PM) for ₹4,999 (6 Hours). Rates are all-inclusive with zero hidden fees.',
    },
    {
      q: 'Can I visit and inspect the studio before booking?',
      a: 'Yes, absolutely! You can contact our studio desk via phone (+91 98765 43210) or submit the message form below to schedule a 15-minute studio walkthrough.',
    },
  ];

  return (
    <div className="py-10 space-y-14 animate-in fade-in duration-300">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>We'd Love To Hear From You</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact Ishan Digital Academy
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Reach out for studio walk-throughs, custom batch inquiries, technical gear questions,
          or general booking assistance.
        </p>
      </section>

      {/* Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Studio Location</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Studio 402, 4th Floor, Creator Hub, Near Metro Pillar 124, MG Road, City Center
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  Walking distance from Metro Station • Dedicated parking available
                </span>
              </div>
            </div>

            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Phone & WhatsApp Desk</h4>
                <p className="text-sm font-bold text-slate-800 mt-1">+91 98765 43210</p>
                <p className="text-xs text-slate-600">+91 91234 56789</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">Available 7:00 AM – 10:00 PM</p>
              </div>
            </div>

            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Official Email</h4>
                <p className="text-sm text-slate-800 font-medium mt-1">bookings@ishandigitalacademy.com</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Average reply time within 2 hours</p>
              </div>
            </div>

            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Recording Slots & Days</h4>
                <p className="text-xs text-slate-600 mt-1 font-semibold">Open All 7 Days (Mon – Sun)</p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Slot 1: 05:00 AM – 12:00 PM • Slot 2: 03:00 PM – 09:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-3xl p-8 shadow-xs">
            <div className="mb-6">
              <h3 className="font-extrabold text-xl text-slate-900">Send an Inquiry or Schedule a Tour</h3>
              <p className="text-xs text-slate-500 mt-1">
                Have a question or looking for customized monthly booking? Let us know below.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-base text-emerald-900">Inquiry Delivered Successfully!</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you for contacting Ishan Digital Academy. Our studio manager will call you back
                  on <strong className="font-bold">{msg.phone}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-emerald-700 underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Verma"
                      value={msg.name}
                      onChange={(e) => setMsg({ ...msg, name: e.target.value })}
                      className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={msg.phone}
                      onChange={(e) => setMsg({ ...msg, phone: e.target.value })}
                      className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rajesh@gmail.com"
                      value={msg.email}
                      onChange={(e) => setMsg({ ...msg, email: e.target.value })}
                      className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Inquiry Subject
                    </label>
                    <select
                      value={msg.subject}
                      onChange={(e) => setMsg({ ...msg, subject: e.target.value })}
                      className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="Studio Visit & Recording Query">Studio Visit / Recording Query</option>
                      <option value="Bulk Course Booking Package">Bulk Course Booking Package</option>
                      <option value="Live Webinar / Streaming Setup">Live Webinar / Streaming Setup</option>
                      <option value="Other Assistance">Other Assistance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Message / Requirements
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the subject, preferred recording dates, or any special equipment questions..."
                    value={msg.message}
                    onChange={(e) => setMsg({ ...msg, message: e.target.value })}
                    className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Studio Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-emerald-600 font-extrabold text-base">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
