import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { BookingForm } from '../components/BookingForm';
import {
  ArrowRight,
  ShieldCheck,
  Video,
  Award,
  Clock,
  CheckCircle2,
  Sun,
  Moon,
  Star,
  TrendingUp,
  Zap,
  GraduationCap,
  BookOpen,
  Radio,
  Sparkles,
} from 'lucide-react';

const studioServices = [
  {
    icon: Video,
    tag: 'For Creators & Educators',
    badge: 'YouTube & Socials',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    title: 'YouTube Video Production',
    desc: 'Record ultra-sharp 4K educational videos, YouTube lectures, explainers, and reels with natural eye-level Sony optics and teleprompter support.',
    points: [
      'Sony 4K UHD broadcast optics',
      'Teleprompter with script scrolling',
      'Dual wireless noise-free lapel mics',
    ],
  },
  {
    icon: GraduationCap,
    tag: 'For Schools & Coaching',
    badge: 'Smart Interactive',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    title: 'Digital Classroom Recording',
    desc: 'Deliver classroom-feel lectures on our huge 86" 4K smartboard. Smooth digital handwriting, dual-pen math solving, and PDF/PPT annotations.',
    points: [
      '86" 4K UHD interactive touch board',
      'Zero parallax anti-glare toughened glass',
      'Direct PDF, PPT & diagram import',
    ],
  },
  {
    icon: BookOpen,
    tag: 'For EdTech & App Owners',
    badge: 'Structured Courses',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    title: 'Online Courses & LMS Content',
    desc: 'Film multi-hour structured video courses for your mobile application, LMS, or portal in an acoustically treated, whisper-quiet chamber.',
    points: [
      'Acoustic soundproof chamber (NRC 0.85)',
      'Organized lecture modules & chapters',
      'Instant raw footage export on SSD',
    ],
  },
  {
    icon: Radio,
    tag: 'For Seminars & Webinars',
    badge: 'Live Broadcast',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    title: 'Live Streaming & Webinars',
    desc: 'Host interactive live sessions, YouTube Live broadcasts, zoom webinars, and mock interviews with high-speed fiber and pro audio mixing.',
    points: [
      'High-speed redundant fiber connection',
      'Multi-channel live audio mixer',
      'Dedicated on-site technical support',
    ],
  },
];

export const HomePage = ({ onBookingSuccess, onNavigate, onOpenBookingModal }) => {
  const [preselectedSlotId, setPreselectedSlotId] = useState(null);
  const [preselectedPurpose, setPreselectedPurpose] = useState('');

  const handleSelectPlan = (slotId) => {
    setPreselectedSlotId(slotId);
    if (onOpenBookingModal) {
      onOpenBookingModal(slotId);
    } else {
      const bookingEl = document.getElementById('booking');
      if (bookingEl) {
        bookingEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectService = (serviceTitle) => {
    setPreselectedPurpose(serviceTitle);
    if (onOpenBookingModal) {
      onOpenBookingModal(null, serviceTitle);
    } else {
      const bookingEl = document.getElementById('booking');
      if (bookingEl) {
        bookingEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <Hero onOpenBookingModal={onOpenBookingModal} />

      {/* Trust Strip (Ultra-Compact, Sleek & Modern) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white border border-emerald-100/90 rounded-xl sm:rounded-2xl py-2 sm:py-2.5 px-2 sm:px-4 shadow-2xs grid grid-cols-2 md:grid-cols-4 items-center text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="py-1 px-2">
            <span className="text-base sm:text-xl font-extrabold text-slate-900 block leading-tight">500+</span>
            <span className="text-[10px] sm:text-[11px] text-emerald-800 font-semibold block">Classes Recorded</span>
          </div>

          <div className="py-1 px-2">
            <span className="text-base sm:text-xl font-extrabold text-slate-900 block leading-tight">4K UHD</span>
            <span className="text-[10px] sm:text-[11px] text-emerald-800 font-semibold block">Broadcast Standard</span>
          </div>

          <div className="py-1 px-2">
            <div className="inline-flex items-center justify-center gap-1 leading-tight">
              <span className="text-amber-500 font-black text-xs sm:text-sm">★</span>
              <span className="text-base sm:text-xl font-extrabold text-slate-900">4.9 / 5.0</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-amber-800 font-semibold block">Creator Rating</span>
          </div>

          <div className="py-1 px-2">
            <span className="text-base sm:text-xl font-extrabold text-emerald-700 block leading-tight">₹3,999</span>
            <span className="text-[10px] sm:text-[11px] text-emerald-800 font-semibold block">Starting Price</span>
          </div>
        </div>
      </section>

      {/* ================= 4 CORE STUDIO SERVICES SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Every Creator & Educator
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed px-2 sm:px-0">
            High-tech infrastructure customized for modern educational, YouTube, and digital course creation workflows.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {studioServices.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                onClick={() => handleSelectService(svc.title)}
                className="bg-white border border-emerald-100/90 hover:border-emerald-400 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                title={`Click to book for ${svc.title}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full border ${svc.badgeBg}`}>
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {svc.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-600 block mb-2">
                    {svc.tag}
                  </span>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {svc.desc}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                    {svc.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100/80">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectService(svc.title);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Book for This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= TWO PREMIUM RECORDING PLANS SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Studio Recording Plans</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Studio Recording Slot
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed px-2 sm:px-0">
            Transparent fixed pricing with full studio access, 86" 4K interactive smartboard, broadcast optics, and instant footage transfer.
          </p>
        </div>

        {/* 2 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          
          {/* Plan 1: Morning Slot */}
          <div className="bg-white border-2 border-emerald-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group">
            <div className="space-y-3.5">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sun className="w-4 h-4 text-emerald-700" />
                  <span>Morning Slot</span>
                </span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  7 Hours Studio Access
                </span>
              </div>

              {/* Price & Timing */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">₹3,999</span>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">/ 7-Hour Session</span>
                </div>
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 font-semibold text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>05:00 AM – 12:00 PM (Morning Time)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-900 font-bold mt-2 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
                  <TrendingUp className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Best Value: Only ₹571 / hour</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Subah ke shant vatavaran me marathon classes, 10-15 lecture batches & crash course recording ke liye best value slot.
              </p>

              {/* Feature Checklist */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>86" 4K Smart Interactive Touch Board</strong> with dual-pen support</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Sony 4K UHD Broadcast Optics</strong> at natural presenter eye-level</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Wireless Lapel Mics + Audio Mixer</strong> for zero echo or noise</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Acoustic Sound-Proof Chamber</strong> with whisper-quiet AC</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Instant High-Speed SSD Video Handover</strong> post-session</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => handleSelectPlan('slot-5-12')}
              className="mt-6 w-full py-3 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm md:text-base transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer group-hover:translate-y-[-1px]"
            >
              <span>Book Morning Slot (₹3,999)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 2: Evening Slot (Featured Card) */}
          <div className="bg-white border-2 border-emerald-500 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden ring-4 ring-amber-400/20 group">
            {/* Top Right Ribbon (Golden Accent) */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-[11px] font-black px-3.5 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>Prime Evening</span>
            </div>

            <div className="space-y-3.5">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Moon className="w-4 h-4 text-emerald-700" />
                  <span>Evening Slot</span>
                </span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  6 Hours Studio Access
                </span>
              </div>

              {/* Price & Timing */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">₹4,999</span>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">/ 6-Hour Session</span>
                </div>
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 font-semibold text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>03:00 PM – 09:00 PM (Prime Evening)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-900 font-bold mt-2 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
                  <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Most Popular for Teachers & Working Educators</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                School ya daytime commitments ke baad prime recording time. Full 3-point softbox illumination aur pro operator assistance.
              </p>

              {/* Feature Checklist */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>3-Point Studio Softbox & Rim Lighting</strong> (CRI 96+ zero shadow)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>86" 4K Smartboard + Teleprompter Ready</strong> setup</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Sennheiser / Rode Broadcast Audio</strong> with noise isolation</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Engineered Acoustic Chamber</strong> for crisp presenter vocals</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Instant High-Bitrate Export</strong> directly to SSD or Drive</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => handleSelectPlan('slot-3-9')}
              className="mt-6 w-full py-3 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm md:text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group-hover:translate-y-[-1px]"
            >
              <span>Book Evening Slot (₹4,999)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ================= INTER-SECTION FEATURE BANNER (DESKTOP & MOBILE RESPONSIVE) ================= */}
      <section className="max-w-[1520px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-6">
        <div
          onClick={() => (onOpenBookingModal ? onOpenBookingModal() : null)}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-emerald-100/90 bg-white group cursor-pointer transition-all"
          title="Click to Book Studio Slot"
        >
          <picture className="w-full block">
            {/* Desktop Banner (Landscape) */}
            <source
              media="(min-width: 768px)"
              srcSet="/feature-banner-desktop.png"
            />
            {/* Mobile Banner (Portrait / Poster) */}
            <img
              src="/feature-banner-mobile.png"
              alt="Professional Classroom Studio Rental - Ishan Digital Academy"
              className="w-full h-auto object-cover max-h-[580px] md:max-h-[660px] mx-auto select-none group-hover:scale-[1.01] transition-transform duration-500"
              loading="lazy"
            />
          </picture>
        </div>
      </section>

      {/* Main Core Slot Booking Section */}
      <BookingForm
        onBookingSuccess={onBookingSuccess}
        preselectedSlotId={preselectedSlotId}
        preselectedPurpose={preselectedPurpose}
      />

      {/* Studio Banner / Call to Action leading to Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-emerald-100 backdrop-blur-md">
              Professional Studio Equipment
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Curious About Our 4K Smartboard & Camera Setup?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Explore the full technical specifications of our 86" interactive smartboards,
              flicker-free studio lighting, and audio gear on our Services page.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => onNavigate('/services')}
              className="px-5 py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-xs hover:bg-emerald-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Studio Desk Contact</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
