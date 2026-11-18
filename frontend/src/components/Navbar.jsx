import React, { useState } from 'react';
import { PhoneCall, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar = ({ currentPath, onNavigate, onOpenBookingModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const handleBookSlotClick = () => {
    setMobileMenuOpen(false);
    if (onOpenBookingModal) {
      onOpenBookingModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[4.25rem] sm:min-h-20 py-2 flex items-center justify-between">
        {/* Brand with Official Logo (Responsive & Clean on Mobile) */}
        <div
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0"
        >
          <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Ishan Digital Academy Logo"
              className="w-full h-full object-contain drop-shadow-2xs"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                Ishan Digital Academy
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-800 font-semibold truncate mt-0.5 flex items-center gap-1.5">
              <span className="text-amber-500 font-bold">★</span>
              <span>शिक्षा का डिजिटल भविष्य</span>
              <span className="hidden sm:inline text-slate-300 mx-1">•</span>
              <span className="hidden sm:inline text-slate-500">Video Recording Studio</span>
            </p>
          </div>
        </div>

        {/* Desktop 4 Tabs: Home, Services, About, Contact */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.name}
                type="button"
                onClick={() => handleNavClick(link.path)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-100/80 text-emerald-800 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-700 bg-emerald-50/70 border border-emerald-100 rounded-lg px-3 py-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">+91 98765 43210</span>
          </div>

          <button
            type="button"
            onClick={handleBookSlotClick}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer border border-emerald-500 hover:border-amber-400 group"
          >
            <span>Book A Slot</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400 text-slate-950 font-extrabold uppercase tracking-wide group-hover:bg-amber-300">
              Now
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-emerald-50 text-slate-700 hover:bg-emerald-100 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.name}
                type="button"
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left block px-3.5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {link.name}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBookSlotClick}
              className="w-full text-center py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            >
              Book A Recording Slot
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
