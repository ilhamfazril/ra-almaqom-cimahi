import React, { useState, useEffect } from 'react';
import { KontakSettings, subscribeToKontakSettings, DEFAULT_KONTAK_SETTINGS } from '../config/firebase';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  MessageCircle,
  Share2,
  Navigation
} from 'lucide-react';

export const KontakMaps: React.FC = () => {
  const [kontak, setKontak] = useState<KontakSettings>(DEFAULT_KONTAK_SETTINGS);

  useEffect(() => {
    const unsub = subscribeToKontakSettings((s) => {
      setKontak(s);
    });
    return () => unsub();
  }, []);

  const getWaLink = () => {
    const num = kontak.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(kontak.whatsappPesanDefault || 'Halo Panitia PPDB RA Almaqom...');
    return `https://wa.me/${num}?text=${text}`;
  };

  return (
    <section id="kontak" className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-paper-grid">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-[#EDF4EE] border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] text-xs font-bold text-[#2C4A34] uppercase tracking-wider rotate-[-1deg]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kunjungan & Layanan Informasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C241E] tracking-tight">
            Hubungi & Kunjungi RA Almaqom
          </h2>
          <p className="mt-1 text-sm sm:text-base text-[#5C4F44] max-w-xl mx-auto">
            Pintu silaturahmi selalu terbuka bagi Ayah & Bunda yang ingin mengenal lingkungan sekolah lebih dekat.
          </p>
        </div>

        {/* Main Grid: Contact Cards & Official Social App Buttons + Google Maps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Contact Info & App Logo Buttons (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* School Address & Office Hours Card */}
            <div className="bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-6 rounded-2xl shadow-[4px_4px_0px_#1C1917] space-y-4">
              <h3 className="text-lg font-extrabold text-[#1C1917] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D96B43]" />
                <span>Alamat Kantor & Lokasi</span>
              </h3>

              <p className="text-sm text-[#3D3028] leading-relaxed">
                {kontak.alamat}
              </p>

              <div className="pt-3 border-t border-dashed border-[#E8DFD1] space-y-2 text-xs text-[#5C4F44]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#5B8266]" />
                  <span><strong>Jam Pelayanan:</strong> Senin - Jumat (07.30 - 14.00 WIB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#5B8266]" />
                  <span><strong>Telepon Kantor:</strong> {kontak.telepon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#5B8266]" />
                  <span><strong>Email:</strong> {kontak.email}</span>
                </div>
              </div>
            </div>

            {/* Official App Logo Buttons Card */}
            <div className="bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-6 rounded-2xl shadow-[4px_4px_0px_#1C1917] space-y-4">
              <h3 className="text-base font-extrabold text-[#1C1917] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#5B8266]" />
                <span>Kanal Resmi & Media Sosial</span>
              </h3>
              <p className="text-xs text-[#6B6357]">
                Pilih aplikasi favorit Ayah/Bunda untuk terhubung langsung dengan tim kami:
              </p>

              {/* Grid of App Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                
                {/* WhatsApp Button */}
                <a
                  href={getWaLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#1C1917] bg-[#25D366] text-white shadow-[2px_2px_0px_#1C1917] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] transition-all font-bold text-xs"
                >
                  <WhatsAppIcon />
                  <span className="truncate">WhatsApp PPDB</span>
                </a>

                {/* Instagram Button */}
                <a
                  href={kontak.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#1C1917] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white shadow-[2px_2px_0px_#1C1917] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] transition-all font-bold text-xs"
                >
                  <InstagramIcon />
                  <span className="truncate">Instagram</span>
                </a>

                {/* YouTube Button */}
                <a
                  href={kontak.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#1C1917] bg-[#FF0000] text-white shadow-[2px_2px_0px_#1C1917] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] transition-all font-bold text-xs"
                >
                  <YouTubeIcon />
                  <span className="truncate">YouTube RA</span>
                </a>

                {/* TikTok Button */}
                <a
                  href={kontak.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#1C1917] bg-[#000000] text-white shadow-[2px_2px_0px_#1C1917] hover:bg-stone-800 active:translate-x-[1px] active:translate-y-[1px] transition-all font-bold text-xs"
                >
                  <TikTokIcon />
                  <span className="truncate">TikTok Resmi</span>
                </a>

              </div>

              {/* Direct WhatsApp Action Banner */}
              <div className="p-3 bg-[#EDF4EE] border border-[#2C4A34] rounded-xl flex items-center justify-between gap-3 text-xs text-[#1F3324]">
                <div>
                  <p className="font-bold">Konsultasi Cepat Panitia</p>
                  <p className="text-[11px] text-[#5C4F44]">Respon ramah & informatif via WA</p>
                </div>
                <a
                  href={getWaLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#2C4A34] text-white font-bold rounded-lg text-[11px] hover:bg-[#1F3324] whitespace-nowrap"
                >
                  Chat Sekarang →
                </a>
              </div>
            </div>

          </div>

          {/* Right: Embedded Google Maps (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-5 rounded-2xl shadow-[5px_5px_0px_#1C1917] h-full flex flex-col justify-between">
              
              {/* Tape Accent */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-amber-200/90 border border-amber-300 pointer-events-none"
                style={{ transform: 'translateX(-50%) rotate(0.5deg)' }}
              />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#D96B43]" />
                  <h3 className="font-extrabold text-base text-[#1C1917]">
                    Peta Lokasi Google Maps
                  </h3>
                </div>

                <a
                  href={kontak.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1917] text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka Rute di Google Maps</span>
                </a>
              </div>

              {/* Map Iframe Container */}
              <div className="relative w-full h-[320px] sm:h-[380px] lg:h-full min-h-[300px] rounded-xl overflow-hidden border-2 border-[#1C1917] bg-stone-100">
                <iframe
                  title="Peta Lokasi RA Almaqom"
                  src={kontak.mapsEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-3 text-xs text-[#7D7569] font-mono flex items-center justify-between">
                <span>📍 Titik Koordinat RA Almaqom</span>
                <span className="text-[#5B8266] font-bold">Akses Mudah & Parkir Luas</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

// SVG Icons for Official Apps
function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

export default KontakMaps;
