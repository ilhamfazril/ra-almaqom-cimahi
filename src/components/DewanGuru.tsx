import React, { useState, useEffect } from 'react';
import { GuruItem, subscribeToGuruList, DEFAULT_GURU_LIST } from '../config/firebase';
import { Heart, Sparkles, UserCheck } from 'lucide-react';

export const DewanGuru: React.FC = () => {
  const [guruList, setGuruList] = useState<GuruItem[]>(DEFAULT_GURU_LIST);

  useEffect(() => {
    const unsub = subscribeToGuruList((list) => {
      setGuruList(list);
    });
    return () => unsub();
  }, []);

  const getCardBg = (warna?: string, idx: number = 0) => {
    switch (warna) {
      case 'sage':
        return 'bg-[#EDF4EE] border-[#2C4A34]';
      case 'terracotta':
        return 'bg-[#FDF2ED] border-[#8C3A1D]';
      case 'yellow':
        return 'bg-[#FEFCE8] border-[#854D0E]';
      case 'cream':
      default:
        const cycle = idx % 3;
        if (cycle === 1) return 'bg-[#EDF4EE] border-[#2C4A34]';
        if (cycle === 2) return 'bg-[#FDF2ED] border-[#8C3A1D]';
        return 'bg-[#FFFDF9] border-[#1C1917]';
    }
  };

  const rotations = ['rotate-[-1.5deg]', 'rotate-[2deg]', 'rotate-[-2deg]', 'rotate-[1.5deg]'];

  return (
    <section id="guru" className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF6EE] border-y-2 border-[#1C1917]/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-[#EDF4EE] border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] text-xs font-bold text-[#2C4A34] uppercase tracking-wider rotate-[1deg]">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Album Pendidik & Pengasuh Ceria</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C241E] tracking-tight">
            Dewan Guru & Ustadzah RA Almaqom
          </h2>
          <p className="mt-1 text-sm sm:text-base text-[#5C4F44] max-w-xl mx-auto">
            Sosok teladan penuh kesabaran yang mendampingi setiap langkah kecil ananda dengan sentuhan hati.
          </p>
        </div>

        {/* Polaroid Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {guruList.map((guru, idx) => (
            <div
              key={guru.id}
              className={`relative p-4 sm:p-5 border-2 rounded-2xl shadow-[4px_4px_0px_#1C1917] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1C1917] ${getCardBg(guru.warnaKertas, idx)} ${rotations[idx % rotations.length]}`}
            >
              {/* Push-Pin Accent on alternating cards */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#D96B43] border border-black/40 shadow-xs z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>

              {/* Photo Frame (Polaroid Look) */}
              <div className="aspect-[4/4] w-full rounded-xl overflow-hidden border-2 border-[#1C1917] bg-white mb-3.5 shadow-xs">
                <img
                  src={guru.fotoUrl}
                  alt={guru.nama}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              {/* Name & Role */}
              <div className="space-y-1 text-center">
                <h3 className="font-extrabold text-base text-[#1C1917] leading-snug">
                  {guru.nama}
                </h3>
                <p className="text-xs font-bold text-[#5B8266] font-mono">
                  {guru.peran}
                </p>
              </div>

              {/* Handwritten Quote */}
              <div className="mt-3 pt-3 border-t border-black/10 text-center">
                <p className="text-xs text-[#5C4F44] italic font-serif leading-relaxed">
                  "{guru.moto}"
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DewanGuru;
