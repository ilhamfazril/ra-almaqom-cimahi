import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc,
  setDoc,
  deleteDoc, 
  doc, 
  onSnapshot, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocFromServer,
  Firestore 
} from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

export interface PrestasiItem {
  id: string;
  namaSiswa: string;
  judul: string;
  kategori: string;
  tahun: string;
  keterangan: string;
  warnaKertas?: 'cream' | 'sage' | 'terracotta' | 'yellow';
  rotasi?: number;
  fotoUrl?: string;
  createdAt?: any;
}

// Preset photo options available for CMS selection or fallback
export const PRESET_FOTO_PRESTASI = [
  {
    id: 'tahfidz',
    label: 'Tahfidz & Wisuda Al-Qur\'an',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    fallbackEmoji: '📖'
  },
  {
    id: 'kaligrafi',
    label: 'Kuas Lukis & Kaligrafi Cilik',
    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    fallbackEmoji: '🎨'
  },
  {
    id: 'piala',
    label: 'Piala Emas & Medali Juara',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
    fallbackEmoji: '🏆'
  },
  {
    id: 'senam',
    label: 'Ketangkasan & Olahraga Santri',
    url: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=600&q=80',
    fallbackEmoji: '⭐'
  },
  {
    id: 'rebana',
    label: 'Grup Musik & Shalawat Anak',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    fallbackEmoji: '🥁'
  },
];

// Initial seed data for authentic RA Almaqom scrapbook mading
export const INITIAL_PRESTASI: PrestasiItem[] = [
  {
    id: 'p0-matamuda',
    namaSiswa: 'Siswa Baru RA Almaqom',
    judul: 'Kegiatan Matamuda',
    kategori: 'Sains Cilik & Kognitif',
    tahun: '2026/2027',
    keterangan: 'KEGIATAN MATAMUDA ( Masa Ta\'aruf Murid Madrasah ) - Pengenalan lingkungan belajar ceria, ramah dan menyenangkan.',
    warnaKertas: 'cream',
    rotasi: 0,
    fotoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p1',
    namaSiswa: 'Aisyah Humaira (Kelompok B)',
    judul: 'Juara 1 Tahfidz Juz 30 & Tartil Merdu',
    kategori: 'Tahfidz Al-Qur\'an',
    tahun: '2026',
    keterangan: 'Fasih melafalkan Surah An-Naba hingga An-Nas dengan tajwid tartil makharijul huruf sempurna pada Porseni RA Tingkat Kota.',
    warnaKertas: 'cream',
    rotasi: -2,
    fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p2',
    namaSiswa: 'Muhammad Zayyan Al-Fatih (Kelompok B)',
    judul: 'Medali Emas Kaligrafi Cilik & Mewarnai',
    kategori: 'Seni Rupa Islami',
    tahun: '2026',
    keterangan: 'Karya goresan asmaul husna penuh harmoni warna alam di Festival Kreativitas Anak Usia Dini Se-Provinsi.',
    warnaKertas: 'sage',
    rotasi: 2,
    fotoUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p3',
    namaSiswa: 'Bilal Rayyan Pratama (Kelompok A)',
    judul: 'Juara 2 Dai Cilik & Hafalan Doa Harian',
    kategori: 'Dakwah & Adab',
    tahun: '2026',
    keterangan: 'Penampilan percaya diri membawakan tausiyah singkat "Berbakti Kepada Ayah & Bunda" di hadapan dewan juri.',
    warnaKertas: 'terracotta',
    rotasi: -1,
    fotoUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p4',
    namaSiswa: 'Khadijah Azzahra (Kelompok B)',
    judul: 'Juara 1 Senam Irama Ceria & Motorik Halus',
    kategori: 'Ketangkasan & Olahraga',
    tahun: '2026',
    keterangan: 'Kekompakan gerak motorik berirama nasyid anak ceria pada Pekan Olahraga Santri Cilik (Poscil).',
    warnaKertas: 'yellow',
    rotasi: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p5',
    namaSiswa: 'Kelompok Ar-Rahman (Tim Ananda Bintang)',
    judul: 'Juara Harapan 1 Musik Rebana & Shalawat Cilik',
    kategori: 'Kesenian Tradisional',
    tahun: '2025/2026',
    keterangan: 'Perpaduan tabuhan rebana ritmis dan lantunan shalawat tibbil qulub yang menyejukkan hati.',
    warnaKertas: 'sage',
    rotasi: -2,
    fotoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  },
];

// Firebase Client Configuration
// Supports environment variables (Vite & Vercel compatible)
const getEnv = (viteKey: string, nextKey?: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[viteKey]) return String(import.meta.env[viteKey]);
    if (nextKey && import.meta.env[nextKey]) return String(import.meta.env[nextKey]);
  }
  return '';
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_API_KEY') || firebaseAppletConfig?.apiKey || "AIzaSyADw1rMo-kXAdR5zqfttSZf3bENiRkwpHQ",
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN') || firebaseAppletConfig?.authDomain || "decisive-emitter-hds98.firebaseapp.com",
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID') || firebaseAppletConfig?.projectId || "decisive-emitter-hds98",
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET') || firebaseAppletConfig?.storageBucket || "decisive-emitter-hds98.firebasestorage.app",
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID') || firebaseAppletConfig?.messagingSenderId || "30956939153",
  appId: getEnv('VITE_FIREBASE_APP_ID', 'NEXT_PUBLIC_FIREBASE_APP_ID') || firebaseAppletConfig?.appId || "1:30956939153:web:f70e253134ddd9e118dc30",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isFirestoreAvailable = false;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  const customDbId = getEnv('VITE_FIREBASE_DATABASE_ID', 'NEXT_PUBLIC_FIREBASE_DATABASE_ID') || firebaseAppletConfig?.firestoreDatabaseId || "ai-studio-raalmaqommadingd-b0e7d9c2-5118-4fb5-9d3c-b55d334914c4";
  if (customDbId) {
    db = getFirestore(app, customDbId);
  } else {
    db = getFirestore(app);
  }

  // Real database is now permanently connected
  isFirestoreAvailable = true;
} catch (error) {
  console.warn("Firestore initialization fallback active:", error);
}

// Test connection on boot as recommended by skill
if (db && isFirestoreAvailable) {
  (async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  })();
}

export { app, db, isFirestoreAvailable };

const LOCAL_STORAGE_KEY = 'ra_almaqom_prestasi_cache';

// Client-side image compression to prevent exceeding browser localStorage quota (5MB limit)
export function compressImage(fileOrBase64: File | string, maxWidth = 1000, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve(typeof fileOrBase64 === 'string' ? fileOrBase64 : '');
    }
    // If it's an external URL (http/https), return as is
    if (typeof fileOrBase64 === 'string' && !fileOrBase64.startsWith('data:image')) {
      return resolve(fileOrBase64);
    }
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(typeof fileOrBase64 === 'string' ? fileOrBase64 : '');
      ctx.drawImage(img, 0, 0, width, height);
      // Produce compressed JPEG data URL
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => {
      resolve(typeof fileOrBase64 === 'string' ? fileOrBase64 : '');
    };
    if (typeof fileOrBase64 === 'string') {
      img.src = fileOrBase64;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.readAsDataURL(fileOrBase64);
    }
  });
}

// Helper to access LocalStorage cache with seamless resilience
export function getLocalPrestasi(): PrestasiItem[] {
  if (typeof window === 'undefined') return INITIAL_PRESTASI;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRESTASI));
      return INITIAL_PRESTASI;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure that user-uploaded items like Matamuda are safely retained
      const hasMatamuda = parsed.some((p: PrestasiItem) => p.judul?.toLowerCase().includes('matamuda'));
      if (!hasMatamuda && INITIAL_PRESTASI.length > 0) {
        const merged = [INITIAL_PRESTASI[0], ...parsed];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRESTASI));
    return INITIAL_PRESTASI;
  } catch (err) {
    console.error("Error reading local prestasi:", err);
    return INITIAL_PRESTASI;
  }
}

export function setLocalPrestasi(items: PrestasiItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Error saving local prestasi:", err);
  }
}

// Subscribe to Prestasi (Firestore with seamless local-first real-time fallback)
export function subscribeToPrestasi(
  onData: (items: PrestasiItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  // Always initialize with cached/local data first for instant 0ms latency rendering
  const initial = getLocalPrestasi();
  onData(initial);

  if (!db || !isFirestoreAvailable) {
    // Listen to local changes across tabs or in-memory actions
    const handleStorageChange = () => {
      onData(getLocalPrestasi());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('prestasi_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('prestasi_updated', handleStorageChange);
    };
  }

  try {
    const q = query(collection(db, 'prestasi'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PrestasiItem[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              namaSiswa: d.namaSiswa || '',
              judul: d.judul || '',
              kategori: d.kategori || 'Prestasi',
              tahun: d.tahun || '2026',
              keterangan: d.keterangan || '',
              warnaKertas: d.warnaKertas || 'cream',
              rotasi: typeof d.rotasi === 'number' ? d.rotasi : 0,
              fotoUrl: d.fotoUrl || '',
              createdAt: d.createdAt,
            };
          });
          setLocalPrestasi(list);
          onData(list);
        } else {
          // If firestore is empty, seed initial data or keep local
          onData(initial);
        }
      },
      (error) => {
        console.warn("Firestore onSnapshot error, maintaining local state:", error);
        if (onError) onError(error);
        onData(getLocalPrestasi());
      }
    );
    return unsubscribe;
  } catch (error: any) {
    console.warn("Failed to attach firestore listener:", error);
    if (onError) onError(error);
    return () => {};
  }
}

// Add Prestasi (Firestore + Local fallback)
export async function addPrestasi(item: Omit<PrestasiItem, 'id'>): Promise<string> {
  const current = getLocalPrestasi();
  const newItemId = 'p_' + Date.now();
  const newItem: PrestasiItem = {
    ...item,
    id: newItemId,
    createdAt: new Date().toISOString(),
  };

  // Optimistic local update
  const updated = [newItem, ...current];
  setLocalPrestasi(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('prestasi_updated'));
  }

  if (db && isFirestoreAvailable) {
    try {
      const docRef = await addDoc(collection(db, 'prestasi'), {
        ...item,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.warn("Firestore write error, preserved in local storage:", err);
      return newItemId;
    }
  }

  return newItemId;
}

// Update Prestasi (Firestore + Local fallback)
export async function updatePrestasi(id: string, updatedFields: Partial<Omit<PrestasiItem, 'id'>>): Promise<void> {
  const current = getLocalPrestasi();
  const updated = current.map((item) => {
    if (item.id === id) {
      return { ...item, ...updatedFields };
    }
    return item;
  });
  setLocalPrestasi(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('prestasi_updated'));
  }

  if (db && isFirestoreAvailable) {
    try {
      await updateDoc(doc(db, 'prestasi', id), {
        ...updatedFields,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore update error, preserved in local storage:", err);
    }
  }
}

// Delete Prestasi (Firestore + Local fallback)
export async function deletePrestasi(id: string): Promise<void> {
  const current = getLocalPrestasi();
  const filtered = current.filter((item) => item.id !== id);
  setLocalPrestasi(filtered);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('prestasi_updated'));
  }

  if (db && isFirestoreAvailable) {
    try {
      await deleteDoc(doc(db, 'prestasi', id));
    } catch (err) {
      console.warn("Firestore delete error, removed locally:", err);
    }
  }
}

// ==========================================
// School Logo Constants & Default
// ==========================================
export const SCHOOL_LOGO_KEY = 'ra_almaqom_school_logo';

// Default circular emblem SVG for RA Almaqom
export const DEFAULT_SCHOOL_LOGO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%235B8266" stroke="%231C1917" stroke-width="4"/><circle cx="50" cy="50" r="41" fill="none" stroke="%23FAF6EE" stroke-width="2" stroke-dasharray="3 3"/><circle cx="50" cy="50" r="34" fill="%23FAF6EE"/><path d="M50 24L53 33H62L55 38L57 47L50 42L43 47L45 38L38 33H47Z" fill="%23D96B43"/><path d="M33 55C33 55 42 50 50 55C58 50 67 55 67 55C67 66 58 72 50 72C42 72 33 66 33 55Z" fill="%235B8266"/><text x="50" y="82" font-size="8" font-weight="900" font-family="sans-serif" text-anchor="middle" fill="%231C1917">RA ALMAQOM</text></svg>';

// ==========================================
// School Profile & Sambutan Kepala Sekolah
// ==========================================
export interface SchoolProfile {
  logoUrl: string;
  namaSekolah: string;
  sambutanJudul: string;
  sambutanIsi: string;
  kepalaSekolahNama: string;
  kepalaSekolahGelar: string;
  kepalaSekolahFotoUrl: string;
}

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  logoUrl: DEFAULT_SCHOOL_LOGO,
  namaSekolah: 'RA Almaqom',
  sambutanJudul: 'Menebar Cinta, Menumbuhkan Fitrah Qur\'ani Sejak Langkah Pertama',
  sambutanIsi: 'Bismillâhirrahmânirrahîm. Segala puji bagi Allah Swt. yang telah mempercayakan amanah terindah berupa buah hati tercinta kepada kita. Di Raudhatul Athfal (RA) Almaqom, kami memandang setiap anak bukan sebagai bejana kosong yang harus dipaksa dijejali calistung, melainkan benih fitrah mulia yang siap mekar dengan kehangatan kasih sayang, keteladanan akhlak, dan keceriaan bermain di sentra-sentra fitrah. Mari bersama mendampingi masa emas ananda dengan doa dan ikhtiar terbaik.',
  kepalaSekolahNama: 'Hj. Siti Maryam, S.Pd.I., M.Pd.',
  kepalaSekolahGelar: 'Kepala RA Almaqom',
  kepalaSekolahFotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
};

// ==========================================
// Dewan Guru / Pendidik RA Almaqom
// ==========================================
export interface GuruItem {
  id: string;
  nama: string;
  peran: string;
  moto: string;
  fotoUrl: string;
  warnaKertas?: 'cream' | 'sage' | 'terracotta' | 'yellow';
}

export const DEFAULT_GURU_LIST: GuruItem[] = [
  {
    id: 'g1',
    nama: 'Ustadzah Rahmawati, S.Pd.',
    peran: 'Wali Kelompok Bintang (Usia 5-6 Tahun)',
    moto: 'Menyemai rasa ingin tahu santri lewat eksperimen sains dan goresan warna alam.',
    fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    warnaKertas: 'cream',
  },
  {
    id: 'g2',
    nama: 'Ustadzah Fatimah Azzahra, S.Ag.',
    peran: 'Pengampu Sentra Imtaq & Tahfidz Cilik',
    moto: 'Melantunkan Al-Qur\'an dengan senyuman agar ayat-ayat suci menancap hangat di dada ananda.',
    fotoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    warnaKertas: 'sage',
  },
  {
    id: 'g3',
    nama: 'Ustadzah Nurul Hidayah, S.Pd.Aud.',
    peran: 'Wali Kelompok Mentari (Usia 4-5 Tahun)',
    moto: 'Mendampingi kemandirian motorik dan toilet training dengan sabar penuh pelukan.',
    fotoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    warnaKertas: 'terracotta',
  },
  {
    id: 'g4',
    nama: 'Ustadzah Anisa Fitriani, S.Pd.',
    peran: 'Pengampu Sentra Balok & Rancang Bangun',
    moto: 'Membangun logika spasial, kerja sama tim, dan ketangkasan santri sejak usia dini.',
    fotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    warnaKertas: 'yellow',
  },
];

// ==========================================
// Fasilitas Sekolah
// ==========================================
export interface FasilitasItem {
  id: string;
  nama: string;
  deskripsi: string;
  fotoUrl: string;
}

export const DEFAULT_FASILITAS_LIST: FasilitasItem[] = [
  {
    id: 'f1',
    nama: 'Ruang Sentra Belajar Tematik',
    deskripsi: 'Ruangan ber-AC sejuk dengan sudut sudut tumpul aman, dilengkapi alat peraga edukatif alami ramah anak.',
    fotoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f2',
    nama: 'Playground Outdoor Rumput Sintetis',
    deskripsi: 'Area stimulasi motorik kasar berlantai rumput lembut dengan ayunan, perosotan, dan panjatan aman.',
    fotoUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f3',
    nama: 'Mushalla Cilik An-Nuur',
    deskripsi: 'Tempat pembiasaan shalat dhuha berjamaah, hafalan doa harian, dan wudhu mandiri ramah postur santri.',
    fotoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'f4',
    nama: 'Pojok Baca & Literasi Ceria',
    deskripsi: 'Koleksi ratusan buku cerita bergambar islami, ensiklopedia hewan ciptaan Allah, dan dongeng akhlak terpuji.',
    fotoUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
  },
];

// ==========================================
// Testimoni Wali Santri
// ==========================================
export interface TestimoniItem {
  id: string;
  namaWali: string;
  santri: string;
  isi: string;
  warna?: 'cream' | 'sage' | 'terracotta' | 'yellow';
}

export const DEFAULT_TESTIMONI_LIST: TestimoniItem[] = [
  {
    id: 't1',
    namaWali: 'Bunda Sarah & Ayah Dimas',
    santri: 'Orang Tua dari Ananda Kenzo (Kelompok B)',
    isi: 'MasyaAllah, Kenzo yang tadinya pemalu sekali, sekarang selalu antusias ke sekolah. Pulang-pulang hafal doa makan dan rajin ajak kami shalat maghrib berjamaah.',
    warna: 'cream',
  },
  {
    id: 't2',
    namaWali: 'Mama Nadia',
    santri: 'Orang Tua dari Ananda Syifa (Kelompok A)',
    isi: 'Pendidik di RA Almaqom telaten sekali. Tidak memaksakan calistung melainkan menumbuhkan fitrah ingin tahu. Ruang sentranya bersih dan sangat aman.',
    warna: 'sage',
  },
  {
    id: 't3',
    namaWali: 'Abi Fathan',
    santri: 'Orang Tua dari Ananda Rayyan (Kelompok B)',
    isi: 'Program tahfidz juz 30-nya sangat menyenangkan dengan irama nada tartil merdu. Rayyan bangga sekali saat tampil di mading prestasi sekolah!',
    warna: 'terracotta',
  },
];

// ==========================================
// Kontak & Lokasi Settings
// ==========================================
export interface KontakSettings {
  whatsapp: string;
  whatsappPesanDefault: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  telepon: string;
  email: string;
  alamat: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
}

export const DEFAULT_KONTAK_SETTINGS: KontakSettings = {
  whatsapp: '6281234567890',
  whatsappPesanDefault: 'Assalamu\'alaikum Panitia PPDB RA Almaqom, saya ingin berkonsultasi mengenai pendaftaran santri baru...',
  instagram: 'https://instagram.com/ra.almaqom',
  youtube: 'https://youtube.com/@raalmaqom',
  tiktok: 'https://tiktok.com/@raalmaqom',
  telepon: '(021) 8899-7766',
  email: 'info@raalmaqom.sch.id',
  alamat: 'Jl. Almaqom No. 12, Kelurahan Harapan Baru, Komplek Pendidikan Islam Terpadu',
  mapsUrl: 'https://maps.google.com/?q=Jakarta',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.28588880499!2d106.75884964648439!3d-6.229746499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
};

// ==========================================
// PPDB Submission Item
// ==========================================
export interface PpdbSubmission {
  id: string;
  namaAnak: string;
  usiaAnak: string;
  namaWali: string;
  noWhatsapp: string;
  pesan?: string;
  createdAt: string;
}

// Storage Keys
const SCHOOL_PROFILE_KEY = 'ra_almaqom_school_profile';
const GURU_LIST_KEY = 'ra_almaqom_guru_list';
const FASILITAS_LIST_KEY = 'ra_almaqom_fasilitas_list';
const TESTIMONI_LIST_KEY = 'ra_almaqom_testimoni_list';
const KONTAK_SETTINGS_KEY = 'ra_almaqom_kontak_settings';
const PPDB_SUBMISSIONS_KEY = 'ra_almaqom_ppdb_submissions';

// 1. School Profile Handlers
export function getSchoolProfile(): SchoolProfile {
  if (typeof window === 'undefined') return DEFAULT_SCHOOL_PROFILE;
  try {
    const saved = localStorage.getItem(SCHOOL_PROFILE_KEY);
    const savedLogo = localStorage.getItem(SCHOOL_LOGO_KEY);
    let profile = DEFAULT_SCHOOL_PROFILE;
    if (saved) {
      try {
        profile = { ...DEFAULT_SCHOOL_PROFILE, ...JSON.parse(saved) };
      } catch {}
    }
    // Always preserve and prioritize custom uploaded school logo
    if (savedLogo && savedLogo.trim() !== '' && savedLogo !== DEFAULT_SCHOOL_LOGO) {
      profile.logoUrl = savedLogo;
    }
    return profile;
  } catch {
    return DEFAULT_SCHOOL_PROFILE;
  }
}

export async function setSchoolProfile(profile: Partial<SchoolProfile>): Promise<void> {
  const current = getSchoolProfile();
  const updated = { ...current, ...profile };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SCHOOL_PROFILE_KEY, JSON.stringify(updated));
      if (updated.logoUrl && updated.logoUrl !== DEFAULT_SCHOOL_LOGO) {
        localStorage.setItem(SCHOOL_LOGO_KEY, updated.logoUrl);
        window.dispatchEvent(new CustomEvent('school_logo_updated', { detail: updated.logoUrl }));
      }
      window.dispatchEvent(new CustomEvent('school_profile_updated', { detail: updated }));
    } catch (e) {
      console.warn("Storage write error for profile:", e);
    }
  }
  if (db && isFirestoreAvailable) {
    try {
      await setDoc(doc(db, 'settings', 'school_profile'), {
        ...updated,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn("Firestore profile save error:", e);
    }
  }
}

export function subscribeToSchoolProfile(onData: (p: SchoolProfile) => void): () => void {
  onData(getSchoolProfile());
  const handleEvent = (e: Event) => {
    const custom = e as CustomEvent;
    onData(custom.detail || getSchoolProfile());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('school_profile_updated', handleEvent);
    window.addEventListener('storage', () => onData(getSchoolProfile()));
  }
  if (db && isFirestoreAvailable) {
    try {
      const unsub = onSnapshot(doc(db, 'settings', 'school_profile'), (snap) => {
        if (snap.exists()) {
          const d = snap.data() as Partial<SchoolProfile>;
          const merged = { ...DEFAULT_SCHOOL_PROFILE, ...d };
          localStorage.setItem(SCHOOL_PROFILE_KEY, JSON.stringify(merged));
          onData(merged);
        }
      });
      return () => {
        unsub();
        if (typeof window !== 'undefined') {
          window.removeEventListener('school_profile_updated', handleEvent);
        }
      };
    } catch {}
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('school_profile_updated', handleEvent);
    }
  };
}

// 2. Guru Handlers
export function getGuruList(): GuruItem[] {
  if (typeof window === 'undefined') return DEFAULT_GURU_LIST;
  try {
    const saved = localStorage.getItem(GURU_LIST_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_GURU_LIST;
  } catch {
    return DEFAULT_GURU_LIST;
  }
}

export async function setGuruList(list: GuruItem[]): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GURU_LIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('guru_list_updated', { detail: list }));
  }
  if (db && isFirestoreAvailable) {
    try {
      await setDoc(doc(db, 'settings', 'guru_data'), {
        items: list,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn("Firestore guru save error:", e);
    }
  }
}

export function subscribeToGuruList(onData: (items: GuruItem[]) => void): () => void {
  onData(getGuruList());
  const handleEvent = (e: Event) => {
    const custom = e as CustomEvent;
    onData(custom.detail || getGuruList());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('guru_list_updated', handleEvent);
    window.addEventListener('storage', () => onData(getGuruList()));
  }
  if (db && isFirestoreAvailable) {
    try {
      const unsub = onSnapshot(doc(db, 'settings', 'guru_data'), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (Array.isArray(d?.items)) {
            localStorage.setItem(GURU_LIST_KEY, JSON.stringify(d.items));
            onData(d.items);
          }
        }
      });
      return () => {
        unsub();
        if (typeof window !== 'undefined') window.removeEventListener('guru_list_updated', handleEvent);
      };
    } catch {}
  }
  return () => {
    if (typeof window !== 'undefined') window.removeEventListener('guru_list_updated', handleEvent);
  };
}

// 3. Fasilitas Handlers
export function getFasilitasList(): FasilitasItem[] {
  if (typeof window === 'undefined') return DEFAULT_FASILITAS_LIST;
  try {
    const saved = localStorage.getItem(FASILITAS_LIST_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_FASILITAS_LIST;
  } catch {
    return DEFAULT_FASILITAS_LIST;
  }
}

export async function setFasilitasList(list: FasilitasItem[]): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FASILITAS_LIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('fasilitas_list_updated', { detail: list }));
  }
  if (db && isFirestoreAvailable) {
    try {
      await setDoc(doc(db, 'settings', 'fasilitas_data'), {
        items: list,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn("Firestore fasilitas save error:", e);
    }
  }
}

export function subscribeToFasilitas(onData: (items: FasilitasItem[]) => void): () => void {
  onData(getFasilitasList());
  const handleEvent = (e: Event) => {
    const custom = e as CustomEvent;
    onData(custom.detail || getFasilitasList());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('fasilitas_list_updated', handleEvent);
    window.addEventListener('storage', () => onData(getFasilitasList()));
  }
  if (db && isFirestoreAvailable) {
    try {
      const unsub = onSnapshot(doc(db, 'settings', 'fasilitas_data'), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (Array.isArray(d?.items)) {
            localStorage.setItem(FASILITAS_LIST_KEY, JSON.stringify(d.items));
            onData(d.items);
          }
        }
      });
      return () => {
        unsub();
        if (typeof window !== 'undefined') window.removeEventListener('fasilitas_list_updated', handleEvent);
      };
    } catch {}
  }
  return () => {
    if (typeof window !== 'undefined') window.removeEventListener('fasilitas_list_updated', handleEvent);
  };
}

// 4. Testimoni Handlers
export function getTestimoniList(): TestimoniItem[] {
  if (typeof window === 'undefined') return DEFAULT_TESTIMONI_LIST;
  try {
    const saved = localStorage.getItem(TESTIMONI_LIST_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_TESTIMONI_LIST;
  } catch {
    return DEFAULT_TESTIMONI_LIST;
  }
}

export async function setTestimoniList(list: TestimoniItem[]): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TESTIMONI_LIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('testimoni_list_updated', { detail: list }));
  }
  if (db && isFirestoreAvailable) {
    try {
      await setDoc(doc(db, 'settings', 'testimoni_data'), {
        items: list,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn("Firestore testimoni save error:", e);
    }
  }
}

export function subscribeToTestimoni(onData: (items: TestimoniItem[]) => void): () => void {
  onData(getTestimoniList());
  const handleEvent = (e: Event) => {
    const custom = e as CustomEvent;
    onData(custom.detail || getTestimoniList());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('testimoni_list_updated', handleEvent);
    window.addEventListener('storage', () => onData(getTestimoniList()));
  }
  if (db && isFirestoreAvailable) {
    try {
      const unsub = onSnapshot(doc(db, 'settings', 'testimoni_data'), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          if (Array.isArray(d?.items)) {
            localStorage.setItem(TESTIMONI_LIST_KEY, JSON.stringify(d.items));
            onData(d.items);
          }
        }
      });
      return () => {
        unsub();
        if (typeof window !== 'undefined') window.removeEventListener('testimoni_list_updated', handleEvent);
      };
    } catch {}
  }
  return () => {
    if (typeof window !== 'undefined') window.removeEventListener('testimoni_list_updated', handleEvent);
  };
}

// 5. Kontak & Maps Settings Handlers
export function getKontakSettings(): KontakSettings {
  if (typeof window === 'undefined') return DEFAULT_KONTAK_SETTINGS;
  try {
    const saved = localStorage.getItem(KONTAK_SETTINGS_KEY);
    return saved ? { ...DEFAULT_KONTAK_SETTINGS, ...JSON.parse(saved) } : DEFAULT_KONTAK_SETTINGS;
  } catch {
    return DEFAULT_KONTAK_SETTINGS;
  }
}

export async function setKontakSettings(settings: Partial<KontakSettings>): Promise<void> {
  const current = getKontakSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    localStorage.setItem(KONTAK_SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('kontak_settings_updated', { detail: updated }));
  }
  if (db && isFirestoreAvailable) {
    try {
      await setDoc(doc(db, 'settings', 'kontak_data'), {
        ...updated,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn("Firestore kontak save error:", e);
    }
  }
}

export function subscribeToKontakSettings(onData: (s: KontakSettings) => void): () => void {
  onData(getKontakSettings());
  const handleEvent = (e: Event) => {
    const custom = e as CustomEvent;
    onData(custom.detail || getKontakSettings());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('kontak_settings_updated', handleEvent);
    window.addEventListener('storage', () => onData(getKontakSettings()));
  }
  if (db && isFirestoreAvailable) {
    try {
      const unsub = onSnapshot(doc(db, 'settings', 'kontak_data'), (snap) => {
        if (snap.exists()) {
          const d = snap.data() as Partial<KontakSettings>;
          const merged = { ...DEFAULT_KONTAK_SETTINGS, ...d };
          localStorage.setItem(KONTAK_SETTINGS_KEY, JSON.stringify(merged));
          onData(merged);
        }
      });
      return () => {
        unsub();
        if (typeof window !== 'undefined') window.removeEventListener('kontak_settings_updated', handleEvent);
      };
    } catch {}
  }
  return () => {
    if (typeof window !== 'undefined') window.removeEventListener('kontak_settings_updated', handleEvent);
  };
}

// 6. PPDB Online Submissions Handlers
export function getPpdbSubmissions(): PpdbSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(PPDB_SUBMISSIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export async function submitPpdbForm(submission: Omit<PpdbSubmission, 'id' | 'createdAt'>): Promise<string> {
  const current = getPpdbSubmissions();
  const newId = 'ppdb_' + Date.now();
  const newItem: PpdbSubmission = {
    ...submission,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(PPDB_SUBMISSIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ppdb_submissions_updated', { detail: updated }));
  }
  if (db && isFirestoreAvailable) {
    try {
      await addDoc(collection(db, 'ppdb_submissions'), {
        ...submission,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("Firestore ppdb write error:", e);
    }
  }
  return newId;
}

export async function deletePpdbSubmission(id: string): Promise<void> {
  const current = getPpdbSubmissions();
  const filtered = current.filter((item) => item.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(PPDB_SUBMISSIONS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('ppdb_submissions_updated', { detail: filtered }));
  }
  if (db && isFirestoreAvailable) {
    try {
      await deleteDoc(doc(db, 'ppdb_submissions', id));
    } catch (e) {
      console.warn("Firestore ppdb delete error:", e);
    }
  }
}

export function subscribeToPpdbSubmissions(onData: (items: PpdbSubmission[]) => void): () => void {
  onData(getPpdbSubmissions());
  const handleEvent = (e: Event) => {
    const custom = e as CustomEvent;
    onData(custom.detail || getPpdbSubmissions());
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('ppdb_submissions_updated', handleEvent);
    window.addEventListener('storage', () => onData(getPpdbSubmissions()));
  }
  if (db && isFirestoreAvailable) {
    try {
      const q = query(collection(db, 'ppdb_submissions'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const list: PpdbSubmission[] = snap.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              namaAnak: d.namaAnak || '',
              usiaAnak: d.usiaAnak || '',
              namaWali: d.namaWali || '',
              noWhatsapp: d.noWhatsapp || '',
              pesan: d.pesan || '',
              createdAt: d.createdAt ? new Date(d.createdAt.toDate?.() || d.createdAt).toISOString() : new Date().toISOString(),
            };
          });
          localStorage.setItem(PPDB_SUBMISSIONS_KEY, JSON.stringify(list));
          onData(list);
        }
      });
      return () => {
        unsub();
        if (typeof window !== 'undefined') window.removeEventListener('ppdb_submissions_updated', handleEvent);
      };
    } catch {}
  }
  return () => {
    if (typeof window !== 'undefined') window.removeEventListener('ppdb_submissions_updated', handleEvent);
  };
}

export function getSchoolLogo(): string {
  if (typeof window === 'undefined') return DEFAULT_SCHOOL_LOGO;
  try {
    const saved = localStorage.getItem(SCHOOL_LOGO_KEY);
    return saved && saved.trim() !== '' ? saved : DEFAULT_SCHOOL_LOGO;
  } catch {
    return DEFAULT_SCHOOL_LOGO;
  }
}

export async function setSchoolLogo(logoUrl: string): Promise<void> {
  const value = logoUrl.trim() || DEFAULT_SCHOOL_LOGO;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SCHOOL_LOGO_KEY, value);
      const current = getSchoolProfile();
      const updatedProfile = { ...current, logoUrl: value };
      localStorage.setItem(SCHOOL_PROFILE_KEY, JSON.stringify(updatedProfile));
      window.dispatchEvent(new CustomEvent('school_logo_updated', { detail: value }));
      window.dispatchEvent(new CustomEvent('school_profile_updated', { detail: updatedProfile }));
    } catch (e) {
      console.error("Error saving logo:", e);
    }
  }

  if (db && isFirestoreAvailable) {
    try {
      await setDoc(doc(db, 'settings', 'school_profile'), {
        logoUrl: value,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore logo save error, kept locally:", err);
    }
  }
}

export function subscribeToSchoolLogo(onData: (logoUrl: string) => void): () => void {
  // Initial local value
  onData(getSchoolLogo());

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent;
    if (custom.detail) {
      onData(custom.detail);
    } else {
      onData(getSchoolLogo());
    }
  };

  const handleStorage = () => {
    onData(getSchoolLogo());
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('school_logo_updated', handleCustomEvent);
    window.addEventListener('storage', handleStorage);
  }

  if (db && isFirestoreAvailable) {
    try {
      const unsub = onSnapshot(doc(db, 'settings', 'school_profile'), (docSnap) => {
        if (docSnap.exists()) {
          const d = docSnap.data();
          if (d?.logoUrl) {
            localStorage.setItem(SCHOOL_LOGO_KEY, d.logoUrl);
            onData(d.logoUrl);
          }
        }
      });
      return () => {
        unsub();
        if (typeof window !== 'undefined') {
          window.removeEventListener('school_logo_updated', handleCustomEvent);
          window.removeEventListener('storage', handleStorage);
        }
      };
    } catch {
      // fallback
    }
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('school_logo_updated', handleCustomEvent);
      window.removeEventListener('storage', handleStorage);
    }
  };
}
