import React, { useState, useEffect, useRef } from 'react';
import {
  MonitorPlay,
  Mic,
  Sun,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
} from 'lucide-react';

export const Hero = ({ onOpenBookingModal }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);

  const bannerSlides = [
    {
      id: 1,
      title: 'Ishan Digital Academy Studio Rental',
      desktopImg: '/banner-desktop-1.png',
      mobileImg: '/banner-mobile-1.png',
      alt: 'Ishan Digital Academy Recording Studio Setup',
    },
    {
      id: 2,
      title: 'Professional Classroom Studio Rental',
      desktopImg: '/banner-desktop-2.png',
      mobileImg: '/banner-mobile-2.png',
      alt: 'Professional 4K Studio Equipment and Smartboard',
    },
  ];

  // Auto-slide interval (4 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [isPaused, bannerSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };

  const handleBannerClick = () => {
    if (onOpenBookingModal) {
      onOpenBookingModal();
    } else {
      const el = document.querySelector('#booking');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const amenities = [
    { icon: MonitorPlay, label: '86" 4K Smart Interactive Board', iconBg: 'bg-emerald-50 text-emerald-700' },
    { icon: Mic, label: 'Wireless Collar Mics + Audio Mixer', iconBg: 'bg-emerald-50 text-emerald-700' },
    { icon: Sun, label: '3-Point Studio Softbox Lighting', iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/60' },
    { icon: Award, label: 'Acoustic Sound-Proof Recording Room', iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/60' },
  ];

  return (
    <section id="home" className="relative pt-3 sm:pt-6 pb-5 sm:pb-12 border-b border-emerald-100 bg-gradient-to-b from-emerald-50/20 via-[#fcfffd] to-[#fcfffd]">
      <div className="w-full space-y-4 sm:space-y-8">
        
        {/* ================= AUTO SLIDING BANNER CAROUSEL (WIDER DESKTOP CONTAINER) ================= */}
        <div className="max-w-[1520px] mx-auto px-2 sm:px-4 lg:px-6">
          <div
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-emerald-100/80 bg-white group cursor-pointer"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleBannerClick}
          >
            {/* Banner Images Carousel */}
            <div className="relative w-full overflow-hidden">
              {bannerSlides.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                  <div
                    key={slide.id}
                    className={`transition-all duration-700 ease-in-out ${
                      isActive
                        ? 'opacity-100 scale-100 relative'
                        : 'opacity-0 scale-98 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    <picture className="w-full block">
                      {/* Desktop Banner (Landscape 1983x793) */}
                      <source
                        media="(min-width: 768px)"
                        srcSet={slide.desktopImg}
                      />
                      {/* Mobile Banner (Portrait / Poster 1112x1415) */}
                      <img
                        src={slide.mobileImg}
                        alt={slide.alt}
                        className="w-full h-auto object-cover max-h-[560px] md:max-h-[620px] lg:max-h-[680px] mx-auto select-none"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </picture>
                  </div>
                );
              })}
            </div>

            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
              title="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Bottom Indicators */}
            <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex items-center justify-center gap-2 z-10">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`transition-all rounded-full cursor-pointer ${
                    currentSlide === index
                      ? 'w-7 h-2 bg-amber-400 shadow-md'
                      : 'w-2 h-2 bg-white/70 hover:bg-white'
                  }`}
                  title={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= TITLE & HEADINGS ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 pt-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Ishan Digital Academy • Slot Reservations Open</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-amber-400 text-amber-950 font-black rounded uppercase">2026 Live</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight">
              Book Your Professional <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600">
                Digital Classroom Recording Slot
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed px-2 sm:px-0">
              Record courses, YouTube playlists, EdTech lessons, and masterclasses in our
              sound-proof studio equipped with 4K cameras, interactive smartboard, and live pro lighting.
            </p>

            {/* Quick Amenities Grid (Responsive on Mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2 sm:pt-3">
              {amenities.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white/95 border border-emerald-100/90 hover:border-amber-300 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 text-left shadow-2xs transition-colors"
                  >
                    <div className={`p-1.5 sm:p-2 rounded-lg ${item.iconBg} flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    </div>
  </section>
  );
};
