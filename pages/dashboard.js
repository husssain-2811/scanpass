import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const router = useRouter();

  useEffect(() => {
    // ──── Check: User logged in hai ya nahi? ────
    const savedUser = localStorage.getItem('scanpass_user');
    const savedSimilarity = localStorage.getItem('scanpass_similarity');
    const savedLoginTime = localStorage.getItem('scanpass_loginTime');

    if (!savedUser) {
      // Agar login nahi hai → login page pe bhejo
      router.push('/login');
      return;
    }

    setUser(savedUser);
    setSimilarity(savedSimilarity);
    setLoginTime(new Date(savedLoginTime).toLocaleString());

    // ──── Live clock update karo har second ────
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup: jab page band ho to timer band karo
    return () => clearInterval(timer);
  }, [router]);

  // ──── Logout function ────
  const handleLogout = () => {
    // LocalStorage se sab data hatao
    localStorage.removeItem('scanpass_user');
    localStorage.removeItem('scanpass_similarity');
    localStorage.removeItem('scanpass_loginTime');

    // Login page pe bhejo
    router.push('/login');
  };

  // Jab tak data load nahi hua, loading dikhao
  if (!user) {
    return (
      <div className="animated-bg">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
            <p className="mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animated-bg">
      {/* ──── Background Particles ──── */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>

      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto page-enter">

          {/* ══════════════════════════════════════
              TOP NAVIGATION BAR
              ══════════════════════════════════════ */}
          <div className="glass-card p-4 mb-6 flex items-center justify-between fade-in fade-in-delay-1"
               style={{ borderRadius: '16px' }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <span className="text-lg font-bold glow-text">ScanPass</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {currentTime}
              </span>
              <button onClick={handleLogout} className="btn-danger" 
                      style={{ width: 'auto', padding: '10px 20px', fontSize: '13px' }}>
                🚪 Logout
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════
              WELCOME SECTION
              ══════════════════════════════════════ */}
          <div className="glass-card p-8 mb-6 text-center fade-in fade-in-delay-2">
            {/* Success Checkmark */}
            <div className="checkmark-circle">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              You are securely authenticated
            </p>
            <div className="mt-4">
              <span className="status-badge status-online">
                <span className="pulse-dot" style={{ background: '#10b981' }}></span>
                Online & Verified
              </span>
            </div>
          </div>

          {/* ══════════════════════════════════════
              INFO CARDS GRID
              ══════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            {/* Card 1: User Info */}
            <div className="dashboard-card fade-in fade-in-delay-2">
              <div className="icon-circle mb-3" style={{ background: 'rgba(99,102,241,0.15)' }}>
                👤
              </div>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                LOGGED IN AS
              </p>
              <p className="font-semibold text-sm" style={{ 
                color: '#a5b4fc',
                wordBreak: 'break-all' 
              }}>
                {user}
              </p>
            </div>

            {/* Card 2: Match Percentage */}
            <div className="dashboard-card fade-in fade-in-delay-3">
              <div className="icon-circle mb-3" style={{ background: 'rgba(16,185,129,0.15)' }}>
                🎯
              </div>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                OBJECT MATCH
              </p>
              <p className="font-semibold text-2xl" style={{ color: '#6ee7b7' }}>
                {similarity}%
              </p>
              {/* ──── Progress Bar ──── */}
              <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                <div className="h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${similarity}%`,
                    background: 'linear-gradient(90deg, #059669, #10b981)'
                  }}>
                </div>
              </div>
            </div>

            {/* Card 3: Login Time */}
            <div className="dashboard-card fade-in fade-in-delay-4">
              <div className="icon-circle mb-3" style={{ background: 'rgba(168,85,247,0.15)' }}>
                🕐
              </div>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                LOGIN TIME
              </p>
              <p className="font-semibold text-sm" style={{ color: '#c4b5fd' }}>
                {loginTime}
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════
              SECURITY INFO SECTION
              ══════════════════════════════════════ */}
          <div className="glass-card p-6 mb-6 fade-in fade-in-delay-4">
            <h2 className="text-lg font-bold mb-4">🛡️ Security Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg"
                   style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <p className="text-sm font-medium">Object Authentication</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Your personal object was verified successfully
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg"
                   style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <p className="text-sm font-medium">Perceptual Hash Match</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Object fingerprint matched with {similarity}% accuracy
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg"
                   style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <p className="text-sm font-medium">No Password Used</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Zero password fatigue — authenticated with visual object
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════
              HOW IT WORKS SECTION
              ══════════════════════════════════════ */}
          <div className="glass-card p-6 mb-6 fade-in fade-in-delay-4">
            <h2 className="text-lg font-bold mb-4">🔍 How ScanPass Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3">
                <div className="text-3xl mb-2">📧</div>
                <p className="text-xs font-medium">Step 1</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Enter Email</p>
              </div>
              <div className="text-center p-3">
                <div className="text-3xl mb-2">📸</div>
                <p className="text-xs font-medium">Step 2</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Scan Object</p>
              </div>
              <div className="text-center p-3">
                <div className="text-3xl mb-2">🧬</div>
                <p className="text-xs font-medium">Step 3</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Generate Fingerprint</p>
              </div>
              <div className="text-center p-3">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-xs font-medium">Step 4</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Authenticated!</p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════
              FOOTER
              ══════════════════════════════════════ */}
          <div className="text-center py-4 fade-in fade-in-delay-4">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              🔐 ScanPass Visual Authentication System — No passwords, no worries
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}