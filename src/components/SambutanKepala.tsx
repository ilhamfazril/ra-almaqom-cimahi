import React, { useState, useEffect } from 'react';
import { SchoolProfile, subscribeToSchoolProfile, DEFAULT_SCHOOL_PROFILE } from '../config/firebase';
import { Award, Quote, Sparkles } from 'lucide-react';

export const SambutanKepala: React.FC = () => {
  const [profile, setProfile] = useState<SchoolProfile>(DEFAULT_SCHOOL_PROFILE);

  useEffect(() => {
    const unsub = subscribeToSchoolProfile((p) => {
      setProfile(p);
    });
    return () => unsub();
  }, []);

  return (
    <section id="sambutan" className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-paper-grid">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header Note */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-[#FEF3C7] border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] text-xs font-bold text-[#854D0E] uppercase tracking-wider rotate-[-1deg]">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Pesan Kasih Pendidik</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C241E] tracking-tight">
            Sambutan Kepala RA Almaqom
          </h2>
          <p className="mt-1 text-sm sm:text-base text-[#5C4F44] max-w-xl mx-auto">
            Membuka pintu gerbang masa emas ananda dengan doa, keteladanan akhlak, dan dekapan hangat.
          </p>
        </div>

        {/* Open Letter Scrapbook Memo Frame */}
        <div className="relative bg-[#FFFDF9] border-[3px] border-[#1C1917] rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_#1C1917]">
          
          {/* Top Washi Tape Decoration */}
          <div 
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-40 h-7 bg-amber-100/90 border-y border-amber-300/60 shadow-xs pointer-events-none"
            style={{ clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)' }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left: Polaroid Photo of Principal */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative p-3 bg-white border-2 border-[#1C1917] rounded-2xl shadow-[4px_4px_0px_#1C1917] rotate-[-2deg] transition-transform hover:rotate-0 max-w-xs w-full">
                
                {/* Photo Tape Accent */}
                <div className="absolute -top-2 -right-2 w-12 h-4 bg-rose-200/90 border border-rose-300 rotate-12 pointer-events-none" />

                <div className="aspect-[4/5] w-full rounded-xl overflow-hidden border border-black/20 bg-stone-100">
                  <img
                    src={profile.kepalaSekolahFotoUrl || DEFAULT_SCHOOL_PROFILE.kepalaSekolahFotoUrl}
                    alt={profile.kepalaSekolahNama}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="pt-3 text-center">
                  <p className="font-extrabold text-sm sm:text-base text-[#1C1917]">
                    {profile.kepalaSekolahNama}
                  </p>
                  <p className="text-xs font-semibold text-[#5B8266] font-mono mt-0.5">
                    {profile.kepalaSekolahGelar || 'Kepala RA Almaqom'}
                  </p>
                </div>
              </div>

              {/* Verified School Seal */}
              <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-[#EDF4EE] border border-[#2C4A34] rounded-full text-xs font-bold text-[#2C4A34]">
                <Award className="w-3.5 h-3.5" />
                <span>Terakreditasi Kemenag RI</span>
              </div>
            </div>

            {/* Right: Letter Narrative with lined paper feel */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="flex items-center gap-2 text-[#D96B43]">
                <Quote className="w-8 h-8 rotate-180 opacity-80" />
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] leading-snug">
                  {profile.sambutanJudul}
                </h3>
              </div>

              <div className="text-sm sm:text-base text-[#3D3028] leading-relaxed space-y-3 font-normal border-l-3 border-[#5B8266] pl-4 sm:pl-5">
                <p className="whitespace-pre-line">
                  {profile.sambutanIsi}
                </p>
              </div>

              {/* Signature / Stempel Penutup */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-dashed border-[#D6CEBF]">
                <div>
                  <p className="text-xs text-[#7D7569] font-mono">Tertanda Penuh Kasih,</p>
                  <p className="font-hand text-xl font-bold text-[#D96B43]">
                    {profile.kepalaSekolahNama}
                  </p>
                </div>

                <div className="px-3 py-1.5 bg-[#FAF6EE] border border-[#1C1917]/20 rounded-lg text-right">
                  <span className="text-[11px] font-mono font-bold text-[#5B8266] block">
                    TAHUN AJARAN 2026 / 2027
                  </span>
                  <span className="text-[10px] text-[#7D7569]">
                    Keluarga Besar RA Almaqom
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SambutanKepala;
