import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 bg-white border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Ishan Digital Academy
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Have questions about equipment, bulk studio packages, or custom slot timings? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#f8fdfa] border border-emerald-100 rounded-2xl p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Studio Address</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Studio 402, 4th Floor, Creator Hub, Near Metro Pillar 124, MG Road, City Center
                </p>
              </div>
            </div>

            <div className="bg-[#f8fdfa] border border-emerald-100 rounded-2xl p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Phone & WhatsApp Support</h4>
                <p className="text-xs text-slate-600 mt-1">+91 98765 43210 / +91 91234 56789</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Available 7:00 AM - 10:00 PM</p>
              </div>
            </div>

            <div className="bg-[#f8fdfa] border border-emerald-100 rounded-2xl p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Email Inquiry</h4>
                <p className="text-xs text-slate-600 mt-1">bookings@ishandigitalacademy.com</p>
                <p className="text-[11px] text-slate-500">Quick response within 2 hours</p>
              </div>
            </div>

            <div className="bg-[#f8fdfa] border border-emerald-100 rounded-2xl p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Studio Operating Hours</h4>
                <p className="text-xs text-slate-600 mt-1">Monday – Sunday (All 7 Days)</p>
                <p className="text-[11px] text-emerald-700 font-semibold">Morning: 5 AM - 12 PM | Evening: 3 PM - 9 PM</p>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Inquiry Form */}
          <div className="lg:col-span-7 bg-[#f8fdfa] border border-emerald-100 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1">Send a Message to Studio Manager</h3>
            <p className="text-xs text-slate-500 mb-5">
              Fill out the details below and our team will get back to you promptly
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Message Received!</h4>
                <p className="text-xs text-emerald-800">
                  Thank you for contacting Ishan Digital Academy. Our studio manager will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amit Kumar"
                      value={msg.name}
                      onChange={(e) => setMsg({ ...msg, name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={msg.phone}
                      onChange={(e) => setMsg({ ...msg, phone: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. amit@gmail.com"
                    value={msg.email}
                    onChange={(e) => setMsg({ ...msg, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message / Query</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your course, preferred dates, or special studio requirements..."
                    value={msg.message}
                    onChange={(e) => setMsg({ ...msg, message: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
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
      </div>
    </section>
  );
};
