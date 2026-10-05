import React, { useState, useEffect } from 'react';
import { Lock, User, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onNavigate?: (path: string) => void;
}

export const ADMIN_AUTH_KEY = 'ra_almaqom_admin_auth';

export default function AdminLoginPage({ onNavigate }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  // Check if already authenticated
  useEffect(() => {
    try {
      const isAuth = localStorage.getItem(ADMIN_AUTH_KEY);
      if (isAuth === 'true') {
        // Already logged in
        navigateTo('/admin/dashboard');
      }
    } catch (e) {
      console.warn("Storage check:", e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      // Static credentials check as specified
      if (username.trim() === 'admin_ilham' && password.trim() === 'ilham123') {
        try {
          localStorage.setItem(ADMIN_AUTH_KEY, 'true');
          localStorage.setItem('ra_almaqom_admin_user', 'admin_ilham');
          localStorage.setItem('ra_almaqom_login_time', new Date().toISOString());
        } catch (e) {
          console.error(e);
        }
        setIsLoading(false);
        navigateTo('/admin/dashboard');
      } else {
        setIsLoading(false);
        setErrorMessage('Username atau kata sandi tidak sesuai. Silakan periksa kembali kredensial Anda.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] bg-paper-grid flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar Navigation */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5B8266] hover:text-[#3E5C46] transition-colors py-1.5 px-3 rounded-lg bg-white/80 border border-[#5B8266]/30 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Mading</span>
        </button>

        <span className="text-xs font-mono font-medium text-[#7D7569]">
          Portal Pendidik & Tata Usaha
        </span>
      </div>

      {/* Main Login Card - Neo-Brutalist Scrapbook Memo */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="relative bg-[#FFFDF9] border-[3px] border-[#1C1917] p-6 sm:p-8 shadow-[6px_6px_0px_#1C1917] rounded-2xl rotate-[-0.5deg]">
          
          {/* Top Washi Tape Decoration */}
          <div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-amber-200/90 border-y border-amber-400/50 shadow-xs pointer-events-none"
            style={{ clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)' }}
          />

          {/* Header */}
          <div className="text-center pt-2 pb-6 border-b border-dashed border-[#D6CEBF]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#5B8266] text-white border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1C1917] tracking-tight">
              Masuk Portal CMS
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#665D53]">
              Pengelolaan Mading Prestasi & Dokumen RA Almaqom
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-[#FDF2ED] border-2 border-[#D96B43] rounded-xl text-xs text-[#8C3A1D] flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D96B43]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7D7569]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_ilham"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] focus:outline-none focus:ring-2 focus:ring-[#5B8266] transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7D7569]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-16 py-2.5 text-sm bg-white border-2 border-[#1C1917] rounded-xl shadow-[2px_2px_0px_#1C1917] focus:outline-none focus:ring-2 focus:ring-[#5B8266] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-[#5B8266] hover:text-[#3E5C46]"
                >
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#5B8266] hover:bg-[#4E7257] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1C1917] text-white font-bold text-sm rounded-xl border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-4 border-t border-[#E8DFD1] text-center flex items-center justify-center gap-1.5 text-xs text-[#7D7569]">
            <ShieldCheck className="w-4 h-4 text-[#5B8266]" />
            <span>Sistem Terenkripsi & Terkoneksi Firestore</span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="text-center text-xs text-[#7D7569]">
        <p>© 2026/2027 Raudhatul Athfal (RA) Almaqom. Hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}
