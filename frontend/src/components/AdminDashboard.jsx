import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  Lock,
  Unlock,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Wrench,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Phone,
  Download,
  Copy,
  Check,
  Clock,
  FileSpreadsheet,
  Building2,
  UserCheck,
} from 'lucide-react';
import {
  adminLoginRequest,
  fetchDashboardStats,
  fetchAllBookings,
  requestSlotBlock,
  requestSlotUnblock,
  fetchBlockedSlots,
  createManualWalkIn,
} from '../api';

export const AdminDashboard = ({ adminToken, setAdminToken, onLogout, onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [copiedId, setCopiedId] = useState(null);

  const [blockForm, setBlockForm] = useState({
    date: new Date().toISOString().split('T')[0],
    slotId: 'all',
    reason: 'Studio Equipment Maintenance',
  });
  const [isBlocking, setIsBlocking] = useState(false);

  const [manualForm, setManualForm] = useState({
    bookingDate: new Date().toISOString().split('T')[0],
    slotId: 'slot-5-12',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    paymentMode: 'Cash at Studio',
    notes: 'Direct Walk-in / Phone Reservation',
  });
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  useEffect(() => {
    if (adminToken) {
      loadDashboardData();
    }
  }, [adminToken, dateFilter]);

  const loadDashboardData = async () => {
    setLoading(true);
    setStatusMessage({ type: '', text: '' });
    try {
      const [statsRes, bookingsRes, blocksRes] = await Promise.all([
        fetchDashboardStats(),
        fetchAllBookings({ date: dateFilter, search: searchQuery }),
        fetchBlockedSlots(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      if (blocksRes.success) setBlocks(blocksRes.blocks);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      if (err.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await adminLoginRequest(email, password);
      if (res.success && res.token) {
        localStorage.setItem('dcr_admin_token', res.token);
        setAdminToken(res.token);
      } else {
        setLoginError(res.message || 'Login failed');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleBlockSlot = async (e) => {
    e.preventDefault();
    setIsBlocking(true);
    setStatusMessage({ type: '', text: '' });
    try {
      const res = await requestSlotBlock(blockForm);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        loadDashboardData();
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to block slot',
      });
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblock = async (blockId) => {
    if (!confirm('Are you sure you want to unblock this slot and make it open for clients?')) {
      return;
    }
    try {
      const res = await requestSlotUnblock(blockId);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        loadDashboardData();
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to unblock slot',
      });
    }
  };

  const handleManualBooking = async (e) => {
    e.preventDefault();
    setIsSubmittingManual(true);
    setStatusMessage({ type: '', text: '' });
    try {
      const res = await createManualWalkIn({
        ...manualForm,
        notes: `${manualForm.notes} [Payment: ${manualForm.paymentMode}]`,
      });
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Manual booking registered successfully!' });
        setManualForm({
          bookingDate: new Date().toISOString().split('T')[0],
          slotId: 'slot-5-12',
          clientName: '',
          clientPhone: '',
          clientEmail: '',
          paymentMode: 'Cash at Studio',
          notes: 'Direct Walk-in / Phone Reservation',
        });
        loadDashboardData();
        setActiveTab('bookings');
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to register manual booking',
      });
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportBookingsToCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['Booking ID,Client Name,Phone,Email,Date,Slot,Amount,Status,Payment ID,Created At'];
    const rows = bookings.map((b) =>
      [
        b.bookingId,
        `"${b.clientName}"`,
        b.clientPhone,
        b.clientEmail,
        b.bookingDate,
        `"${b.slotName}"`,
        b.amount,
        b.status,
        b.razorpayPaymentId || 'WALK-IN',
        b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : '',
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ishan_Digital_Academy_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return bookings.filter((b) => {
      const matchesSearch =
        !q ||
        b.clientName.toLowerCase().includes(q) ||
        b.clientPhone.includes(q) ||
        b.clientEmail.toLowerCase().includes(q) ||
        b.bookingId.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // =========================================================================
  // LOGIN SCREEN
  // =========================================================================
  if (!adminToken) {
    return (
      <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-gradient-to-b from-[#fcfffd] via-emerald-50/25 to-[#fcfffd]">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-emerald-200/90 rounded-3xl p-7 sm:p-9 shadow-xl relative z-10 backdrop-blur-sm">
          {/* Top Return link & badge */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onNavigateHome}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Website
            </button>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Studio Staff Portal</span>
            </span>
          </div>

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white border border-emerald-100 rounded-2xl p-2 flex items-center justify-center mx-auto mb-3 shadow-md">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Ishan Digital Academy
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Studio Operations & Live Slot Control Center
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span className="font-medium">{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Email ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@studio.com"
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer mt-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Secure Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="w-full max-w-[1820px] mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5 space-y-3.5">
      
      {/* ================= TOP EXECUTIVE HEADER (COMPACT & MOBILE RESPONSIVE) ================= */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-2.5 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand & Live Status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-emerald-100 rounded-xl p-1 flex items-center justify-center shadow-2xs flex-shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                Studio Admin Dashboard
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Live Control</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              Ishan Digital Academy • Studio Operations
            </p>
          </div>
        </div>

        {/* Action Buttons (3-column grid on mobile, flex on desktop) */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={onNavigateHome}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3 h-3 text-slate-500 flex-shrink-0" />
            <span className="truncate">Home</span>
          </button>
          
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
            title="Refresh Real-Time Data"
          >
            <RefreshCw className={`w-3 h-3 flex-shrink-0 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
            <span className="truncate">{loading ? 'Syncing...' : 'Sync'}</span>
          </button>
          
          <button
            onClick={onLogout}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
            title="Sign out of Admin Session"
          >
            <LogOut className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </div>

      {/* Status Alerts Notification */}
      {statusMessage.text && (
        <div
          className={`p-2.5 sm:p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2.5 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span className="truncate">{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage({ type: '', text: '' })}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer font-bold px-1.5 py-0.5 rounded hover:bg-black/5 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* ================= 4 ULTRA-COMPACT EXECUTIVE KPI METRIC CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        
        {/* Metric 1: Total Revenue */}
        <div className="bg-white border border-emerald-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2 group">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
              Total Revenue
            </span>
            <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5 truncate">
              ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : 0}
            </div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-700 font-semibold mt-0.5 truncate">
              <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span className="truncate">Razorpay Live</span>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            ₹
          </div>
        </div>

        {/* Metric 2: Confirmed Bookings */}
        <div className="bg-white border border-teal-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2 group">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
              Confirmed Bookings
            </span>
            <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5 truncate">
              {stats?.totalConfirmedBookings || 0}
            </div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-teal-700 font-semibold mt-0.5 truncate">
              <UserCheck className="w-3 h-3 text-teal-600 flex-shrink-0" />
              <span className="truncate">Client Bookings</span>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-3.5 h-3.5 text-teal-700" />
          </div>
        </div>

        {/* Metric 3: Today's Sessions */}
        <div className="bg-white border border-amber-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2 group">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
              Today's Sessions
            </span>
            <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5 truncate">
              {stats?.todayBookingsCount || 0}
            </div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-amber-800 font-semibold mt-0.5 truncate">
              <Clock className="w-3 h-3 text-amber-600 flex-shrink-0" />
              <span className="truncate">Shoots Today</span>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
          </div>
        </div>

        {/* Metric 4: Blocked Slots */}
        <div className="bg-white border border-rose-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2 group">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
              Maintenance Blocks
            </span>
            <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5 truncate">
              {blocks.length || 0}
            </div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-rose-700 font-semibold mt-0.5 truncate">
              <Lock className="w-3 h-3 text-rose-600 flex-shrink-0" />
              <span className="truncate">Slots Locked</span>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            <Wrench className="w-3.5 h-3.5 text-rose-700" />
          </div>
        </div>

      </div>

      {/* ================= COMPACT SEGMENTED TAB SWITCHER (MOBILE HORIZONTAL SWIPE) ================= */}
      <div className="bg-slate-100 p-1 rounded-xl flex overflow-x-auto no-scrollbar sm:inline-flex sm:flex-wrap gap-1 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors duration-150 flex items-center gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-white text-emerald-950 border-slate-300 shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          <span>All Customer Bookings</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
            {bookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('blocks')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors duration-150 flex items-center gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap ${
            activeTab === 'blocks'
              ? 'bg-white text-amber-950 border-slate-300 shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-amber-600" />
          <span>Slot Maintenance & Blocks</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
            {blocks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('walkin')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors duration-150 flex items-center gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap ${
            activeTab === 'walkin'
              ? 'bg-white text-teal-950 border-slate-300 shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-teal-700" />
          <span>Manual Walk-in / Phone Entry</span>
        </button>
      </div>

      {/* ================= TAB PANELS (STABLE MIN-HEIGHT) ================= */}
      <div className="min-h-[460px]">
        {/* ================= TAB 1: ALL CUSTOMER BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
          {/* Controls Bar: Search, Date Filter, Status & CSV Export (Mobile Optimized) */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-2.5 sm:p-3.5 flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between shadow-xs">
            <div className="relative w-full md:flex-1">
              <input
                type="text"
                placeholder="Search by client name, mobile, email, or Booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadDashboardData()}
                className="bg-[#f8fdfa] border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 w-full focus:outline-none focus:border-emerald-500 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#f8fdfa] border border-slate-300 rounded-xl px-2.5 sm:px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer flex-1 sm:flex-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="HELD">Held</option>
              </select>

              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-[#f8fdfa] border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 flex-1 sm:flex-none"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer px-1"
                >
                  Clear
                </button>
              )}

              {/* CSV Export Button */}
              <button
                type="button"
                onClick={exportBookingsToCSV}
                disabled={bookings.length === 0}
                className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs flex-1 sm:flex-none"
                title="Download Bookings as CSV (Excel)"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span className="truncate">Export</span>
              </button>
            </div>
          </div>

          {/* ================= MOBILE VIEW: CARD FORM (Shown on < 768px) ================= */}
          <div className="block md:hidden space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="bg-white border border-emerald-100 rounded-2xl py-10 px-4 text-center text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">No bookings match the selected filters.</p>
              </div>
            ) : (
              filteredBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white border border-emerald-100 rounded-2xl p-3.5 shadow-2xs space-y-2.5"
                >
                  {/* Top Row: Booking ID + Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-emerald-800 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {b.bookingId}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(b.bookingId, b._id)}
                        className="text-slate-400 hover:text-emerald-700 cursor-pointer p-0.5"
                        title="Copy ID"
                      >
                        {copiedId === b._id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : b.status === 'HELD'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${b.status === 'CONFIRMED' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                      {b.status}
                    </span>
                  </div>

                  {/* Client Details Row */}
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {b.clientName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
                      <a
                        href={`tel:${b.clientPhone}`}
                        className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                        title={`Call ${b.clientPhone}`}
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{b.clientPhone}</span>
                      </a>
                      <a
                        href={`https://wa.me/91${b.clientPhone.replace(/\D/g, '').slice(-10)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-1.5 py-0.2 rounded hover:bg-emerald-200 transition-colors"
                        title="WhatsApp Chat"
                      >
                        WA
                      </a>
                      <span>•</span>
                      {b.clientEmail ? (
                        <a
                          href={`mailto:${b.clientEmail}?subject=Regarding Your Ishan Digital Academy Recording Slot - ${b.bookingId}`}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-800 truncate max-w-[180px]"
                          title={`Email: ${b.clientEmail}`}
                        >
                          <Mail className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{b.clientEmail}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">No Email</span>
                      )}
                    </div>
                  </div>

                  {/* Slot & Schedule Box */}
                  <div className="bg-[#f8fdfa] border border-emerald-100/90 rounded-xl p-2.5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>
                          {new Date(b.bookingDate).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </span>
                      <span className="text-emerald-800 font-extrabold text-[11px]">
                        {b.slotName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-5">
                      {b.slotTime} • {b.purpose || 'Studio Course Recording'}
                    </div>
                  </div>

                  {/* Bottom Bar: Amount + Payment Ref */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount</span>
                      <span className="text-sm font-black text-slate-900">₹{b.amount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Ref / Mode</span>
                      <span className="font-mono text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded block max-w-[150px] truncate">
                        {b.razorpayPaymentId || 'WALK-IN (OFFLINE)'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ================= DESKTOP VIEW: FULL TABLE (Shown on >= 768px) ================= */}
          <div className="hidden md:block bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f4faf7] border-b border-emerald-100 text-slate-700 uppercase font-extrabold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Client Details</th>
                    <th className="py-3.5 px-4">Recording Date & Slot</th>
                    <th className="py-3.5 px-4">Subject / Purpose</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Payment Reference</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Calendar className="w-8 h-8 text-slate-300" />
                          <span className="text-sm font-semibold">No bookings match the selected filters.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-emerald-50/30 transition-all">
                        {/* Booking ID */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-emerald-800 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {b.bookingId}
                            </span>
                            <button
                              onClick={() => copyToClipboard(b.bookingId, b._id)}
                              className="text-slate-400 hover:text-emerald-700 cursor-pointer p-0.5"
                              title="Copy Booking ID"
                            >
                              {copiedId === b._id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Client Details */}
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {b.clientName}
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5 flex-wrap">
                            {/* Clickable Mobile Link */}
                            <a
                              href={`tel:${b.clientPhone}`}
                              className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 hover:underline transition-colors"
                              title={`Direct Call: ${b.clientPhone}`}
                            >
                              <Phone className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                              <span>{b.clientPhone}</span>
                            </a>

                            {/* WhatsApp Direct Chat Link */}
                            <a
                              href={`https://wa.me/91${b.clientPhone.replace(/\D/g, '').slice(-10)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded transition-colors"
                              title="Chat on WhatsApp"
                            >
                              WA
                            </a>

                            <span>•</span>

                            {/* Clickable Email Link */}
                            {b.clientEmail ? (
                              <a
                                href={`mailto:${b.clientEmail}?subject=Regarding Your Ishan Digital Academy Recording Slot - ${b.bookingId}`}
                                className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 hover:underline transition-colors"
                                title={`Send Email to: ${b.clientEmail}`}
                              >
                                <Mail className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                                <span>{b.clientEmail}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400">No Email</span>
                            )}
                          </div>
                        </td>

                        {/* Date & Slot */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">
                            {new Date(b.bookingDate).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                            {b.slotName} ({b.slotTime})
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate">
                          {b.purpose || 'Studio Course Recording'}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                          ₹{b.amount?.toLocaleString('en-IN')}
                        </td>

                        {/* Payment ID */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {b.razorpayPaymentId || 'WALK-IN (OFFLINE)'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              b.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : b.status === 'HELD'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${b.status === 'CONFIRMED' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SLOT BLOCKING & MAINTENANCE ================= */}
      {activeTab === 'blocks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form to Block a Slot */}
          <div className="lg:col-span-5 bg-white border border-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Block Date or Slot
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Lock studio time from online client bookings
                </p>
              </div>
            </div>

            <form onSubmit={handleBlockSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Target Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={blockForm.date}
                  onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                  required
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Slot to Block
                </label>
                <select
                  value={blockForm.slotId}
                  onChange={(e) => setBlockForm({ ...blockForm, slotId: e.target.value })}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="all">Entire Day (All Morning & Evening Slots Closed)</option>
                  <option value="slot-5-12">Morning Slot Only (5:00 AM - 12:00 PM)</option>
                  <option value="slot-3-9">Evening Slot Only (3:00 PM - 9:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Reason / Maintenance Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acoustic soundproofing upgrade / AC servicing"
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  required
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                />

                {/* Quick Reason Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'Studio Maintenance',
                    'Owner Personal Shoot',
                    'AC / Electrical Repair',
                    'Festival / Holiday',
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setBlockForm({ ...blockForm, reason: r })}
                      className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer transition-all"
                    >
                      + {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isBlocking}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer mt-2"
              >
                {isBlocking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>Confirm Slot Block</span>
              </button>
            </form>
          </div>

          {/* Right Column: Currently Blocked Slots List */}
          <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Active Blocked Dates & Slots ({blocks.length})
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    These dates/slots are blocked from live booking on client website
                  </p>
                </div>
              </div>

              {blocks.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs sm:text-sm flex flex-col items-center justify-center gap-2">
                  <Unlock className="w-7 h-7 text-emerald-400" />
                  <span className="font-medium">No slots are currently blocked. Studio is open for booking!</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {blocks.map((b) => (
                    <div
                      key={b._id}
                      className="p-3 sm:p-3.5 rounded-xl bg-[#f8fdfa] border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs hover:shadow-xs transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            {new Date(b.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                            {b.slotId === 'all'
                              ? 'Entire Day Blocked'
                              : b.slotId === 'slot-5-12'
                              ? 'Morning (5 AM - 12 PM)'
                              : 'Evening (3 PM - 9 PM)'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Reason: <strong className="text-slate-800">{b.reason}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => handleUnblock(b._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unblock</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              💡 Unblocking will immediately release the slot and allow customers to book online in real-time.
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: MANUAL WALK-IN ENTRY ================= */}
      {activeTab === 'walkin' && (
        <div className="max-w-3xl mx-auto bg-white border border-emerald-100 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Manual Walk-in / Phone Reservation Entry
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Reserve studio slot directly on behalf of a physical walk-in client
              </p>
            </div>
          </div>

          <form onSubmit={handleManualBooking} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Recording Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={manualForm.bookingDate}
                  onChange={(e) => setManualForm({ ...manualForm, bookingDate: e.target.value })}
                  required
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Time Slot
                </label>
                <select
                  value={manualForm.slotId}
                  onChange={(e) => setManualForm({ ...manualForm, slotId: e.target.value })}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                >
                  <option value="slot-5-12">Morning Slot (05:00 AM - 12:00 PM) • ₹3,999</option>
                  <option value="slot-3-9">Evening Slot (03:00 PM - 09:00 PM) • ₹4,999</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Client Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Prof. Ramesh Kumar"
                value={manualForm.clientName}
                onChange={(e) => setManualForm({ ...manualForm, clientName: e.target.value })}
                required
                className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Client Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={manualForm.clientPhone}
                  onChange={(e) => setManualForm({ ...manualForm, clientPhone: e.target.value })}
                  required
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Client Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={manualForm.clientEmail}
                  onChange={(e) => setManualForm({ ...manualForm, clientEmail: e.target.value })}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Collection Method
                </label>
                <select
                  value={manualForm.paymentMode}
                  onChange={(e) => setManualForm({ ...manualForm, paymentMode: e.target.value })}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                >
                  <option value="Cash at Studio Desk">Cash Collected at Studio Desk</option>
                  <option value="Direct UPI to Studio QR">Direct UPI (PhonePe / GPay QR)</option>
                  <option value="Bank NEFT / IMPS">Bank NEFT / IMPS Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Internal Staff Notes
                </label>
                <input
                  type="text"
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  className="w-full bg-[#f8fdfa] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingManual}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer mt-4"
            >
              {isSubmittingManual ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Confirm & Lock Walk-in Slot</span>
            </button>
          </form>
        </div>
      )}
      </div>
    </div>
  );
};
