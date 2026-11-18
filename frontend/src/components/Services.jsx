import React from 'react';
import {
  MonitorPlay,
  Mic,
  Sun,
  Award,
  Video,
  FileVideo,
  Layers,
} from 'lucide-react';

export const Services = () => {
  const servicesList = [
    {
      icon: MonitorPlay,
      title: '86" 4K Interactive Smartboard',
      desc: 'Annotate slides, write digital formulas, draw diagrams and switch presentations smoothly with multi-touch stylus support.',
    },
    {
      icon: Video,
      title: 'Sony 4K Studio Optics',
      desc: 'Crystal-clear 4K UHD video recording with multi-angle camera configuration for natural eye contact and teaching posture.',
    },
    {
      icon: Mic,
      title: 'Studio Grade Audio & Collar Mics',
      desc: 'Sennheiser / Rode wireless collar microphones with dedicated studio audio mixers, noise gating, and zero room echo.',
    },
    {
      icon: Sun,
      title: 'CRI 96+ Professional Softbox Lighting',
      desc: 'Flicker-free studio softbox and key lighting designed specifically for continuous lecture recording without eye fatigue.',
    },
    {
      icon: Award,
      title: 'Acoustic Sound-Proof Room',
      desc: 'Specially engineered high-density acoustic treatment and heavy soundproofing isolating street and outside noise completely.',
    },
    {
      icon: FileVideo,
      title: 'Instant High-Speed Footage Export',
      desc: 'Direct USB-C / SSD high-speed rendering so you can take your entire recording session footage home on your drive right away.',
    },
  ];

  return (
    <section id="services" className="py-16 border-b border-emerald-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <span>Studio Facilities & Technology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            World-Class Recording Equipment Included
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Everything you need to produce top-tier EdTech courses, competitive exam lectures, and digital video content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-[#f8fdfa] border border-emerald-100/90 rounded-2xl p-6 hover:shadow-md hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{srv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
