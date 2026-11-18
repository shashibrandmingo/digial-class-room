import React from 'react';
import {
  CheckCircle2,
  Target,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Users,
  Award,
  Video,
} from 'lucide-react';

export const AboutPage = ({ onNavigate, onOpenBookingModal }) => {
  const pillars = [
    {
      title: 'Zero Studio Capital Investment',
      desc: 'Setting up an acoustic studio with interactive smartboards, 4K camera gear, and lighting costs ₹8–10 Lakhs. With Ishan Digital Academy, you pay only for the exact hours you record.',
    },
    {
      title: 'Turn-key Plug & Play Simplicity',
      desc: 'No technical headache with camera framing, microphone batteries, or lighting angles. Everything is pre-configured and ready the moment you walk into the room.',
    },
    {
      title: 'Dedicated Technical Assistant On-Site',
      desc: 'An experienced studio assistant is present on-site during your recording slot to assist with presentation files, monitor audio levels, and manage equipment.',
    },
    {
      title: '100% Ownership Of Your Raw Content',
      desc: 'You keep 100% of your copyright and videos. Handover is immediate onto your high-speed SSD or drive directly after your slot concludes.',
    },
  ];

  return (
    <div className="py-10 space-y-14 animate-in fade-in duration-300 bg-[#fcfffd]">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          <span>About Ishan Digital Academy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          शिक्षा का डिजिटल भविष्य
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Empowering passionate teachers, educators, and creators with ready-to-use,
          broadcast-grade recording infrastructure.
        </p>
      </section>

      {/* Main Vision Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 text-center">
            <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-xs max-w-sm mx-auto">
              <img
                src="/logo.jpg"
                alt="Ishan Digital Academy"
                className="w-44 h-44 mx-auto object-contain drop-shadow-sm mb-4"
              />
              <h3 className="text-lg font-extrabold text-slate-900">
                Ishan Digital Academy
              </h3>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                शिक्षा का डिजिटल भविष्य
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 text-base block">500+</span>
                  <span className="text-slate-500 text-[11px]">Lectures Recorded</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-base block">4K UHD</span>
                  <span className="text-slate-500 text-[11px]">Broadcast Standard</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why We Built Ishan Digital Academy
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In today's digital era, students and learners expect world-class visual clarity,
              crisp studio audio, and engaging interactive smartboard teaching. However, building
              and maintaining a private recording setup is prohibitively expensive and technically complex
              for individual teachers and creators.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Ishan Digital Academy</strong> bridges this gap. We provide fully equipped,
              soundproofed digital classrooms on flexible, affordable slot reservations.
              Whether you are preparing a YouTube course, competitive exam series (UPSC, NEET, JEE),
              or corporate workshops, our studio provides the professional platform you deserve.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <div className="bg-white border border-emerald-100 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Privacy & Dedicated Studio Access</span>
              </div>
              <div className="bg-white border border-emerald-100 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>High-Definition 86" Touch Smartboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">What Sets Us Apart</h2>
          <p className="text-xs text-slate-600 mt-1">Built by creators, for educators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs hover:border-emerald-300 transition-all space-y-2"
            >
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{item.title}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Ready to Record Your Next Masterclass?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Check real-time slot availability on our booking portal and reserve your session instantly.
          </p>
          <button
            onClick={() => onOpenBookingModal ? onOpenBookingModal() : onNavigate('/')}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Go to Slot Booking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
