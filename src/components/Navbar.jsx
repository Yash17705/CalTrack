import { DB } from '../lib/db.js';

export default function Navbar({ currentUser, dark, setDark, onLogout, C }) {
  const userName = DB.getUser(currentUser)?.name || currentUser;

  return (
    <nav style={{
      background: C.navbar,
      border: `1px solid ${C.border}`,
      borderRadius: 28,
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      backdropFilter: 'blur(20px)',
      boxShadow: C.shadowSoft,
      flexWrap: 'wrap',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 46,
          height: 46,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${C.accent}, ${C.orange})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 22,
          boxShadow: `0 16px 32px ${C.accentGlow}`,
        }}>
          ⚡
        </div>
        <div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 24,
            color: C.text,
            letterSpacing: -1.1,
            lineHeight: 1,
          }}>
            CalTrack
          </div>
          <div style={{ color: C.sub, fontSize: 12, marginTop: 5 }}>
            Daily nutrition dashboard
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '7px 9px 7px 8px',
          borderRadius: 999,
          background: C.input,
          border: `1px solid ${C.border}`,
          minWidth: 0,
        }}>
          <div title={userName} style={{
            width: 34, height: 34, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14,
            boxShadow: `0 0 0 2px ${C.card}`,
            flexShrink: 0,
          }}>
            {userName[0]?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              color: C.text,
              fontSize: 13,
              fontWeight: 700,
              maxWidth: 180,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {userName}
            </div>
            <div style={{ color: C.sub, fontSize: 11 }}>
              Private local profile
            </div>
          </div>
        </div>

        <button type="button" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark(!dark)} style={{
          background: C.input,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: '10px 12px',
          cursor: 'pointer',
          color: C.text,
          fontSize: 16,
          transition: 'border-color .2s',
        }}>
          {dark ? '☀️' : '🌙'}
        </button>

        {/* Logout */}
        <button type="button" onClick={onLogout} style={{
          background: `${C.red}10`,
          color: C.red,
          border: `1px solid ${C.red}35`,
          borderRadius: 14,
          padding: '10px 14px',
          cursor: 'pointer',
          fontSize: 13,
          fontFamily: 'inherit',
          fontWeight: 700,
          transition: 'all .2s',
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
