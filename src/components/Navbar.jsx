import { DB } from '../lib/db.js';

export default function Navbar({ currentUser, dark, setDark, onLogout, C }) {
  const userName = DB.getUser(currentUser)?.name || currentUser;

  return (
    <nav style={{
      background: C.navbar, borderBottom: `1px solid ${C.border}`,
      padding: '0 24px', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: 22, color: C.accent, letterSpacing: -1,
      }}>
        ⚡ CalTrack
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {/* Dark toggle */}
        <button onClick={() => setDark(!dark)} style={{
          background: 'none', border: `1px solid ${C.border}`,
          borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
          color: C.sub, fontSize: 16, transition: 'border-color .2s',
        }}>
          {dark ? '☀️' : '🌙'}
        </button>

        {/* Avatar */}
        <div title={userName} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.accent}, #9f6cff)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 15,
          boxShadow: `0 0 0 2px ${C.border}`,
        }}>
          {userName[0]?.toUpperCase()}
        </div>

        {/* Logout */}
        <button onClick={onLogout} style={{
          background: 'transparent', color: C.sub,
          border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '6px 14px', cursor: 'pointer', fontSize: 13,
          fontFamily: 'inherit', transition: 'all .2s',
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
