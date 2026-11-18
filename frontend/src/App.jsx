import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BookingModal } from './components/BookingModal';
import { MapPin, Phone, Mail, Lock } from 'lucide-react';

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [adminToken, setAdminToken] = useState(() =>
    localStorage.getItem('dcr_admin_token')
  );
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalInitialSlotId, setModalInitialSlotId] = useState(null);
  const [modalInitialPurpose, setModalInitialPurpose] = useState('');

  const openBookingModalWithSlot = (slotId = null, purpose = '') => {
    setModalInitialSlotId(slotId);
    setModalInitialPurpose(purpose);
    setIsBookingModalOpen(true);
  };

  // Sync state on browser back / forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('dcr_admin_token');
    setAdminToken(null);
  };

  const handleBookingSuccess = (bookingDetails) => {
    setConfirmedBooking(bookingDetails);
  };

  const isAdminRoute = currentPath === '/admin/login' || currentPath.startsWith('/admin');

  // Render Current Page Component
  const renderCurrentPage = () => {
    if (isAdminRoute) {
      return (
        <AdminDashboard
          adminToken={adminToken}
          setAdminToken={setAdminToken}
          onLogout={handleLogout}
          onNavigateHome={() => navigateTo('/')}
        />
      );
    }

    switch (currentPath) {
      case '/services':
        return (
          <ServicesPage
            onNavigate={navigateTo}
            onOpenBookingModal={openBookingModalWithSlot}
          />
        );
      case '/about':
        return (
          <AboutPage
            onNavigate={navigateTo}
            onOpenBookingModal={openBookingModalWithSlot}
          />
        );
      case '/contact':
        return <ContactPage onNavigate={navigateTo} />;
      case '/':
      default:
        return (
          <HomePage
            onBookingSuccess={handleBookingSuccess}
            onNavigate={navigateTo}
            onOpenBookingModal={openBookingModalWithSlot}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfffd] text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header Navbar (Shown on all client pages) */}
      {!isAdminRoute && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigateTo}
          onOpenBookingModal={() => openBookingModalWithSlot(null)}
        />
      )}

      {/* Main Page Body */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Quick Booking Popup Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
        initialSlotId={modalInitialSlotId}
        initialPurpose={modalInitialPurpose}
      />

      {/* Booking Confirmation Receipt Modal */}
      {confirmedBooking && (
        <ConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}

      {/* Footer (Shown on all client pages) */}
      {!isAdminRoute && (
        <footer className="mt-12 bg-[#052e24] text-emerald-100">
          {/* Brand Logo Warm Gold Accent Line */}
          <div className="w-full h-1 bg-gradient-to-r from-emerald-700 via-amber-400 to-emerald-700"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-emerald-900/80 text-xs">
              {/* Brand column */}
              <div className="md:col-span-1">
                <div
                  onClick={() => navigateTo('/')}
                  className="flex items-center gap-3 mb-3 cursor-pointer group"
                >
                  <div className="h-14 w-14 flex-shrink-0 bg-white p-1 rounded-xl shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                    <img
                      src="/logo.jpg"
                      alt="Ishan Digital Academy"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
                      Ishan Digital Academy
                    </div>
                    <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span>शिक्षा का डिजिटल भविष्य</span>
                    </div>
                  </div>
                </div>
                <p className="text-emerald-200/75 leading-relaxed">
                  State-of-the-art video recording facility with 4K cameras, interactive smartboard,
                  acoustic soundproofing, and teleprompter setup for educators, creators, and institutions.
                </p>
              </div>

              {/* Quick Navigation Links */}
              <div>
                <span className="font-bold text-white text-xs block mb-3 uppercase tracking-wider">
                  Pages
                </span>
                <ul className="space-y-2 text-emerald-200/80 font-medium">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigateTo('/')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigateTo('/services')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Services & Equipment
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigateTo('/about')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigateTo('/contact')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Contact & Location
                    </button>
                  </li>
                </ul>
              </div>

              {/* Timings & Rates */}
              <div>
                <span className="font-bold text-white text-xs block mb-3 uppercase tracking-wider">
                  Studio Timings & Rates
                </span>
                <ul className="space-y-2 text-emerald-100">
                  <li className="flex justify-between bg-emerald-900/50 p-2.5 rounded-lg border border-emerald-800/80">
                    <span className="text-emerald-200/90">Morning (05 AM - 12 PM):</span>
                    <span className="text-white font-bold">₹3,999</span>
                  </li>
                  <li className="flex justify-between bg-emerald-900/50 p-2.5 rounded-lg border border-emerald-800/80">
                    <span className="text-emerald-200/90">Evening (03 PM - 09 PM):</span>
                    <span className="text-white font-bold">₹4,999</span>
                  </li>
                  <li className="text-emerald-400 font-medium pt-1">
                    ✓ Instant automated confirmation email on every successful reservation.
                  </li>
                </ul>
              </div>

              {/* Studio Desk & Address */}
              <div>
                <span className="font-bold text-white text-xs block mb-3 uppercase tracking-wider">
                  Studio Location & Desk
                </span>
                <div className="space-y-2.5 text-emerald-200/80">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Studio 402, 4th Floor, Creator Hub, MG Road</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>+91 98765 43210</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>bookings@ishandigitalacademy.com</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-emerald-300/75 gap-3">
              <div>
                © {new Date().getFullYear()} Ishan Digital Academy. All rights reserved.
              </div>

              {/* BrandMingo Agency Branding */}
              <div className="flex items-center gap-1.5 text-emerald-200/90 font-medium">
                <span>Designed & Developed by</span>
                <a
                  href="https://brandmingo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-white hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                  title="Visit BrandMingo - Digital Agency"
                >
                  BrandMingo
                </a>
              </div>

              <div className="flex items-center gap-3 text-emerald-300/70">
                <span>Razorpay Secured</span>
                <span>•</span>
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
