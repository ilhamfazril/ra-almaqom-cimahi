import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Calendar, Bookmark, Award, Sparkles, ZoomIn, X, Image as ImageIcon } from 'lucide-react';
import { subscribeToPrestasi, PrestasiItem } from '../config/firebase';

interface PrestasiMadingProps {
  onOpenAdmin?: () => void;
  maxDisplay?: number;
}

export const PrestasiMading: React.FC<PrestasiMadingProps> = ({
  onOpenAdmin,
  maxDisplay,
}) => {
  const [items, setItems] = useState<PrestasiItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);
  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; title: string; nama: string } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPrestasi(
      (data) => {
        setItems(data);
        setLoading(false);
      },
      (error) => {
        console.warn("Mading listener error:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Preset rotation angles for random / alternating dynamic rotation
  const rotationClasses = [
    '-rotate-1 hover:rotate-0',
    'rotate-2 hover:rotate-0',
    '-rotate-2 hover:rotate-0',
    'rotate-1 hover:rotate-0',
    '-rotate-3 hover:rotate-0',
    'rotate-3 hover:rotate-0',
  ];

  const categories = ['Semua', ...Array.from(new Set(items.map((i) => i.kategori)))];

  const filteredItems = selectedCategory === 'Semua' 
    ? items 
    : items.filter((i) => i.kategori === selectedCategory);

  const displayList = maxDisplay ? filteredItems.slice(0, maxDisplay) : filteredItems;

  const getCardBg = (warna?: string, idx: number = 0) => {
    switch (warna) {
      case 'sage':
        return 'bg-[#EDF4EE] border-[#2C4A34] text-[#1F3324]';
      case 'terracotta':
        return 'bg-[#FDF2ED] border-[#8C3A1D] text-[#4A1D0E]';
      case 'yellow':
        return 'bg-[#FEFCE8] border-[#854D0E] text-[#422006]';
      case 'cream':
      default:
        // Alternate smoothly if not specified
        const cycle = idx % 4;
        if (cycle === 1) return 'bg-[#EDF4EE] border-[#2C4A34] text-[#1F3324]';
        if (cycle === 2) return 'bg-[#FDF2ED] border-[#8C3A1D] text-[#4A1D0E]';
        if (cycle === 3) return 'bg-[#FEFCE8] border-[#854D0E] text-[#422006]';
        return 'bg-[#FFFDF9] border-[#1C1917] text-[#2C2B2A]';
    }
  };

  const getPinColor = (idx: number) => {
    const pins = ['#E07A5F', '#5B8266', '#E9C46A', '#264653'];
    return pins[idx % pins.length];
  };

  return (
    <section id="mading-prestasi" className="relative py-12 md:py-16">
      {/* Corkboard Container Frame */}
      <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border-4 border-[#3D3028] bg-cork-pattern shadow-[8px_8px_0px_#1C1917] overflow-hidden">
        
        {/* Corkboard Wooden Texture Border Accent & Header Note */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b-2 border-[#D3C8B4]/80">
          <div>
            {/* Visual Tag Note pinned */}
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-[#FEF3C7] border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] text-xs font-bold text-[#854D0E] uppercase tracking-wider rotate-[-1deg]">
              <PinIcon color="#D97706" />
              <span>Mading Prestasi & Foto Dokumentasi RA</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C241E] tracking-tight">
              Goresan Bangga Sang Juara Cilik
            </h2>
            <p className="mt-1 text-sm sm:text-base text-[#5C4F44] max-w-xl">
              Setiap ikhtiar dan foto momen juara ananda dirayakan dengan penuh sukacita. Ditempel langsung di papan mading sekolah dan dikelola via CMS Admin.
            </p>
          </div>

          {/* Interactive Category Filter Pills (clean segmented buttons) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#DFD5C2]/90 border-2 border-[#3D3028] rounded-xl shadow-[2px_2px_0px_#3D3028]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1C1917] text-[#FFFDF7] shadow-sm'
                    : 'text-[#3D3028] hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-[#5C4F44] font-medium flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#3D3028] border-t-transparent rounded-full animate-spin" />
            <p className="font-hand text-lg">Membuka lembaran mading sekolah...</p>
          </div>
        )}

        {/* Prestasi Grid with dynamic rotations, neo-brutalism borders & washi tape */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 pt-2">
            <AnimatePresence mode="popLayout">
              {displayList.map((item, idx) => {
                const rotationClass = item.rotasi 
                  ? (item.rotasi < 0 ? `-rotate-[${Math.abs(item.rotasi)}deg]` : `rotate-[${item.rotasi}deg]`)
                  : rotationClasses[idx % rotationClasses.length];

                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`relative p-5 sm:p-6 border-2 sm:border-[2.5px] shadow-[4px_4px_0px_#000] transition-transform duration-200 hover:scale-[1.02] hover:z-20 ${getCardBg(item.warnaKertas, idx)} ${rotationClass}`}
                  >
                    {/* Visual Cutout: Semi-transparent Washi Tape on top edge */}
                    <div 
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/85 border-y border-amber-300/40 backdrop-blur-xs shadow-xs pointer-events-none"
                      style={{
                        transform: `translateX(-50%) rotate(${((idx % 3) - 1) * 3}deg)`,
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)'
                      }}
                    />

                    {/* Corner Washi Tape Accent on alternating cards */}
                    {idx % 2 === 0 && (
                      <div 
                        className="absolute -top-2.5 -right-2.5 w-14 h-5 bg-rose-200/80 border border-rose-300/50 backdrop-blur-xs shadow-xs pointer-events-none"
                        style={{ transform: 'rotate(40deg)' }}
                      />
                    )}

                    {/* Realistic Push-Pin / Thumbtack with shadow */}
                    <div className="absolute -top-3 left-5 pointer-events-none z-10 flex items-center justify-center">
                      <div 
                        className="w-4 h-4 rounded-full shadow-[1px_2px_2px_rgba(0,0,0,0.35)] border border-black/30"
                        style={{ backgroundColor: getPinColor(idx) }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white/70 m-0.5" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="pt-2 flex flex-col justify-between h-full">
                      <div>
                        {/* Unboxed Metadata with Typographic Separator (Anti-Slop Rule) */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-black/60 mb-2 font-mono">
                          <span>{item.kategori}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 inline" />
                            {item.tahun}
                          </span>
                        </div>

                        {/* Title of Achievement */}
                        <h3 className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-[#1C1917] mb-2">
                          {item.judul}
                        </h3>

                        {/* Student Name / Group Name - Displayed directly as entered without automatic 'Ananda:' prefix */}
                        <div className="mb-3 inline-block px-2.5 py-0.5 bg-black/5 rounded border border-black/10">
                          <p className="font-hand text-base sm:text-lg font-bold text-[#D96B43]">
                            ★ {item.namaSiswa}
                          </p>
                        </div>

                        {/* 
                          POLAROID PHOTO SNAPSHOT (ANTI-SLOP MADING STYLE)
                          Rendered like a printed photo clipped or taped into the scrapbook note
                        */}
                        {item.fotoUrl && (
                          <div 
                            onClick={() => setActivePhotoModal({
                              url: item.fotoUrl!,
                              title: item.judul,
                              nama: item.namaSiswa
                            })}
                            className="group relative my-3 p-2 bg-white border-2 border-[#1C1917] rounded-lg shadow-[3px_3px_0px_#1C1917] cursor-pointer overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                            style={{ transform: `rotate(${((idx % 3) - 1) * 1.5}deg)` }}
                          >
                            {/* Photo Corner Tape Accent */}
                            <div className="absolute top-1 right-1 w-8 h-3 bg-amber-100/90 border border-amber-300/40 rotate-12 z-10 pointer-events-none" />

                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-stone-100 flex items-center justify-center">
                              <img
                                src={item.fotoUrl}
                                alt={`Dokumentasi ${item.judul} - ${item.namaSiswa}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  // Zero broken image policy: fallback container
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="flex flex-col items-center justify-center p-3 text-center text-[#5C4F44]">
                                        <span class="text-2xl mb-1">📸</span>
                                        <span class="text-[11px] font-bold font-mono">Dokumentasi Terpasang</span>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="p-1.5 rounded-full bg-white/90 text-black shadow-sm">
                                  <ZoomIn className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#6B6357] font-mono px-1">
                              <span>Foto Dokumentasi</span>
                              <span className="text-[10px] text-[#D96B43] font-bold">Klik perbesar</span>
                            </div>
                          </div>
                        )}

                        {/* Description / Keterangan with lined paper feel */}
                        <p className="text-xs sm:text-sm text-black/75 leading-relaxed font-normal">
                          {item.keterangan}
                        </p>
                      </div>

                      {/* Card Footer: Verified Stamp or School Badge */}
                      <div className="mt-5 pt-3 border-t border-black/15 flex items-center justify-between text-xs text-black/60">
                        <div className="flex items-center gap-1 text-[11px] font-medium font-sans">
                          <Trophy className="w-3.5 h-3.5 text-[#D96B43]" />
                          <span>RA Almaqom Terverifikasi</span>
                        </div>
                        <span className="font-hand text-sm font-bold text-[#5B8266]">
                          Alhamdulillah ✨
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayList.length === 0 && (
          <div className="py-14 text-center bg-white/80 border-2 border-dashed border-[#8C7A6B] rounded-2xl p-6">
            <Sparkles className="w-8 h-8 text-[#D96B43] mx-auto mb-2" />
            <p className="text-base font-bold text-[#2C241E]">Belum ada prestasi pada kategori ini</p>
            <p className="text-xs text-[#5C4F44] mt-1 font-hand text-base">
              Kunjungi dashboard admin untuk menempelkan lembaran prestasi baru beserta foto!
            </p>
          </div>
        )}

        {/* Bottom Bar: Action to add / manage if needed */}
        <div className="mt-10 pt-6 border-t-2 border-[#D3C8B4]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C4F44]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#D96B43]" />
            <span>
              Total <strong>{items.length} Prestasi & Dokumentasi</strong> santri terdokumentasi dalam lembaran digital.
            </span>
          </div>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFFDF7] text-[#1C1917] font-bold border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] hover:bg-[#F3EFE6] transition-colors rounded-lg text-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#5B8266]" />
              <span>Kelola Prestasi & Upload Foto via CMS</span>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Photo Zoom */}
      {activePhotoModal && (
        <div 
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#FFFDF9] border-[3px] border-[#1C1917] rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-[8px_8px_0px_#1C1917]"
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-black border border-black/20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-3">
              <h4 className="text-base sm:text-lg font-bold text-[#1C1917]">
                {activePhotoModal.title}
              </h4>
              <p className="text-xs font-bold text-[#D96B43] font-hand text-sm">
                ★ {activePhotoModal.nama}
              </p>
            </div>

            <div className="relative rounded-xl overflow-hidden border-2 border-[#1C1917] bg-stone-100 max-h-[65vh] flex items-center justify-center">
              <img
                src={activePhotoModal.url}
                alt={activePhotoModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            <div className="mt-3 text-right">
              <button
                onClick={() => setActivePhotoModal(null)}
                className="px-4 py-1.5 text-xs font-bold bg-[#1C1917] text-white rounded-lg"
              >
                Tutup Foto
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Subtle Push-Pin SVG Component
function PinIcon({ color = '#E07A5F' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill={color} stroke="#1C1917" strokeWidth="2" />
      <circle cx="10" cy="10" r="2.5" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

export default PrestasiMading;
