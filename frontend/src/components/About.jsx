import React from 'react';
import { CheckCircle2, Target, HeartHandshake, Zap } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-16 border-b border-emerald-100 bg-[#f3faf6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Image / Brand Visual */}
          <div className="lg:col-span-5 text-center">
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm max-w-sm mx-auto">
              <img
                src="/logo.jpg"
                alt="Ishan Digital Academy"
                className="w-48 h-48 mx-auto object-contain drop-shadow-sm mb-4"
              />
              <h3 className="text-lg font-extrabold text-slate-900">
                Ishan Digital Academy
              </h3>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                शिक्षा का डिजिटल भविष्य
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-around text-center text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">500+</span>
                  <span className="text-slate-500 text-[11px]">Lectures Recorded</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">4K UHD</span>
                  <span className="text-slate-500 text-[11px]">Broadcast Quality</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission & Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>About Our Studio</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Empowering Teachers & Creators With State-of-the-Art Recording Infrastructure
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Ishan Digital Academy</strong> provides educators, YouTubers, coaching institutes,
              and content creators a ready-to-use, plug-and-play digital classroom recording environment.
              No need to spend lakhs setting up acoustic rooms, lighting grids, or expensive interactive panels.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                'Plug & Play: Just bring your laptop or USB drive',
                'Pre-configured 4K cameras & professional lapel mics',
                'Dedicated on-site technical studio assistant',
                'Flexible 6-hour & 7-hour uninterrupted slots',
                'High-speed fiber internet for live streaming & webinars',
                'Comfortable green room & teacher lounge',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
