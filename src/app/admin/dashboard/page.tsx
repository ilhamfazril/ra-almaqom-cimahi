import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  LogOut, 
  ExternalLink, 
  Database, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  User, 
  FileText, 
  Palette, 
  RotateCw, 
  Search, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon, 
  X, 
  Edit3, 
  RotateCcw, 
  Check, 
  Building,
  UserCheck,
  Building2,
  MessageSquareQuote,
  MapPin,
  Share2,
  Users,
  MessageCircle,
  Clock,
  Phone,
  Mail,
  Send
} from 'lucide-react';
import { 
  subscribeToPrestasi, 
  addPrestasi, 
  updatePrestasi, 
  deletePrestasi, 
  PrestasiItem, 
  isFirestoreAvailable, 
  PRESET_FOTO_PRESTASI,
  getSchoolProfile,
  setSchoolProfile,
  subscribeToSchoolProfile,
  SchoolProfile,
  DEFAULT_SCHOOL_PROFILE,
  getGuruList,
  setGuruList,
  subscribeToGuruList,
  GuruItem,
  DEFAULT_GURU_LIST,
  getFasilitasList,
  setFasilitasList,
  subscribeToFasilitas,
  FasilitasItem,
  DEFAULT_FASILITAS_LIST,
  getTestimoniList,
  setTestimoniList,
  subscribeToTestimoni,
  TestimoniItem,
  DEFAULT_TESTIMONI_LIST,
  getKontakSettings,
  setKontakSettings,
  subscribeToKontakSettings,
  KontakSettings,
  DEFAULT_KONTAK_SETTINGS,
  getPpdbSubmissions,
  deletePpdbSubmission,
  subscribeToPpdbSubmissions,
  PpdbSubmission,
  DEFAULT_SCHOOL_LOGO,
  compressImage,
  setSchoolLogo
} from '../../../config/firebase';
import { ADMIN_AUTH_KEY } from '../login/page';

interface AdminDashboardProps {
  onNavigate?: (path: string) => void;
}

export default function AdminDashboardPage({ onNavigate }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'prestasi' | 'profil' | 'guru' | 'fasilitas' | 'testimoni' | 'kontak' | 'ppdb'>('prestasi');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Prestasi States
  const [prestasiList, setPrestasiList] = useState<PrestasiItem[]>([]);
  const [prestasiLoading, setPrestasiLoading] = useState(true);
  const [prestasiSubmitting, setPrestasiSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPrestasiId, setEditingPrestasiId] = useState<string | null>(null);
  const [deletePrestasiModal, setDeletePrestasiModal] = useState<{ id: string; nama: string; judul: string } | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const [prestasiForm, setPrestasiForm] = useState({
    namaSiswa: '',
    judul: '',
    kategori: "Tahfidz Al-Qur'an",
    tahun: '2026/2027',
    keterangan: '',
    warnaKertas: 'cream' as 'cream' | 'sage' | 'terracotta' | 'yellow',
    rotasi: -1,
    fotoUrl: '',
  });

  // 2. School Profile & Sambutan States
  const [schoolProfile, setSchoolProfileState] = useState<SchoolProfile>(DEFAULT_SCHOOL_PROFILE);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const kepalaFotoInputRef = useRef<HTMLInputElement>(null);

  // 3. Guru States
  const [guruList, setGuruListState] = useState<GuruItem[]>(DEFAULT_GURU_LIST);
  const [editingGuruId, setEditingGuruId] = useState<string | null>(null);
  const [deleteGuruModal, setDeleteGuruModal] = useState<{ id: string; nama: string } | null>(null);
  const guruFotoInputRef = useRef<HTMLInputElement>(null);
  const [guruForm, setGuruForm] = useState({
    nama: '',
    peran: '',
    moto: '',
    fotoUrl: '',
    warnaKertas: 'cream' as 'cream' | 'sage' | 'terracotta' | 'yellow',
  });

  // 4. Fasilitas States
  const [fasilitasList, setFasilitasListState] = useState<FasilitasItem[]>(DEFAULT_FASILITAS_LIST);
  const [editingFasilitasId, setEditingFasilitasId] = useState<string | null>(null);
  const [deleteFasilitasModal, setDeleteFasilitasModal] = useState<{ id: string; nama: string } | null>(null);
  const fasilitasFotoInputRef = useRef<HTMLInputElement>(null);
  const [fasilitasForm, setFasilitasForm] = useState({
    nama: '',
    deskripsi: '',
    fotoUrl: '',
  });

  // 5. Testimoni States
  const [testimoniList, setTestimoniListState] = useState<TestimoniItem[]>(DEFAULT_TESTIMONI_LIST);
  const [editingTestimoniId, setEditingTestimoniId] = useState<string | null>(null);
  const [deleteTestimoniModal, setDeleteTestimoniModal] = useState<{ id: string; nama: string } | null>(null);
  const [testimoniForm, setTestimoniForm] = useState({
    namaWali: '',
    santri: '',
    isi: '',
    warna: 'cream' as 'cream' | 'sage' | 'terracotta' | 'yellow',
  });

  // 6. Kontak & Maps Settings States
  const [kontakSettings, setKontakSettingsState] = useState<KontakSettings>(DEFAULT_KONTAK_SETTINGS);
  const [kontakSubmitting, setKontakSubmitting] = useState(false);

  // 7. PPDB Submissions State
  const [ppdbSubmissions, setPpdbSubmissions] = useState<PpdbSubmission[]>([]);
  const [deletePpdbModal, setDeletePpdbModal] = useState<{ id: string; nama: string } | null>(null);

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  // Auth Guard
  useEffect(() => {
    try {
      const isAuth = localStorage.getItem(ADMIN_AUTH_KEY);
      if (isAuth !== 'true') {
        setIsAuthenticated(false);
        navigateTo('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      setIsAuthenticated(false);
      navigateTo('/admin/login');
    }
  }, []);

  // Realtime Subscriptions
  useEffect(() => {
    if (isAuthenticated) {
      const unsubs = [
        subscribeToPrestasi((items) => {
          setPrestasiList(items);
          setPrestasiLoading(false);
        }),
        subscribeToSchoolProfile((p) => setSchoolProfileState(p)),
        subscribeToGuruList((g) => setGuruListState(g)),
        subscribeToFasilitas((f) => setFasilitasListState(f)),
        subscribeToTestimoni((t) => setTestimoniListState(t)),
        subscribeToKontakSettings((k) => setKontakSettingsState(k)),
        subscribeToPpdbSubmissions((p) => setPpdbSubmissions(p)),
      ];
      return () => unsubs.forEach((unsub) => unsub && unsub());
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      localStorage.removeItem('ra_almaqom_admin_user');
    } catch (e) {
      console.error(e);
    }
    navigateTo('/admin/login');
  };

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // -------------------------------------------------------------
  // HANDLERS: TAB 1 (PRESTASI)
  // -------------------------------------------------------------
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 1000, 0.82);
      setPrestasiForm((prev) => ({ ...prev, fotoUrl: compressed }));
      showNotice('success', `Foto "${file.name}" siap ditempel (sudah dioptimalkan).`);
    } catch {
      showNotice('error', 'Gagal memproses foto.');
    }
  };

  const handleStartEditPrestasi = (item: PrestasiItem) => {
    setEditingPrestasiId(item.id);
    setPrestasiForm({
      namaSiswa: item.namaSiswa,
      judul: item.judul,
      kategori: item.kategori,
      tahun: item.tahun,
      keterangan: item.keterangan,
      warnaKertas: item.warnaKertas || 'cream',
      rotasi: item.rotasi || 0,
      fotoUrl: item.fotoUrl || '',
    });
    window.scrollTo({ top: 120, behavior: 'smooth' });
    showNotice('success', `Mengedit prestasi "${item.judul}".`);
  };

  const handleCancelEditPrestasi = () => {
    setEditingPrestasiId(null);
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setPrestasiForm({
      namaSiswa: '',
      judul: '',
      kategori: "Tahfidz Al-Qur'an",
      tahun: '2026/2027',
      keterangan: '',
      warnaKertas: 'cream',
      rotasi: -1,
      fotoUrl: '',
    });
    if (photoFileInputRef.current) photoFileInputRef.current.value = '';
  };

  const handleSavePrestasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prestasiForm.namaSiswa.trim() || !prestasiForm.judul.trim()) {
      showNotice('error', 'Nama Santri dan Judul Prestasi wajib diisi.');
      return;
    }

    const finalCategory = isCustomCategory 
      ? (customCategoryInput.trim() || 'Umum') 
      : prestasiForm.kategori;

    setPrestasiSubmitting(true);
    try {
      if (editingPrestasiId) {
        await updatePrestasi(editingPrestasiId, {
          namaSiswa: prestasiForm.namaSiswa.trim(),
          judul: prestasiForm.judul.trim(),
          kategori: finalCategory,
          tahun: prestasiForm.tahun.trim() || '2026/2027',
          keterangan: prestasiForm.keterangan.trim() || 'Berhasil menorehkan prestasi membanggakan bagi RA Almaqom.',
          warnaKertas: prestasiForm.warnaKertas,
          rotasi: Number(prestasiForm.rotasi),
          fotoUrl: prestasiForm.fotoUrl.trim() || undefined,
        });
        showNotice('success', `Perubahan prestasi "${prestasiForm.judul}" berhasil disimpan!`);
        handleCancelEditPrestasi();
      } else {
        await addPrestasi({
          namaSiswa: prestasiForm.namaSiswa.trim(),
          judul: prestasiForm.judul.trim(),
          kategori: finalCategory,
          tahun: prestasiForm.tahun.trim() || '2026/2027',
          keterangan: prestasiForm.keterangan.trim() || 'Berhasil menorehkan prestasi membanggakan bagi RA Almaqom.',
          warnaKertas: prestasiForm.warnaKertas,
          rotasi: Number(prestasiForm.rotasi),
          fotoUrl: prestasiForm.fotoUrl.trim() || undefined,
        });
        showNotice('success', 'Prestasi baru berhasil ditempel ke mading!');
        handleCancelEditPrestasi();
      }
    } catch (err: any) {
      showNotice('error', `Gagal menyimpan prestasi: ${err?.message || 'Kesalahan jaringan'}`);
    } finally {
      setPrestasiSubmitting(false);
    }
  };

  const handleExecuteDeletePrestasi = async () => {
    if (!deletePrestasiModal) return;
    try {
      await deletePrestasi(deletePrestasiModal.id);
      showNotice('success', `Prestasi "${deletePrestasiModal.nama}" berhasil dihapus.`);
      if (editingPrestasiId === deletePrestasiModal.id) handleCancelEditPrestasi();
      setDeletePrestasiModal(null);
    } catch (err: any) {
      showNotice('error', `Gagal menghapus: ${err?.message || 'Kesalahan sistem'}`);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: TAB 2 (PROFIL & SAMBUTAN)
  // -------------------------------------------------------------
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 600, 0.9);
      await setSchoolLogo(compressed);
      await setSchoolProfile({ logoUrl: compressed });
      showNotice('success', 'Logo bulat sekolah berhasil diperbarui & disimpan aman!');
    } catch {
      showNotice('error', 'Gagal memproses logo sekolah.');
    }
  };

  const handleKepalaFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.82);
      setSchoolProfileState((prev) => ({ ...prev, kepalaSekolahFotoUrl: compressed }));
      showNotice('success', 'Foto Kepala Sekolah diproses & siap disimpan.');
    } catch {
      showNotice('error', 'Gagal memproses foto.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSubmitting(true);
    try {
      await setSchoolProfile(schoolProfile);
      showNotice('success', 'Profil dan Sambutan Kepala Sekolah berhasil disimpan!');
    } catch (err: any) {
      showNotice('error', `Gagal menyimpan profil: ${err?.message}`);
    } finally {
      setProfileSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: TAB 3 (DEWAN GURU)
  // -------------------------------------------------------------
  const handleGuruFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.82);
      setGuruForm((prev) => ({ ...prev, fotoUrl: compressed }));
      showNotice('success', `Foto Ustadzah siap digunakan.`);
    } catch {
      showNotice('error', 'Gagal memproses foto.');
    }
  };

  const handleSaveGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guruForm.nama.trim()) {
      showNotice('error', 'Nama Guru/Ustadzah wajib diisi.');
      return;
    }
    let updated: GuruItem[];
    if (editingGuruId) {
      updated = guruList.map((g) => g.id === editingGuruId ? { ...g, ...guruForm } : g);
      showNotice('success', `Data Ustadzah "${guruForm.nama}" diperbarui.`);
    } else {
      const newGuru: GuruItem = {
        ...guruForm,
        id: 'g_' + Date.now(),
        fotoUrl: guruForm.fotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      };
      updated = [newGuru, ...guruList];
      showNotice('success', `Ustadzah "${guruForm.nama}" berhasil ditambahkan ke album.`);
    }
    await setGuruList(updated);
    setEditingGuruId(null);
    setGuruForm({ nama: '', peran: '', moto: '', fotoUrl: '', warnaKertas: 'cream' });
    if (guruFotoInputRef.current) guruFotoInputRef.current.value = '';
  };

  const handleExecuteDeleteGuru = async () => {
    if (!deleteGuruModal) return;
    const filtered = guruList.filter((g) => g.id !== deleteGuruModal.id);
    await setGuruList(filtered);
    showNotice('success', `Profil "${deleteGuruModal.nama}" berhasil dihapus.`);
    setDeleteGuruModal(null);
  };

  // -------------------------------------------------------------
  // HANDLERS: TAB 4 (FASILITAS)
  // -------------------------------------------------------------
  const handleFasilitasFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 1000, 0.82);
      setFasilitasForm((prev) => ({ ...prev, fotoUrl: compressed }));
      showNotice('success', 'Foto fasilitas siap disimpan.');
    } catch {
      showNotice('error', 'Gagal memproses foto.');
    }
  };

  const handleSaveFasilitas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fasilitasForm.nama.trim()) return;
    let updated: FasilitasItem[];
    if (editingFasilitasId) {
      updated = fasilitasList.map((f) => f.id === editingFasilitasId ? { ...f, ...fasilitasForm } : f);
      showNotice('success', 'Data fasilitas diperbarui.');
    } else {
      const newFasilitas: FasilitasItem = {
        ...fasilitasForm,
        id: 'f_' + Date.now(),
        fotoUrl: fasilitasForm.fotoUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      };
      updated = [...fasilitasList, newFasilitas];
      showNotice('success', 'Fasilitas baru berhasil ditambahkan.');
    }
    await setFasilitasList(updated);
    setEditingFasilitasId(null);
    setFasilitasForm({ nama: '', deskripsi: '', fotoUrl: '' });
  };

  const handleExecuteDeleteFasilitas = async () => {
    if (!deleteFasilitasModal) return;
    const filtered = fasilitasList.filter((f) => f.id !== deleteFasilitasModal.id);
    await setFasilitasList(filtered);
    showNotice('success', 'Fasilitas berhasil dihapus.');
    setDeleteFasilitasModal(null);
  };

  // -------------------------------------------------------------
  // HANDLERS: TAB 5 (TESTIMONI)
  // -------------------------------------------------------------
  const handleSaveTestimoni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimoniForm.namaWali.trim() || !testimoniForm.isi.trim()) return;
    let updated: TestimoniItem[];
    if (editingTestimoniId) {
      updated = testimoniList.map((t) => t.id === editingTestimoniId ? { ...t, ...testimoniForm } : t);
      showNotice('success', 'Testimoni wali santri diperbarui.');
    } else {
      const newTesti: TestimoniItem = {
        ...testimoniForm,
        id: 't_' + Date.now(),
      };
      updated = [newTesti, ...testimoniList];
      showNotice('success', 'Testimoni baru berhasil ditambahkan.');
    }
    await setTestimoniList(updated);
    setEditingTestimoniId(null);
    setTestimoniForm({ namaWali: '', santri: '', isi: '', warna: 'cream' });
  };

  const handleExecuteDeleteTestimoni = async () => {
    if (!deleteTestimoniModal) return;
    const filtered = testimoniList.filter((t) => t.id !== deleteTestimoniModal.id);
    await setTestimoniList(filtered);
    showNotice('success', 'Testimoni berhasil dihapus.');
    setDeleteTestimoniModal(null);
  };

  // -------------------------------------------------------------
  // HANDLERS: TAB 6 (KONTAK & MAPS)
  // -------------------------------------------------------------
  const handleSaveKontak = async (e: React.FormEvent) => {
    e.preventDefault();
    setKontakSubmitting(true);
    try {
      await setKontakSettings(kontakSettings);
      showNotice('success', 'Pengaturan kontak, tautan medsos, dan Google Maps berhasil disimpan!');
    } catch (err: any) {
      showNotice('error', `Gagal menyimpan kontak: ${err?.message}`);
    } finally {
      setKontakSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: TAB 7 (PPDB SUBMISSIONS)
  // -------------------------------------------------------------
  const handleExecuteDeletePpdb = async () => {
    if (!deletePpdbModal) return;
    await deletePpdbSubmission(deletePpdbModal.id);
    showNotice('success', `Data pendaftar "${deletePpdbModal.nama}" berhasil dihapus.`);
    setDeletePpdbModal(null);
  };

  if (isAuthenticated === false || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="text-center p-8 bg-white border-2 border-[#1C1917] rounded-2xl shadow-[4px_4px_0px_#1C1917] max-w-sm">
          <div className="w-8 h-8 border-3 border-[#5B8266] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1C1917]">Memeriksa Hak Akses Admin...</p>
        </div>
      </div>
    );
  }

  const tabsConfig = [
    { id: 'prestasi', label: 'Mading Prestasi', icon: Trophy },
    { id: 'profil', label: 'Profil & Sambutan', icon: Building },
    { id: 'guru', label: 'Dewan Guru', icon: UserCheck },
    { id: 'fasilitas', label: 'Fasilitas Ceria', icon: Building2 },
    { id: 'testimoni', label: 'Testimoni Wali', icon: MessageSquareQuote },
    { id: 'kontak', label: 'Kontak, Medsos & Peta', icon: MapPin },
    { id: 'ppdb', label: `Pendaftar PPDB (${ppdbSubmissions.length})`, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] bg-paper-grid flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b-2 border-[#1C1917] px-3 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Perfectly Round Logo */}
            <div className="w-10 h-10 aspect-square rounded-full overflow-hidden border-2 border-[#1C1917] bg-white shrink-0 p-0.5 flex items-center justify-center shadow-xs">
              <img
                src={schoolProfile.logoUrl || DEFAULT_SCHOOL_LOGO}
                alt="Logo Sekolah"
                className="w-full h-full object-contain rounded-full aspect-square"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-[#1C1917] tracking-tight whitespace-nowrap">
                  CMS RA Almaqom
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-[#E8DFD1] text-[#3D3028] border border-[#3D3028] rounded">
                  Admin Panel
                </span>
                {isFirestoreAvailable ? (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
                    🟢 Cloud Firestore Aktif
                  </span>
                ) : (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded" title="Data tersimpan di browser ini. Masukkan Environment Variables di Vercel agar data tersinkron ke semua perangkat.">
                    🟡 Mode Lokal (Belum Ada Kunci Vercel)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6B6357] hidden sm:block">
                Pusat Kontrol Mading, Guru, Sambutan, Fasilitas, Kontak & PPDB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1C1917] bg-white border-2 border-[#1C1917] rounded-lg shadow-[2px_2px_0px_#1C1917] hover:bg-[#F3EFE6] transition-all cursor-pointer whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#5B8266]" />
              <span className="hidden xs:inline">Lihat Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#D96B43] hover:bg-[#C85A32] border-2 border-[#1C1917] rounded-lg shadow-[2px_2px_0px_#1C1917] transition-all cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex-1">
        
        {/* Floating Notification */}
        {notification && (
          <div 
            className={`mb-6 p-4 rounded-xl border-2 shadow-[4px_4px_0px_#000] flex items-center justify-between gap-3 animate-fade-in ${
              notification.type === 'success' 
                ? 'bg-[#EDF4EE] border-[#2C4A34] text-[#1F3324]' 
                : 'bg-[#FDF2ED] border-[#D96B43] text-[#8C3A1D]'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#2C4A34] shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#D96B43] shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-xs font-bold hover:underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* MODULAR CMS NAVIGATION TABS */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-[#FFFDF9] border-2 border-[#1C1917] rounded-2xl shadow-[3px_3px_0px_#1C1917] min-w-max">
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-[2px_2px_0px_#5B8266]'
                      : 'bg-white text-[#1C1917] border-transparent hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D96B43]' : 'text-[#5B8266]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: MADING PRESTASI & FOTO                             */}
        {/* ========================================================= */}
        {activeTab === 'prestasi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Input / Edit Prestasi (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="relative bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-5 sm:p-6 rounded-2xl shadow-[5px_5px_0px_#1C1917]">
                
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#E8DFD1]">
                  <div className="flex items-center gap-2">
                    {editingPrestasiId ? <Edit3 className="w-5 h-5 text-[#D96B43]" /> : <Plus className="w-5 h-5 text-[#5B8266]" />}
                    <h2 className="text-lg font-extrabold text-[#1C1917]">
                      {editingPrestasiId ? 'Edit Prestasi & Kategori' : 'Tempel Prestasi & Foto Baru'}
                    </h2>
                  </div>
                  {editingPrestasiId && (
                    <button
                      type="button"
                      onClick={handleCancelEditPrestasi}
                      className="px-2 py-1 text-xs font-bold text-[#D96B43] bg-rose-50 border border-[#D96B43] rounded-lg"
                    >
                      Batal
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePrestasi} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">
                      Nama Santri / Kelompok *
                    </label>
                    <input
                      type="text"
                      required
                      value={prestasiForm.namaSiswa}
                      onChange={(e) => setPrestasiForm({ ...prestasiForm, namaSiswa: e.target.value })}
                      placeholder="Tulis nama santri (bebas tanpa awalan otomatis)..."
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">
                      Judul Prestasi / Kegiatan *
                    </label>
                    <input
                      type="text"
                      required
                      value={prestasiForm.judul}
                      onChange={(e) => setPrestasiForm({ ...prestasiForm, judul: e.target.value })}
                      placeholder="Misal: Juara 1 Tahfidz Juz 30 Tingkat Kota"
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] focus:outline-none"
                    />
                  </div>

                  {/* Kategori Dinamis */}
                  <div className="p-3 bg-[#F8F5EE] border-2 border-[#1C1917] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#1C1917] uppercase">
                        Kategori Bidang *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCustomCategory(!isCustomCategory)}
                        className="text-[11px] font-bold text-[#5B8266] hover:underline"
                      >
                        {isCustomCategory ? '← Pilih dari Daftar' : '+ Buat Kategori Baru'}
                      </button>
                    </div>

                    {isCustomCategory ? (
                      <input
                        type="text"
                        required
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        placeholder="Ketik kategori baru..."
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-[#5B8266] rounded-xl shadow-[2px_2px_0px_#5B8266] focus:outline-none"
                      />
                    ) : (
                      <select
                        value={prestasiForm.kategori}
                        onChange={(e) => {
                          if (e.target.value === '__NEW__') {
                            setIsCustomCategory(true);
                          } else {
                            setPrestasiForm({ ...prestasiForm, kategori: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                      >
                        <option value="Tahfidz Al-Qur'an">Tahfidz Al-Qur'an</option>
                        <option value="Seni Rupa Islami">Seni Rupa Islami</option>
                        <option value="Dakwah & Adab">Dakwah & Adab</option>
                        <option value="Ketangkasan & Olahraga">Ketangkasan & Olahraga</option>
                        <option value="Kesenian Tradisional">Kesenian Tradisional</option>
                        <option value="Sains Cilik & Kognitif">Sains Cilik & Kognitif</option>
                        <option value="__NEW__">+ Tambah Kategori Baru...</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">
                      Tahun / Periode
                    </label>
                    <input
                      type="text"
                      value={prestasiForm.tahun}
                      onChange={(e) => setPrestasiForm({ ...prestasiForm, tahun: e.target.value })}
                      placeholder="2026/2027"
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                    />
                  </div>

                  {/* Foto Upload */}
                  <div className="p-3 bg-[#FFFDF7] border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] space-y-2">
                    <label className="block text-xs font-bold text-[#1C1917] uppercase flex items-center justify-between">
                      <span>Foto Dokumentasi</span>
                      {prestasiForm.fotoUrl && (
                        <button
                          type="button"
                          onClick={() => setPrestasiForm({ ...prestasiForm, fotoUrl: '' })}
                          className="text-[11px] text-[#D96B43] hover:underline"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </label>

                    {prestasiForm.fotoUrl ? (
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#1C1917] bg-stone-100">
                        <img src={prestasiForm.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="flex items-center justify-center gap-2 py-2 px-3 bg-[#EDF4EE] hover:bg-[#DFECE0] border-2 border-[#2C4A34] text-[#2C4A34] rounded-lg text-xs font-bold cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Galeri / Kamera</span>
                          <input ref={photoFileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                        <input
                          type="url"
                          value={prestasiForm.fotoUrl}
                          onChange={(e) => setPrestasiForm({ ...prestasiForm, fotoUrl: e.target.value })}
                          placeholder="Atau tempel link URL foto..."
                          className="w-full px-3 py-1 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">
                      Keterangan Singkat
                    </label>
                    <textarea
                      rows={2}
                      value={prestasiForm.keterangan}
                      onChange={(e) => setPrestasiForm({ ...prestasiForm, keterangan: e.target.value })}
                      placeholder="Catatan apresiasi lomba atau kegiatan..."
                      className="w-full p-2.5 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={prestasiSubmitting}
                    className="w-full py-3 bg-[#5B8266] hover:bg-[#4E7257] text-white font-bold text-sm rounded-xl border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] cursor-pointer"
                  >
                    {prestasiSubmitting ? 'Menyimpan...' : (editingPrestasiId ? 'Simpan Perubahan Prestasi' : 'Simpan & Tempel ke Mading')}
                  </button>
                </form>
              </div>
            </div>

            {/* List Prestasi (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-4 rounded-2xl shadow-[4px_4px_0px_#1C1917] flex items-center justify-between gap-3">
                <h3 className="font-extrabold text-sm sm:text-base text-[#1C1917]">
                  Daftar Prestasi Terpasang ({prestasiList.length})
                </h3>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari prestasi..."
                  className="px-3 py-1.5 text-xs bg-white border-2 border-[#1C1917] rounded-lg"
                />
              </div>

              <div className="space-y-3">
                {prestasiList.filter((p) => p.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) || p.judul.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                  <div key={item.id} className="p-4 bg-white border-2 border-[#1C1917] rounded-xl shadow-[3px_3px_0px_#1C1917] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.fotoUrl ? (
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-black/20 shrink-0">
                          <img src={item.fotoUrl} alt={item.judul} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg border border-dashed border-stone-300 bg-stone-50 flex items-center justify-center text-[10px] text-stone-400 shrink-0">
                          No Pic
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold bg-[#E8DFD1] px-1.5 py-0.5 rounded border border-black/10">
                          {item.kategori}
                        </span>
                        <h4 className="text-sm font-bold text-[#1C1917] truncate">{item.judul}</h4>
                        <p className="text-xs text-[#D96B43] font-hand font-bold">★ {item.namaSiswa}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleStartEditPrestasi(item)} className="p-2 text-[#5B8266] border border-[#1C1917] rounded-lg shadow-xs hover:bg-[#5B8266] hover:text-white">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeletePrestasiModal({ id: item.id, nama: item.namaSiswa, judul: item.judul })} className="p-2 text-[#D96B43] border border-[#1C1917] rounded-lg shadow-xs hover:bg-[#D96B43] hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PROFIL, LOGO & SAMBUTAN KEPALA                     */}
        {/* ========================================================= */}
        {activeTab === 'profil' && (
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* 1. Upload Logo Bulat Sekolah */}
            <div className="bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-6 rounded-2xl shadow-[5px_5px_0px_#1C1917] flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-full border-3 border-[#1C1917] bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
                <img src={schoolProfile.logoUrl || DEFAULT_SCHOOL_LOGO} alt="Logo" className="w-full h-full object-contain rounded-full aspect-square" />
              </div>
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <h3 className="font-extrabold text-base sm:text-lg text-[#1C1917]">Logo Bulat Sekolah (Header)</h3>
                <p className="text-xs text-[#6B6357]">
                  Logo ini ditampilkan secara bulat sempurna pada sudut kiri atas Header website RA Almaqom.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <label className="px-4 py-2 bg-[#5B8266] hover:bg-[#4E7257] text-white text-xs font-bold rounded-xl border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] cursor-pointer">
                    <span>Upload Logo Sekolah Baru</span>
                    <input ref={logoFileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      await setSchoolProfile({ logoUrl: DEFAULT_SCHOOL_LOGO });
                      showNotice('success', 'Logo dikembalikan ke standar.');
                    }}
                    className="px-3 py-2 text-xs font-bold text-[#7D7569] hover:text-[#1C1917] underline"
                  >
                    Reset Logo Standar
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Sambutan & Foto Kepala Sekolah */}
            <div className="bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-6 sm:p-8 rounded-2xl shadow-[5px_5px_0px_#1C1917]">
              <h3 className="font-extrabold text-lg text-[#1C1917] mb-4 pb-3 border-b-2 border-[#E8DFD1]">
                Sambutan Kepala RA Almaqom
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Nama Kepala Sekolah *</label>
                    <input
                      type="text"
                      required
                      value={schoolProfile.kepalaSekolahNama}
                      onChange={(e) => setSchoolProfileState({ ...schoolProfile, kepalaSekolahNama: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Jabatan / Gelar</label>
                    <input
                      type="text"
                      value={schoolProfile.kepalaSekolahGelar}
                      onChange={(e) => setSchoolProfileState({ ...schoolProfile, kepalaSekolahGelar: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Judul Sambutan *</label>
                  <input
                    type="text"
                    required
                    value={schoolProfile.sambutanJudul}
                    onChange={(e) => setSchoolProfileState({ ...schoolProfile, sambutanJudul: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Teks Sambutan *</label>
                  <textarea
                    rows={5}
                    required
                    value={schoolProfile.sambutanIsi}
                    onChange={(e) => setSchoolProfileState({ ...schoolProfile, sambutanIsi: e.target.value })}
                    className="w-full p-3 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>

                {/* Foto Kepala Sekolah */}
                <div className="p-4 bg-[#FAF6EE] border-2 border-[#1C1917] rounded-xl flex items-center gap-4">
                  <div className="w-16 h-20 rounded-lg overflow-hidden border border-black/20 shrink-0 bg-white">
                    <img src={schoolProfile.kepalaSekolahFotoUrl} alt="Kepala" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-xs font-bold text-[#1C1917] block">Foto Kepala Sekolah (Polaroid)</span>
                    <label className="inline-block px-3 py-1.5 bg-white border-2 border-[#1C1917] text-xs font-bold rounded-lg cursor-pointer shadow-xs">
                      <span>Pilih Foto dari Galeri</span>
                      <input ref={kepalaFotoInputRef} type="file" accept="image/*" onChange={handleKepalaFotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="w-full py-3 bg-[#5B8266] text-white font-bold text-sm rounded-xl border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917]"
                >
                  {profileSubmitting ? 'Menyimpan...' : 'Simpan Sambutan & Profil'}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DEWAN GURU / PENDIDIK                              */}
        {/* ========================================================= */}
        {activeTab === 'guru' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-5 sm:p-6 rounded-2xl shadow-[5px_5px_0px_#1C1917]">
              <h3 className="font-extrabold text-base sm:text-lg text-[#1C1917] mb-4 pb-3 border-b-2 border-[#E8DFD1]">
                {editingGuruId ? 'Edit Data Ustadzah' : 'Tambah Guru / Ustadzah Baru'}
              </h3>

              <form onSubmit={handleSaveGuru} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Nama Ustadzah *</label>
                  <input
                    type="text"
                    required
                    value={guruForm.nama}
                    onChange={(e) => setGuruForm({ ...guruForm, nama: e.target.value })}
                    placeholder="Misal: Ustadzah Rahmawati, S.Pd."
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Amanah / Peran Sentra *</label>
                  <input
                    type="text"
                    required
                    value={guruForm.peran}
                    onChange={(e) => setGuruForm({ ...guruForm, peran: e.target.value })}
                    placeholder="Misal: Pengampu Sentra Imtaq & Tahfidz"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Kutipan / Moto Pengasuhan</label>
                  <textarea
                    rows={2}
                    value={guruForm.moto}
                    onChange={(e) => setGuruForm({ ...guruForm, moto: e.target.value })}
                    placeholder="Kutipan kasih sayang kepada anak didik..."
                    className="w-full p-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>

                {/* Upload Foto Guru */}
                <div className="p-3 bg-[#FAF6EE] border-2 border-[#1C1917] rounded-xl flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-black/20 bg-white shrink-0">
                    <img src={guruForm.fotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'} alt="Guru" className="w-full h-full object-cover" />
                  </div>
                  <label className="px-3 py-1.5 bg-white border-2 border-[#1C1917] text-xs font-bold rounded-lg cursor-pointer shadow-xs">
                    <span>Upload Foto Guru</span>
                    <input ref={guruFotoInputRef} type="file" accept="image/*" onChange={handleGuruFotoUpload} className="hidden" />
                  </label>
                </div>

                <button type="submit" className="w-full py-2.5 bg-[#5B8266] text-white font-bold text-xs sm:text-sm rounded-xl border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917]">
                  {editingGuruId ? 'Simpan Perubahan' : 'Tambahkan ke Album Guru'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-extrabold text-base text-[#1C1917] p-2">Daftar Pendidik ({guruList.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guruList.map((guru) => (
                  <div key={guru.id} className="p-4 bg-white border-2 border-[#1C1917] rounded-xl shadow-[3px_3px_0px_#1C1917] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-black/20 shrink-0">
                        <img src={guru.fotoUrl} alt={guru.nama} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-[#1C1917] truncate">{guru.nama}</h4>
                        <p className="text-[11px] text-[#5B8266] font-mono truncate">{guru.peran}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => { setEditingGuruId(guru.id); setGuruForm({ nama: guru.nama, peran: guru.peran, moto: guru.moto, fotoUrl: guru.fotoUrl, warnaKertas: guru.warnaKertas || 'cream' }); }} className="p-1.5 text-[#5B8266] border border-black/20 rounded hover:bg-[#5B8266] hover:text-white">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteGuruModal({ id: guru.id, nama: guru.nama })} className="p-1.5 text-[#D96B43] border border-black/20 rounded hover:bg-[#D96B43] hover:text-white">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FASILITAS CERIA                                    */}
        {/* ========================================================= */}
        {activeTab === 'fasilitas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-5 sm:p-6 rounded-2xl shadow-[5px_5px_0px_#1C1917]">
              <h3 className="font-extrabold text-base sm:text-lg text-[#1C1917] mb-4 pb-3 border-b-2 border-[#E8DFD1]">
                {editingFasilitasId ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
              </h3>
              <form onSubmit={handleSaveFasilitas} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Nama Fasilitas *</label>
                  <input
                    type="text"
                    required
                    value={fasilitasForm.nama}
                    onChange={(e) => setFasilitasForm({ ...fasilitasForm, nama: e.target.value })}
                    placeholder="Misal: Playground Outdoor Rumput Sintetis"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Deskripsi Fasilitas</label>
                  <textarea
                    rows={3}
                    value={fasilitasForm.deskripsi}
                    onChange={(e) => setFasilitasForm({ ...fasilitasForm, deskripsi: e.target.value })}
                    placeholder="Fungsi dan standar kenyamanan anak..."
                    className="w-full p-2.5 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>
                <div className="p-3 bg-[#FAF6EE] border-2 border-[#1C1917] rounded-xl flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-black/20 bg-white shrink-0">
                    <img src={fasilitasForm.fotoUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'} alt="Fasilitas" className="w-full h-full object-cover" />
                  </div>
                  <label className="px-3 py-1.5 bg-white border-2 border-[#1C1917] text-xs font-bold rounded-lg cursor-pointer shadow-xs">
                    <span>Upload Foto Fasilitas</span>
                    <input ref={fasilitasFotoInputRef} type="file" accept="image/*" onChange={handleFasilitasFotoUpload} className="hidden" />
                  </label>
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#5B8266] text-white font-bold text-xs sm:text-sm rounded-xl border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917]">
                  {editingFasilitasId ? 'Simpan Perubahan' : 'Tambahkan Fasilitas'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-extrabold text-base text-[#1C1917] p-2">Daftar Sarana Fasilitas ({fasilitasList.length})</h3>
              <div className="space-y-3">
                {fasilitasList.map((fasilitas) => (
                  <div key={fasilitas.id} className="p-4 bg-white border-2 border-[#1C1917] rounded-xl shadow-[3px_3px_0px_#1C1917] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-black/20 shrink-0">
                        <img src={fasilitas.fotoUrl} alt={fasilitas.nama} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-[#1C1917] truncate">{fasilitas.nama}</h4>
                        <p className="text-xs text-[#5C4F44] line-clamp-1">{fasilitas.deskripsi}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => { setEditingFasilitasId(fasilitas.id); setFasilitasForm(fasilitas); }} className="p-1.5 text-[#5B8266] border border-black/20 rounded hover:bg-[#5B8266] hover:text-white">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteFasilitasModal({ id: fasilitas.id, nama: fasilitas.nama })} className="p-1.5 text-[#D96B43] border border-black/20 rounded hover:bg-[#D96B43] hover:text-white">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: TESTIMONI WALI SANTRI                             */}
        {/* ========================================================= */}
        {activeTab === 'testimoni' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-5 sm:p-6 rounded-2xl shadow-[5px_5px_0px_#1C1917]">
              <h3 className="font-extrabold text-base sm:text-lg text-[#1C1917] mb-4 pb-3 border-b-2 border-[#E8DFD1]">
                {editingTestimoniId ? 'Edit Catatan Wali' : 'Tambah Testimoni Wali'}
              </h3>
              <form onSubmit={handleSaveTestimoni} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Nama Orang Tua / Wali *</label>
                  <input
                    type="text"
                    required
                    value={testimoniForm.namaWali}
                    onChange={(e) => setTestimoniForm({ ...testimoniForm, namaWali: e.target.value })}
                    placeholder="Misal: Bunda Sarah & Ayah Dimas"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Keterangan Santri *</label>
                  <input
                    type="text"
                    required
                    value={testimoniForm.santri}
                    onChange={(e) => setTestimoniForm({ ...testimoniForm, santri: e.target.value })}
                    placeholder="Misal: Orang Tua dari Ananda Kenzo (Kelompok B)"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Isi Testimoni *</label>
                  <textarea
                    rows={3}
                    required
                    value={testimoniForm.isi}
                    onChange={(e) => setTestimoniForm({ ...testimoniForm, isi: e.target.value })}
                    placeholder="Cerita pengalaman Ayah/Bunda tentang kemandirian dan akhlak anak..."
                    className="w-full p-2.5 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#5B8266] text-white font-bold text-xs sm:text-sm rounded-xl border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917]">
                  {editingTestimoniId ? 'Simpan Perubahan' : 'Tempelkan Testimoni'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-extrabold text-base text-[#1C1917] p-2">Catatan Ayah & Bunda ({testimoniList.length})</h3>
              <div className="space-y-3">
                {testimoniList.map((testi) => (
                  <div key={testi.id} className="p-4 bg-white border-2 border-[#1C1917] rounded-xl shadow-[3px_3px_0px_#1C1917] flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h4 className="font-bold text-sm text-[#1C1917]">{testi.namaWali}</h4>
                      <p className="text-xs text-[#D96B43] font-mono">{testi.santri}</p>
                      <p className="text-xs text-[#5C4F44] italic line-clamp-2">"{testi.isi}"</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => { setEditingTestimoniId(testi.id); setTestimoniForm({ namaWali: testi.namaWali, santri: testi.santri, isi: testi.isi, warna: testi.warna || 'cream' }); }} className="p-1.5 text-[#5B8266] border border-black/20 rounded hover:bg-[#5B8266] hover:text-white">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTestimoniModal({ id: testi.id, nama: testi.namaWali })} className="p-1.5 text-[#D96B43] border border-black/20 rounded hover:bg-[#D96B43] hover:text-white">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: KONTAK, MEDSOS & GOOGLE MAPS                       */}
        {/* ========================================================= */}
        {activeTab === 'kontak' && (
          <div className="max-w-3xl mx-auto bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-6 sm:p-8 rounded-2xl shadow-[6px_6px_0px_#1C1917]">
            <h3 className="font-extrabold text-lg text-[#1C1917] mb-4 pb-3 border-b-2 border-[#E8DFD1]">
              Pengaturan Kontak, Akun Media Sosial & Google Maps
            </h3>

            <form onSubmit={handleSaveKontak} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Nomor WhatsApp PPDB *</label>
                  <input
                    type="text"
                    required
                    value={kontakSettings.whatsapp}
                    onChange={(e) => setKontakSettingsState({ ...kontakSettings, whatsapp: e.target.value })}
                    placeholder="6281234567890"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Telepon Kantor</label>
                  <input
                    type="text"
                    value={kontakSettings.telepon}
                    onChange={(e) => setKontakSettingsState({ ...kontakSettings, telepon: e.target.value })}
                    placeholder="(021) 8899-7766"
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Draf Pesan Awal WhatsApp</label>
                <input
                  type="text"
                  value={kontakSettings.whatsappPesanDefault}
                  onChange={(e) => setKontakSettingsState({ ...kontakSettings, whatsappPesanDefault: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Instagram Link</label>
                  <input
                    type="url"
                    value={kontakSettings.instagram}
                    onChange={(e) => setKontakSettingsState({ ...kontakSettings, instagram: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border-2 border-[#1C1917] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">YouTube Link</label>
                  <input
                    type="url"
                    value={kontakSettings.youtube}
                    onChange={(e) => setKontakSettingsState({ ...kontakSettings, youtube: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border-2 border-[#1C1917] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">TikTok Link</label>
                  <input
                    type="url"
                    value={kontakSettings.tiktok}
                    onChange={(e) => setKontakSettingsState({ ...kontakSettings, tiktok: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border-2 border-[#1C1917] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={kontakSettings.email}
                  onChange={(e) => setKontakSettingsState({ ...kontakSettings, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Alamat Fisik Lengkap *</label>
                <textarea
                  rows={2}
                  required
                  value={kontakSettings.alamat}
                  onChange={(e) => setKontakSettingsState({ ...kontakSettings, alamat: e.target.value })}
                  className="w-full p-2.5 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">Link Langsung Google Maps (Rute)</label>
                  <input
                    type="url"
                    value={kontakSettings.mapsUrl}
                    onChange={(e) => setKontakSettingsState({ ...kontakSettings, mapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 text-xs font-mono bg-white border-2 border-[#1C1917] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] uppercase mb-1">URL Iframe Embed Google Maps</label>
                  <input
                    type="url"
                    value={kontakSettings.mapsEmbedUrl}
                    onChange={(e) => setKontakSettingsState({ ...kontakSettings, mapsEmbedUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full px-3 py-2 text-xs font-mono bg-white border-2 border-[#1C1917] rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={kontakSubmitting}
                className="w-full py-3 bg-[#5B8266] text-white font-bold text-sm rounded-xl border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917]"
              >
                {kontakSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan Kontak & Peta'}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: PENDAFTAR PPDB ONLINE                              */}
        {/* ========================================================= */}
        {activeTab === 'ppdb' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-[#FFFDF9] border-[2.5px] border-[#1C1917] p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_#1C1917] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#1C1917]">
                  Data Calon Santri Masuk PPDB ({ppdbSubmissions.length})
                </h3>
                <p className="text-xs text-[#6B6357]">
                  Pendaftaran yang dikirimkan oleh Ayah/Bunda secara online melalui website.
                </p>
              </div>
            </div>

            {ppdbSubmissions.length === 0 ? (
              <div className="p-8 text-center bg-white border-2 border-dashed border-[#1C1917] rounded-2xl">
                <Users className="w-8 h-8 text-[#D96B43] mx-auto mb-2" />
                <p className="font-bold text-sm text-[#1C1917]">Belum ada pendaftaran masuk</p>
                <p className="text-xs text-[#7D7569] mt-1">Formulir pendaftaran di website siap menerima data.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ppdbSubmissions.map((sub) => {
                  const cleanWa = sub.noWhatsapp.replace(/\D/g, '');
                  const waChatLink = `https://wa.me/${cleanWa}?text=${encodeURIComponent(`Assalamu'alaikum Ayah/Bunda ${sub.namaWali}, kami dari Panitia PPDB RA Almaqom menindaklanjuti pendaftaran ananda ${sub.namaAnak}...`)}`;
                  return (
                    <div key={sub.id} className="p-5 bg-white border-2 border-[#1C1917] rounded-xl shadow-[3px_3px_0px_#1C1917] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-[#1C1917]">Santri: {sub.namaAnak}</span>
                          <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#EDF4EE] text-[#2C4A34] rounded border border-[#2C4A34]/20">
                            {sub.usiaAnak}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B6357]">
                          <strong>Wali:</strong> {sub.namaWali} &nbsp;|&nbsp; <strong>No WA:</strong> {sub.noWhatsapp}
                        </p>
                        {sub.pesan && (
                          <p className="text-xs text-stone-500 italic bg-stone-50 p-2 rounded border border-stone-200">
                            "{sub.pesan}"
                          </p>
                        )}
                        <span className="text-[10px] text-stone-400 font-mono block">
                          Terdaftar: {new Date(sub.createdAt).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={waChatLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-lg border border-black/20 flex items-center gap-1.5 shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Hubungi via WA</span>
                        </a>

                        <button
                          onClick={() => setDeletePpdbModal({ id: sub.id, nama: sub.namaAnak })}
                          className="p-1.5 text-[#D96B43] hover:bg-rose-50 border border-black/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODALS UNTUK HAPUS AMAN (BEBAS BLOKIR BROWSER) */}
      {/* 1. Modal Hapus Prestasi */}
      {deletePrestasiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-[3px] border-[#1C1917] rounded-2xl max-w-sm w-full p-6 shadow-[8px_8px_0px_#1C1917]">
            <h3 className="text-base font-extrabold text-[#1C1917] mb-2">Hapus Prestasi?</h3>
            <p className="text-xs text-stone-600 mb-4">Hapus "{deletePrestasiModal.judul}" ({deletePrestasiModal.nama})?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeletePrestasiModal(null)} className="px-3 py-1.5 text-xs font-bold bg-white border border-black rounded">Batal</button>
              <button onClick={handleExecuteDeletePrestasi} className="px-3 py-1.5 text-xs font-bold bg-[#D96B43] text-white rounded">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Hapus Guru */}
      {deleteGuruModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-[3px] border-[#1C1917] rounded-2xl max-w-sm w-full p-6 shadow-[8px_8px_0px_#1C1917]">
            <h3 className="text-base font-extrabold text-[#1C1917] mb-2">Hapus Pendidik?</h3>
            <p className="text-xs text-stone-600 mb-4">Hapus profil "{deleteGuruModal.nama}" dari album guru?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteGuruModal(null)} className="px-3 py-1.5 text-xs font-bold bg-white border border-black rounded">Batal</button>
              <button onClick={handleExecuteDeleteGuru} className="px-3 py-1.5 text-xs font-bold bg-[#D96B43] text-white rounded">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Hapus Fasilitas */}
      {deleteFasilitasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-[3px] border-[#1C1917] rounded-2xl max-w-sm w-full p-6 shadow-[8px_8px_0px_#1C1917]">
            <h3 className="text-base font-extrabold text-[#1C1917] mb-2">Hapus Fasilitas?</h3>
            <p className="text-xs text-stone-600 mb-4">Hapus fasilitas "{deleteFasilitasModal.nama}"?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteFasilitasModal(null)} className="px-3 py-1.5 text-xs font-bold bg-white border border-black rounded">Batal</button>
              <button onClick={handleExecuteDeleteFasilitas} className="px-3 py-1.5 text-xs font-bold bg-[#D96B43] text-white rounded">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Hapus Testimoni */}
      {deleteTestimoniModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-[3px] border-[#1C1917] rounded-2xl max-w-sm w-full p-6 shadow-[8px_8px_0px_#1C1917]">
            <h3 className="text-base font-extrabold text-[#1C1917] mb-2">Hapus Testimoni?</h3>
            <p className="text-xs text-stone-600 mb-4">Hapus testimoni dari "{deleteTestimoniModal.nama}"?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTestimoniModal(null)} className="px-3 py-1.5 text-xs font-bold bg-white border border-black rounded">Batal</button>
              <button onClick={handleExecuteDeleteTestimoni} className="px-3 py-1.5 text-xs font-bold bg-[#D96B43] text-white rounded">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Hapus PPDB Submission */}
      {deletePpdbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-[3px] border-[#1C1917] rounded-2xl max-w-sm w-full p-6 shadow-[8px_8px_0px_#1C1917]">
            <h3 className="text-base font-extrabold text-[#1C1917] mb-2">Hapus Data Pendaftaran?</h3>
            <p className="text-xs text-stone-600 mb-4">Hapus pendaftaran santri "{deletePpdbModal.nama}"?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeletePpdbModal(null)} className="px-3 py-1.5 text-xs font-bold bg-white border border-black rounded">Batal</button>
              <button onClick={handleExecuteDeletePpdb} className="px-3 py-1.5 text-xs font-bold bg-[#D96B43] text-white rounded">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
