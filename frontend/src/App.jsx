import { useEffect, useState } from 'react';
import ChatPage from './pages/ChatPage';

function App() {
  // Default dark mode: true jika localStorage belum ada
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('darkmode');
    return stored === null ? true : stored === 'true';
  });
  const [btnScale, setBtnScale] = useState(1);

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkmode', dark);
  }, [dark]);

  // Reset scale after click
  useEffect(() => {
    if (btnScale !== 1) {
      const t = setTimeout(() => setBtnScale(1), 120);
      return () => clearTimeout(t);
    }
  }, [btnScale]);

  return (
    <>
      <button
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 200,
          background: dark ? '#23232a' : '#fbbf24',
          color: dark ? '#fbbf24' : '#23232a',
          border: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          fontSize: 22,
          transition: 'transform 0.18s cubic-bezier(.4,0,.2,1)',
          transform: `scale(${btnScale})`
        }}
        onClick={() => {
          setDark(d => !d);
          setBtnScale(0.85);
        }}
        aria-label="Toggle dark mode"
        onMouseOver={() => setBtnScale(1.12)}
        onFocus={() => setBtnScale(1.12)}
        onBlur={() => setBtnScale(1)}
        onMouseLeave={() => setBtnScale(1)}
      >
        {dark ? '☀️' : '🌙'}
      </button>
      <ChatPage />
    </>
  );
}

export default App;