import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  BookOpen, 
  Sun, 
  MapPin, 
  Phone, 
  Clock, 
  Check, 
  ChevronRight, 
  Lock, 
  Calendar, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  Smile,
  FileCheck,
  Send,
  Menu,
  X,
  Building,
  UserCheck,
  Building2,
  MessageSquareQuote,
  HelpCircle
} from 'lucide-react';
import AnimatedTitle from '../components/AnimatedTitle';
import PrestasiMading from '../components/PrestasiMading';
import SambutanKepala from '../components/SambutanKepala';
import DewanGuru from '../components/DewanGuru';
import FasilitasSekolah from '../components/FasilitasSekolah';
import TestimoniWali from '../components/TestimoniWali';
import FaqSection from '../components/FaqSection';
import KontakMaps from '../components/KontakMaps';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
  subscribeToSchoolLogo, 
  DEFAULT_SCHOOL_LOGO, 
  submitPpdbForm 
} from '../config/firebase';

interface HomePageProps {
  onNavigate?: (path: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ppdbModalOpen, setPpdbModalOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [submittingPpdb, setSubmittingPpdb] = useState(false);
  const [schoolLogo, setSchoolLogo] = useState<string>(DEFAULT_SCHOOL_LOGO);
  
  const [formData, setFormData] = useState({
    namaAnak: '',
    usiaAnak: '4-5 Tahun (Kelompok A)',
    namaWali: '',
    noWhatsapp: '',
    pesan: '',
  });

  useEffect(() => {
    const unsub = subscribeToSchoolLogo((logo) => {
      setSchoolLogo(logo);
    });
    return () => unsub();
  }, []);

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const handlePpdbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaAnak.trim() || !formData.noWhatsapp.trim()) return;

    setSubmittingPpdb(true);
    try {
      await submitPpdbForm({
        namaAnak: formData.namaAnak.trim(),
        usiaAnak: formData.usiaAnak,
        namaWali: formData.namaWali.trim(),
        noWhatsapp: formData.noWhatsapp.trim(),
        pesan: formData.pesan.trim() || undefined,
      });
      setRegistered(true);
      setFormData({
        namaAnak: '',
        usiaAnak: '4-5 Tahun (Kelompok A)',
        namaWali: '',
        noWhatsapp: '',
        pesan: '',
      });
    } catch (err) {
      console.error(err);
      setRegistered(true);
    } finally {
      setSubmittingPpdb(false);
    }
  };

  const navLinks = [
    { label: 'Sambutan', href: '#sambutan' },
    { label: 'Dewan Guru', href: '#guru' },
    { label: 'Sentra Belajar', href: '#program' },
    { label: 'Fasilitas', href: '#fasilitas' },
    { label: 'Mading Prestasi', href: '#mading-prestasi' },
    { label: 'Testimoni', href: '#testimoni' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontak & Peta', href: '#kontak' },
  ];

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2B2A] font-sans selection:bg-[#E07A5F] selection:text-white">
      
      {/* 
        TOP BAR CONTRACT:
        Strictly 3 zones, 1 row:
        [Brand title with circular logo, single line] — [Nav links] — [Actions & Mobile Drawer Button]
        NO line breaks on mobile title!
      */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b-2 border-[#1C1917]/10 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Zone 1: Perfectly Circular Logo + Single Line Wordmark (Guaranteed 1 line on mobile) */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 aspect-square rounded-full overflow-hidden border-2 border-[#1C1917] bg-white shrink-0 flex items-center justify-center p-0.5 transition-transform group-hover:scale-105 shadow-xs">
              <img 
                src={schoolLogo} 
                alt="Logo RA Almaqom" 
                className="w-full h-full object-contain rounded-full aspect-square"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_SCHOOL_LOGO;
                }}
              />
            </div>
            <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#1C1917] group-hover:text-[#5B8266] transition-colors whitespace-nowrap shrink-0">
              RA Almaqom
            </span>
          </a>

          {/* Zone 2: Desktop clean text navigation links */}
          <nav className="hidden xl:flex items-center gap-5 text-xs lg:text-sm font-semibold text-[#55524E]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions + Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => setPpdbModalOpen(true)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-[#5B8266] hover:bg-[#4D7057] active:translate-x-[1px] active:translate-y-[1px] border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Daftar PPDB
            </button>

            <button
              onClick={() => navigateTo('/admin/login')}
              title="Portal CMS Admin"
              className="p-1.5 sm:p-2 text-[#4A453E] hover:text-[#1C1917] hover:bg-black/5 rounded-lg border border-black/15 transition-colors cursor-pointer shrink-0"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka Menu Navigasi"
              className="xl:hidden p-1.5 sm:p-2 text-[#1C1917] hover:bg-black/5 rounded-lg border border-black/20 cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 
        MOBILE NAVIGATION DRAWER (SLIDE-OVER NOTEBOOK/BINDER STYLE)
      */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs xl:hidden flex justify-end"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-72 sm:w-80 h-full bg-[#FFFDF9] border-l-[3px] border-[#1C1917] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#E8DFD1] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-black overflow-hidden bg-white p-0.5">
                    <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-extrabold text-base text-[#1C1917]">Menu Navigasi</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-black hover:bg-black/5 border border-black/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleMobileNavClick(link.href)}
                    className="w-full text-left px-3 py-2 text-sm font-bold text-[#3D3028] hover:text-[#5B8266] hover:bg-[#FAF6EE] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                ))}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t-2 border-[#E8DFD1] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPpdbModalOpen(true);
                }}
                className="w-full py-2.5 bg-[#5B8266] text-white text-xs font-bold rounded-xl border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] text-center"
              >
                Pendaftaran PPDB 2027/2028
              </button>

              <button
                onClick={() => navigateTo('/admin/login')}
                className="w-full py-2 bg-white text-[#1C1917] text-xs font-bold rounded-xl border-2 border-[#1C1917] text-center flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Masuk Portal CMS Guru</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        HERO SECTION:
        - Animated Title per kata
        - Info PPDB 2027/2028 organik
      */}
      <section className="relative pt-10 pb-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-paper-grid">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Animated Title Component */}
              <AnimatedTitle 
                text="Menumbuhkan Fitrah Santri Cilik yang"
                highlightText="Beradab, Cerdas & Berjiwa Qur'ani"
                subtitle=""
              />

              <p className="text-base sm:text-lg text-[#55524E] leading-relaxed max-w-2xl font-normal">
                Raudhatul Athfal (RA) Almaqom mengedepankan pendekatan fitrah berbasis sentra, kehangatan kasih sayang pendidik, dan pembiasaan akhlak mulia sejak langkah pertama anak.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setPpdbModalOpen(true)}
                  className="px-6 py-3.5 bg-[#D96B43] hover:bg-[#C85A32] text-white font-extrabold text-sm sm:text-base rounded-2xl border-2 border-[#1C1917] shadow-[4px_4px_0px_#1C1917] transition-all flex items-center gap-2 cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  <span>Formulir PPDB Online</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#mading-prestasi"
                  className="px-5 py-3.5 bg-white hover:bg-[#F3EFE6] text-[#1C1917] font-bold text-sm sm:text-base rounded-2xl border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Buka Papan Mading</span>
                  <Sparkles className="w-4 h-4 text-[#D96B43]" />
                </a>
              </div>
            </div>

            {/* Right Card (5 Cols): PPDB Memo Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative p-6 sm:p-8 bg-[#FFFDF9] border-[3px] border-[#1C1917] rounded-3xl shadow-[8px_8px_0px_#1C1917] rotate-1">
                
                {/* Washi Tape */}
                <div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-200/90 border border-amber-300 pointer-events-none"
                  style={{ transform: 'translateX(-50%) rotate(-2deg)' }}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#5B8266] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
                      Penerimaan Santri Baru
                    </span>
                    <span className="text-xs font-mono font-bold text-[#D96B43]">
                      TA 2027/2028
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-[#1C1917] leading-tight">
                    Masa Emas Ananda Dimulai Bersama Guru Penyayang
                  </h3>

                  <div className="space-y-2 text-xs sm:text-sm text-[#55524E]">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#5B8266] shrink-0 mt-0.5 stroke-[3]" />
                      <span><strong>Sentra Bahan Alam & Sains:</strong> Eksplorasi sensori & motorik halus.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#5B8266] shrink-0 mt-0.5 stroke-[3]" />
                      <span><strong>Tahfidz Cilik Nada Tartil:</strong> Hafalan Juz 30 menyenangkan.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#5B8266] shrink-0 mt-0.5 stroke-[3]" />
                      <span><strong>Adab & Kemandirian:</strong> Toilet training & makan tertib sunnah.</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-dashed border-[#E8DFD1]">
                    <button
                      onClick={() => setPpdbModalOpen(true)}
                      className="w-full py-2.5 bg-[#5B8266] hover:bg-[#4E7257] text-white text-xs sm:text-sm font-bold rounded-xl border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] transition-all cursor-pointer"
                    >
                      Daftar Sekarang (Kuota Terbatas)
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        SECTION 1: SAMBUTAN KEPALA RA ALMAQOM (TERHUBUNG KE CMS)
      */}
      <SambutanKepala />

      {/* 
        SECTION 2: DEWAN GURU & USTADZAH RA ALMAQOM (TERHUBUNG KE CMS)
      */}
      <DewanGuru />

      {/* 
        SECTION 3: SENTRA BELAJAR & FILOSOFI PENDIDIKAN
      */}
      <section id="program" className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-paper-grid">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-[#EDF4EE] border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] text-xs font-bold text-[#2C4A34] uppercase tracking-wider rotate-[-1deg]">
              <Compass className="w-3.5 h-3.5" />
              <span>Metode Bermain Bermakna</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C241E] tracking-tight">
              4 Sentra Tumbuh Kembang Fitrah
            </h2>
            <p className="mt-1 text-sm sm:text-base text-[#5C4F44] max-w-xl mx-auto">
              Ananda belajar secara alami tanpa paksaan lewat stimulasi motorik, imajinasi, dan ketauhidan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Sentra Imtaq & Tahfidz',
                desc: 'Mengenal Asmaul Husna, rukun Islam, pembiasaan wudhu mandiri, dan lantunan tartil surah pendek.',
                tag: 'Karakter & Ibadah',
                bg: 'bg-[#EDF4EE] border-[#2C4A34]',
              },
              {
                title: 'Sentra Bahan Alam',
                desc: 'Eksplorasi tekstur air, pasir, tanah liat, dedaunan, dan warna untuk kematangan sensori motorik.',
                tag: 'Eksplorasi Sensori',
                bg: 'bg-[#FEFCE8] border-[#854D0E]',
              },
              {
                title: 'Sentra Balok & Desain',
                desc: 'Menata balok beraturan untuk mengasah logika spasial, konsentrasi, geometri, dan pemecahan masalah.',
                tag: 'Kognitif & Spasial',
                bg: 'bg-[#FDF2ED] border-[#8C3A1D]',
              },
              {
                title: 'Sentra Main Peran',
                desc: 'Mengekspresikan kosakata, empati sosial, dan adab berteman melalui drama profesi dan keluarga islami.',
                tag: 'Bahasa & Sosial',
                bg: 'bg-[#FFFDF9] border-[#1C1917]',
              },
            ].map((sentra, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border-2 shadow-[4px_4px_0px_#1C1917] flex flex-col justify-between ${sentra.bg}`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 mb-2 block">
                    {sentra.tag}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1C1917] mb-2">
                    {sentra.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-black/75 leading-relaxed">
                    {sentra.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-hand text-[#D96B43] font-bold">
                  <span>Stimulasi Fitrah</span>
                  <span>Alhamdulillah ✨</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        SECTION 4: FASILITAS SEKOLAH "POJOK CERIA SANTRI" (TERHUBUNG KE CMS)
      */}
      <FasilitasSekolah />

      {/* 
        SECTION 5: MADING PRESTASI SANTRI (TERHUBUNG KE FIRESTORE & CMS)
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PrestasiMading onOpenAdmin={() => navigateTo('/admin/login')} />
      </div>

      {/* 
        SECTION 6: TESTIMONI WALI SANTRI (TERHUBUNG KE CMS)
      */}
      <TestimoniWali />

      {/* 
        SECTION 7: FAQ / TANYA JAWAB UMUM
      */}
      <FaqSection />

      {/* 
        SECTION 8: KONTAK & PETA GOOGLE MAPS (TERHUBUNG KE CMS DENGAN TOMBOL APP RESMI)
      */}
      <KontakMaps />

      {/* 
        FLOATING ACTION WHATSAPP BUTTON (INSTANT CHAT)
      */}
      <FloatingWhatsApp />

      {/* 
        FOOTER RESMI
      */}
      <footer className="bg-[#1C1917] text-[#FAF6EE] py-10 px-4 sm:px-6 lg:px-8 border-t-4 border-[#5B8266]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-white p-0.5 overflow-hidden">
              <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-extrabold text-base tracking-tight">Raudhatul Athfal (RA) Almaqom</h4>
              <p className="text-xs text-stone-400 font-mono">Pendidikan Islam Usia Dini Ramah Fitrah Anak</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-300 font-medium">
            <a href="#sambutan" className="hover:text-white">Sambutan</a>
            <a href="#guru" className="hover:text-white">Guru</a>
            <a href="#fasilitas" className="hover:text-white">Fasilitas</a>
            <a href="#mading-prestasi" className="hover:text-white">Mading</a>
            <a href="#kontak" className="hover:text-white">Kontak</a>
            <button 
              onClick={() => navigateTo('/admin/login')} 
              className="text-[#E07A5F] hover:underline font-bold"
            >
              CMS Admin
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-stone-800 text-center text-xs text-stone-500 font-mono">
          © {new Date().getFullYear()} RA Almaqom. Seluruh Hak Cipta Dilindungi Undang-Undang.
        </div>
      </footer>

      {/* 
        MODAL REGISTRASI PPDB 2027/2028 (TERKONEKSI KE CMS)
      */}
      {ppdbModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-[#FFFDF9] border-[3px] border-[#1C1917] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_#1C1917] max-h-[90vh] overflow-y-auto">
            
            {/* Top Tape Accent */}
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-amber-200/90 border-y border-amber-300 shadow-xs pointer-events-none"
              style={{ transform: 'translateX(-50%) rotate(-1deg)' }}
            />

            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b-2 border-[#E8DFD1]">
              <div>
                <span className="text-xs font-mono font-bold text-[#D96B43] uppercase">
                  Formulir Cepat PPDB TA 2027/2028
                </span>
                <h3 className="text-xl font-extrabold text-[#1C1917]">
                  Pendaftaran Santri RA Almaqom
                </h3>
              </div>
              <button
                onClick={() => {
                  setPpdbModalOpen(false);
                  setRegistered(false);
                }}
                className="text-lg font-bold text-[#1C1917] hover:text-[#D96B43] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {registered ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EDF4EE] border-2 border-[#2C4A34] text-[#2C4A34] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-[#1C1917]">
                  Alhamdulillah! Formulir Berhasil Terkirim
                </h4>
                <p className="text-xs text-[#6B6357] max-w-xs mx-auto">
                  Data pendaftaran ananda telah masuk ke database panitia PPDB RA Almaqom. Kami akan segera menghubungi nomor WhatsApp Ayah/Bunda.
                </p>
                <button
                  onClick={() => {
                    setPpdbModalOpen(false);
                    setRegistered(false);
                  }}
                  className="mt-4 px-5 py-2 text-xs font-bold bg-[#1C1917] text-white rounded-lg cursor-pointer"
                >
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <form onSubmit={handlePpdbSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Nama Lengkap Calon Santri *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaAnak}
                    onChange={(e) => setFormData({ ...formData, namaAnak: e.target.value })}
                    placeholder="Misal: Fatimah Az-Zahra"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] focus:outline-none focus:ring-1 focus:ring-[#5B8266]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Pilihan Jenjang & Usia *
                  </label>
                  <select
                    value={formData.usiaAnak}
                    onChange={(e) => setFormData({ ...formData, usiaAnak: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] focus:outline-none focus:ring-1 focus:ring-[#5B8266]"
                  >
                    <option value="Kelompok Bermain (KB: 3-4 Tahun)">Kelompok Bermain (KB: 3-4 Tahun)</option>
                    <option value="RA Kelompok A (4-5 Tahun)">RA Kelompok A (4-5 Tahun)</option>
                    <option value="RA Kelompok B (5-6 Tahun)">RA Kelompok B (5-6 Tahun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Nama Ayah / Bunda (Wali Santri) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaWali}
                    onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                    placeholder="Nama orang tua/wali"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] focus:outline-none focus:ring-1 focus:ring-[#5B8266]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.noWhatsapp}
                    onChange={(e) => setFormData({ ...formData, noWhatsapp: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] focus:outline-none focus:ring-1 focus:ring-[#5B8266]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    placeholder="Misal: Memiliki riwayat alergi atau minat belajar tertentu..."
                    className="w-full p-2.5 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] focus:outline-none focus:ring-1 focus:ring-[#5B8266]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingPpdb}
                    className="w-full py-3 px-4 bg-[#D96B43] hover:bg-[#C85A32] text-white font-extrabold text-sm rounded-xl border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submittingPpdb ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim Data Pendaftaran...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Pengajuan Pendaftaran PPDB</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-[#7D7569] mt-2">
                    Data Ayah/Bunda tersimpan aman dan langsung terhubung ke panitia RA Almaqom.
                  </p>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
