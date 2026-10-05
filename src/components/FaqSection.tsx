import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Apakah ada tes calistung (baca, tulis, hitung) saat seleksi masuk?',
    a: 'Sama sekali tidak ada. Di RA Almaqom, proses observasi penerimaan santri baru berlangsung ceria melalui bermain bersama, mendengarkan cerita, dan mengenal lingkungan sekolah dengan nyaman tanpa tekanan akademik.',
  },
  {
    q: 'Berapa batasan usia calon santri untuk Kelompok A dan Kelompok B?',
    a: 'Untuk Kelompok Bermain (KB) usia 3 - 4 tahun, Kelompok A berusia 4 - 5 tahun, dan Kelompok B berusia 5 - 6 tahun terhitung per Juli tahun ajaran berjalan.',
  },
  {
    q: 'Berapa rasio jumlah guru dan murid di setiap kelas/sentra?',
    a: 'Kami menerapkan rasio ideal yaitu 1 orang pendidik mendampingi 7 hingga 8 santri, sehingga perhatian kasih sayang, pemantauan adab, dan stimulasi fitrah ananda berjalan secara optimal dan personal.',
  },
  {
    q: 'Bagaimana penanganan anak yang masih dalam tahap toilet training?',
    a: 'Ustadzah dan pendidik kami sangat sabar dan terlatih membimbing kemandirian buang air santri secara berkala dengan toilet khusus anak yang bersih dan higienis, serta bekerja sama erat dengan Ayah/Bunda di rumah.',
  },
  {
    q: 'Apakah ada program hafalan Al-Qur\'an untuk santri cilik?',
    a: 'Ya, ada program Tahfidz Cilik Juz 30 dengan metode tartil nada merdu yang menyenangkan. Santri diajak melafalkan ayat suci bersamaan dengan gerak isyarat makna tanpa paksaan hafalan yang membebani.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF6EE] border-t-2 border-[#1C1917]/10">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-[#FEF3C7] border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] text-xs font-bold text-[#854D0E] uppercase tracking-wider rotate-[1deg]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tanya Jawab Seputar Sekolah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C241E] tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="mt-1 text-sm sm:text-base text-[#5C4F44]">
            Jawaban lengkap untuk pertanyaan umum Ayah & Bunda seputar pembelajaran dan PPDB.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border-2 border-[#1C1917] rounded-2xl shadow-[3px_3px_0px_#1C1917] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#1C1917] flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D96B43] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#5C4F44] leading-relaxed border-t border-dashed border-[#E8DFD1] pt-3">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
