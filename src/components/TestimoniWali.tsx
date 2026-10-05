import React, { useState, useEffect } from 'react';
import { TestimoniItem, subscribeToTestimoni, DEFAULT_TESTIMONI_LIST } from '../config/firebase';
import { Heart, MessageSquareQuote } from 'lucide-react';

export const TestimoniWali: React.FC = () => {
  const [testimoniList, setTestimoniList] = useState<TestimoniItem[]>(DEFAULT_TESTIMONI_LIST);

  useEffect(() => {
    const unsub = subscribeToTestimoni((list) => {
      setTestimoniList(list);
    });
    return () => unsub();
  }, []);

  const getNoteBg = (warna?: string, idx: number = 0) => {
    switch (warna) {
      case 'sage':
        return 'bg-[#EDF4EE] border-[#2C4A34] text-[#1F3324]';
      case 'terracotta':
        return 'bg-[#FDF2ED] border-[#8C3A1D] text-[#4A1D0E]';
      case 'yellow':
        return 'bg-[#FEFCE8] border-[#854D0E] text-[#422006]';
      case 'cream':
      default:
        const cycle = idx % 3;
        if (cycle === 1) return 'bg-[#EDF4EE] border-[#2C4A34] text-[#1F3324]';
        if (cycle === 2) return 'bg-[#FDF2ED] border-[#8C3A1D] text-[#4A1D0E]';
        return 'bg-[#FFFDF9] border-[#1C1917] text-[#2C2B2A]';
    }
  };

  const rotations = ['rotate-[-1deg]', 'rotate-[1.5deg]', 'rotate-[-2deg]'];

  return (
    <section id="testimoni" className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-paper-grid">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-[#FDF2ED] border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] text-xs font-bold text-[#8C3A1D] uppercase tracking-wider rotate-[-1deg]">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Suara Hati Orang Tua Santri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C241E] tracking-tight">
            Catatan Kasih Ayah & Bunda
          </h2>
          <p className="mt-1 text-sm sm:text-base text-[#5C4F44] max-w-xl mx-auto">
            Pengalaman nyata wali murid mendampingi tumbuh kembang ananda tercinta di RA Almaqom.
          </p>
        </div>

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimoniList.map((item, idx) => (
            <div
              key={item.id}
              className={`relative p-6 border-2 rounded-2xl shadow-[4px_4px_0px_#1C1917] flex flex-col justify-between transition-all hover:scale-[1.02] ${getNoteBg(item.warna, idx)} ${rotations[idx % rotations.length]}`}
            >
              {/* Push Pin */}
              <div className="absolute -top-3 left-6 w-4 h-4 rounded-full bg-[#E07A5F] border border-black/40 shadow-xs z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>

              {/* Quote Content */}
              <div className="space-y-3 pt-1">
                <p className="text-sm sm:text-base leading-relaxed font-normal italic">
                  "{item.isi}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-5 pt-3 border-t border-black/15">
                <h4 className="font-bold text-sm text-[#1C1917]">
                  {item.namaWali}
                </h4>
                <p className="text-xs font-mono font-medium text-[#D96B43] mt-0.5">
                  ★ {item.santri}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimoniWali;
