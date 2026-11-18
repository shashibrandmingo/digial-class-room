import React from 'react';
import {
  MonitorPlay,
  Video,
  Mic,
  Sun,
  Award,
  FileVideo,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  HardDrive,
  Cpu,
} from 'lucide-react';

export const ServicesPage = ({ onNavigate, onOpenBookingModal }) => {
  const servicesList = [
    {
      icon: MonitorPlay,
      badge: 'Interactive Hardware',
      title: '86" 4K UHD Smart Interactive Board',
      desc: 'Seamless multi-touch handwriting, mathematical graphing, dual-pen annotation, and instant slide switching with built-in Android & Windows OS.',
      points: [
        'Zero parallax anti-glare toughened glass',
        'Direct PDF, PowerPoint & image importing',
        'Split screen whiteboard for simultaneous problems',
      ],
    },
    {
      icon: Video,
      badge: 'Broadcast Optics',
      title: 'Sony 4K Studio Broadcast Cameras',
      desc: 'High dynamic range 4K recording mounted at eye level. Perfect natural presenter framing without lens distortion.',
      points: [
        'Crystal clear 2160p 60fps recording',
        'Auto face-tracking & natural autofocus',
        'Multi-angle secondary angle option',
      ],
    },
    {
      icon: Mic,
      badge: 'Pristine Audio',
      title: 'Sennheiser / Rode Wireless Collar Mics',
      desc: 'Broadcast-grade wireless lapel microphones coupled with a Yamaha audio mixer for zero echo, background hiss, or vocal distortion.',
      points: [
        'Noise suppression and voice compression',
        'Hands-free movement across the entire studio',
        'Independent dual-host microphone channels',
      ],
    },
    {
      icon: Sun,
      badge: 'Eye Comfort',
      title: 'CRI 96+ Professional Softbox Lighting',
      desc: 'Custom 3-point softbox and rim lighting engineered to eliminate face shadows, board reflections, and eye fatigue during long 6-7 hr sessions.',
      points: [
        '5600K balanced daylight temperature',
        'Zero flicker rate at high frame rates',
        'Full anti-reflective board polarization',
      ],
    },
    {
      icon: Award,
      badge: 'Sound Isolation',
      title: 'Acoustically Treated Soundproof Chamber',
      desc: 'Heavy soundproofing with pyramid acoustic panels preventing street horn, rain, AC vibration, and ambient room resonance.',
      points: [
        'Engineered NRC 0.85 acoustic treatment',
        'Silent whisper-quiet ductless air conditioning',
        'Double-glazed acoustic airtight doors',
      ],
    },
    {
      icon: FileVideo,
      badge: 'Fast Delivery',
      title: 'Instant High-Speed Footage Export',
      desc: 'Direct high-bitrate MP4 / ProRes video export. Take your raw and rendered video files immediately on your portable SSD or drive.',
      points: [
        'No waiting: Instant handover post-session',
        'Formatted for YouTube, mobile apps & LMS',
        'High-speed USB 3.2 Gen 2 transfer speeds',
      ],
    },
  ];

  const specs = [
    { feature: 'Interactive Board', spec: '86" 4K UHD (3840 x 2160), 20-point touch, Zero Gap' },
    { feature: 'Primary Camera', spec: 'Sony 4K Ultra HD Broadcast Optics with f/1.8 Aperture' },
    { feature: 'Audio Setup', spec: 'Dual Wireless UHF Lapel Mics + Dedicated Yamaha Audio Mixer' },
    { feature: 'Studio Lighting', spec: '3-Point CRI 96+ Studio Softboxes (Flicker-Free, 5600K)' },
    { feature: 'Room Acoustics', spec: 'Double Sealed Acoustic Chamber with NRC 0.85 Foam Panels' },
    { feature: 'File Delivery', spec: 'Instant H.264 / H.265 / ProRes export to SSD / Drive' },
  ];

  return (
    <div className="py-10 space-y-14 animate-in fade-in duration-300">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span>Complete Digital Classroom Recording Facility</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Studio Services & Technology
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Everything educators and creators need to produce broadcast-grade course lectures,
          educational series, and digital masterclasses.
        </p>
      </section>

      {/* 6 Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald-700" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {srv.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{srv.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.desc}</p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                    {srv.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hardware Specifications Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Studio Hardware Specifications</h3>
              <p className="text-xs text-slate-500">Verified benchmark equipment in our studio</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-100">
                {specs.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fdfa] transition-all">
                    <td className="py-3.5 px-4 font-bold text-slate-900 w-1/3">
                      {item.feature}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-800 font-medium">
                      {item.spec}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Available Slots & Pricing Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">Studio Slots & Transparent Rates</h2>
          <p className="text-xs text-slate-600 mt-1">Book online with instant automated confirmation email</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Morning Slot */}
          <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Morning Slot
                </span>
                <span className="text-2xl font-extrabold text-slate-900">₹3,999</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">05:00 AM – 12:00 PM (7 Hours)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ideal for extensive lecture batches, multi-topic syllabus recording, and uninterrupted morning focus.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">✓ Full 7 Hours Studio Access</li>
                <li className="flex items-center gap-2">✓ 86" Smartboard + 4K Camera Included</li>
                <li className="flex items-center gap-2">✓ Immediate SSD video handover</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenBookingModal ? onOpenBookingModal('slot-5-12') : onNavigate('/')}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Morning Slot Online</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Evening Slot */}
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Prime Evening
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Evening Slot
                </span>
                <span className="text-2xl font-extrabold text-slate-900">₹4,999</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">03:00 PM – 09:00 PM (6 Hours)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prime evening recording slot with full studio softbox illumination, live smartboard assistance, and sound isolation.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">✓ Full 6 Hours Prime Studio Access</li>
                <li className="flex items-center gap-2">✓ Teleprompter + Wireless Mics Included</li>
                <li className="flex items-center gap-2">✓ Immediate SSD video handover</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenBookingModal ? onOpenBookingModal('slot-3-9') : onNavigate('/')}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Book Evening Slot Online</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
