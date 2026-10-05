import React, { useState, useEffect } from 'react';
import { FasilitasItem, subscribeToFasilitas, DEFAULT_FASILITAS_LIST } from '../config/firebase';
import { Building2, Sparkles } from 'lucide-react';

export const FasilitasSekolah: React.FC = () => {
  const [fasilitasList, setFasilitasList] = useState<FasilitasItem[]>(DEFAULT_FASILITAS_LIST);

  useEffect(() => {
    const unsub = subscribeToFasilitas((list) => {
      setFasilitasList(list);
    });
    return () => unsub();
  }, []);

  return (
    <section id="fasilitas" className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-paper-grid">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-[#FEFCE8] border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] text-xs font-bold text-[#854D0E] uppercase tracking-wider rotate-[-1deg]">
            <Building2 className="w-3.5 h-3.5" />
            <span>Sarana & Lingkungan Ramah Anak</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C241E] tracking-tight">
            Fasilitas Ceria RA Almaqom
          </h2>
          <p className="mt-1 text-sm sm:text-base text-[#5C4F44] max-w-xl mx-auto">
            Dirancang khusus dengan standar kenyamanan, kebersihan, dan keselamatan tinggi untuk eksplorasi fitrah anak usia dini.
          </p>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {fasilitasList.map((fasilitas, idx) => (
            <div
              key={fasilitas.id}
              className="relative p-4 bg-white border-2 border-[#1C1917] rounded-2xl shadow-[4px_4px_0px_#1C1917] flex flex-col justify-between transition-transform hover:-translate-y-1"
            >
              {/* Corner Tape Accent */}
              <div 
                className="absolute -top-2.5 right-4 w-12 h-4 bg-amber-100/90 border border-amber-300/60 rotate-[-5deg] pointer-events-none" 
              />

              <div>
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border border-black/20 bg-stone-100 mb-3 shadow-xs">
                  <img
                    src={fasilitas.fotoUrl}
                    alt={fasilitas.nama}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <h3 className="font-extrabold text-base text-[#1C1917] mb-1.5 leading-snug">
                  {fasilitas.nama}
                </h3>

                <p className="text-xs text-[#5C4F44] leading-relaxed">
                  {fasilitas.deskripsi}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-dashed border-[#E8DFD1] flex items-center justify-between text-[11px] font-mono text-[#5B8266] font-bold">
                <span>Standar Ramah Anak</span>
                <span>✓ Terawat</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FasilitasSekolah;
