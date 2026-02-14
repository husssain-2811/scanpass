import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const router = useRouter();

  const generateFingerprint = (videoElement) => {
    const tinyCanvas = document.createElement('canvas');
    tinyCanvas.width = 8;
    tinyCanvas.height = 8;
    const tinyCtx = tinyCanvas.getContext('2d');
    tinyCtx.drawImage(videoElement, 0, 0, 8, 8);
    const imageData = tinyCtx.getImageData(0, 0, 8, 8);
    const pixels = imageData.data;
    const grayValues = [];
    for (let i = 0; i < pixels.length; i += 4) {
      const gray = Math.round(pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114);
      grayValues.push(gray);
    }
    const avg = grayValues.reduce((a, b) => a + b, 0) / grayValues.length;
    return grayValues.map(v => v >= avg ? '1' : '0').join('');
  };

  const stopCamera = () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    } catch (err) {
      console.log('Camera already stopped');
    }
  };

  const startScan = async () => {
    if (!email) {
      setMessage({ text: '📧 Please enter your email first!', type: 'error' });
      return;
    }
    try {
      setScanning(true);
      setMessage({ text: '', type: '' });
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      setMessage({ text: '📷 Camera access denied. Please allow camera.', type: 'error' });
      setScanning(false);
    }
  };

  const captureAndRegister = async () => {
    setLoading(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
    const fingerprint = generateFingerprint(videoRef.current);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fingerprint }),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage({ text: '✅ ' + result.message, type: 'success' });
        // 2 second baad login page pe le jao
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage({ text: '❌ ' + result.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: '❌ Error connecting to server', type: 'error' });
    }

    setLoading(false);
    setScanning(false);
    stopCamera();
  };

  return (
    <div className="animated-bg">
      {/* ──── Background Particles ──── */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 w-full max-w-md page-enter">

          {/* ──── Logo / Icon ──── */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-3xl font-bold glow-text">ScanPass</h1>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Register your personal object as password
            </p>
          </div>

          <div className="divider"></div>

          {/* ──── Email Input ──── */}
          <div className="mb-4 fade-in fade-in-delay-1">
            <label className="block text-sm mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              📧 Email Address
            </label>
            <input
              type="email"
              placeholder="yourname@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          {/* ──── Scan Button / Camera ──── */}
          <div className="mb-4 fade-in fade-in-delay-2">
            {!scanning ? (
              <button onClick={startScan} className="btn-primary">
                📸 Start Scanning Object
              </button>
            ) : (
              <div>
                {/* ──── Scanner with animation ──── */}
                <div className="scanner-container mb-4">
                  <div className="scanner-line"></div>
                  <div className="scanner-corner scanner-corner-tl"></div>
                  <div className="scanner-corner scanner-corner-tr"></div>
                  <div className="scanner-corner scanner-corner-bl"></div>
                  <div className="scanner-corner scanner-corner-br"></div>
                  <video ref={videoRef} width="320" height="240"></video>
                </div>

                {/* ──── Recording indicator ──── */}
                <div className="flex items-center justify-center mb-4 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <span className="pulse-dot"></span>
                  Camera Active — Hold your object steady
                </div>

                <button onClick={captureAndRegister} className="btn-success" disabled={loading}>
                  {loading ? (
                    <><span className="spinner"></span> Processing...</>
                  ) : (
                    '✅ Capture and Register'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ──── Hidden Canvas ──── */}
          <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>

          {/* ──── Message ──── */}
          {message.text && (
            <div className={`mt-4 text-center text-sm ${
              message.type === 'success' ? 'message-success' : 
              message.type === 'error' ? 'message-error' : 'message-info'
            }`}>
              {message.text}
            </div>
          )}

          <div className="divider"></div>

          {/* ──── Login Link ──── */}
          <p className="text-center text-sm fade-in fade-in-delay-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Already registered?{' '}
            <a href="/login" className="link">Login here →</a>
          </p>
        </div>
      </div>
    </div>
  );
}