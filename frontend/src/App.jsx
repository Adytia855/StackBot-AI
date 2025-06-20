import { useEffect, useState } from 'react';
import ChatPage from './pages/ChatPage';

/**
 * Main application component.
 * It manages the dark mode theme toggle and renders the main `ChatPage`.
 * The dark mode preference is persisted in localStorage.
 *
 * @returns {JSX.Element} The main application structure.
 */
function App() {
  /** @state {boolean} dark - Indicates if dark mode is currently active. Initializes from localStorage or defaults to true. */
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('darkmode');
    return stored === null ? true : stored === 'true';
  });
  /** @state {number} btnScale - Controls the scale of the dark mode toggle button for click/hover animations. */
  const [btnScale, setBtnScale] = useState(1);

  /**
   * Effect to apply/remove 'dark' class to the body and update localStorage when `dark` state changes.
   */
  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkmode', dark);
  }, [dark]);

  /**
   * Effect to reset the dark mode toggle button's scale after a click animation.
   */
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