import { useState, useEffect, useRef } from 'react';
import { DB } from './lib/db.js';
import { themes } from './lib/theme.js';
import AuthScreen   from './components/AuthScreen.jsx';
import Navbar       from './components/Navbar.jsx';
import TodayTab     from './components/TodayTab.jsx';
import HistoryTab   from './components/HistoryTab.jsx';
import WaterTab     from './components/WaterTab.jsx';
import ProfileTab   from './components/ProfileTab.jsx';
import { NotifBanner } from './components/UI.jsx';

const todayStr = () => new Date().toISOString().slice(0, 10);

const TABS = [
  { key: 'today',   label: '🍽️ Today'   },
  { key: 'history', label: '📊 History'  },
  { key: 'water',   label: '💧 Water'    },
  { key: 'profile', label: '👤 Profile'  },
];

export default function App() {
  const [dark, setDark]               = useState(true);
  const [loggedIn, setLoggedIn]       = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData]       = useState(null);
  const [tab, setTab]                 = useState('today');
  const [notif, setNotif]             = useState(null);
  const waterTimer                    = useRef(null);

  const C = dark ? themes.dark : themes.light;

  // ── Restore session ──────────────────────────────────────────────────────
  useEffect(() => {
    const email = DB.session();
    if (email && DB.userExists(email)) {
      doLogin(email);
    }
  }, []);

  // ── Water reminder timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (!userData) return;
    clearInterval(waterTimer.current);
    const ms = userData.water.intervalMin * 60 * 1000;
    waterTimer.current = setInterval(() => {
      showNotif(`💧 Drink ${userData.water.qty}ml of water now!`, 'water');
    }, ms);
    return () => clearInterval(waterTimer.current);
  }, [userData?.water?.intervalMin, userData?.water?.qty]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showNotif = (msg, type = 'info') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 4500);
  };

  const doLogin = (email) => {
    setCurrentUser(email);
    setUserData(DB.userData(email));
    setLoggedIn(true);
  };

  const handleLogout = () => {
    DB.clearSession();
    clearInterval(waterTimer.current);
    setCurrentUser(null);
    setUserData(null);
    setLoggedIn(false);
    setTab('today');
  };

  const saveUserData = (data) => {
    setUserData(data);
    DB.saveUserData(currentUser, data);
  };

  // ── Food actions ─────────────────────────────────────────────────────────
  const handleAddFood = (item) => {
    const newLogs = { ...userData.logs };
    if (!newLogs[todayStr()]) newLogs[todayStr()] = [];
    newLogs[todayStr()] = [...newLogs[todayStr()], { ...item, id: Date.now() }];
    saveUserData({ ...userData, logs: newLogs });
    showNotif(`✅ Added ${item.name}`, 'success');
  };

  const handleRemoveFood = (id) => {
    const newLogs = { ...userData.logs };
    newLogs[todayStr()] = (newLogs[todayStr()] || []).filter(f => f.id !== id);
    saveUserData({ ...userData, logs: newLogs });
  };

  // ── Water settings ───────────────────────────────────────────────────────
  const handleSaveWater = (settings) => {
    saveUserData({ ...userData, water: settings });
    showNotif('💧 Water settings saved!', 'water');
  };

  // ── Auth screen ──────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <AuthScreen
        onLogin={doLogin}
        dark={dark}
        setDark={setDark}
        C={C}
      />
    );
  }

  // ── Main app ─────────────────────────────────────────────────────────────
  const todayLogs = userData.logs[todayStr()] || [];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", transition: 'background .3s, color .3s' }}>
      <NotifBanner notif={notif} C={C} />

      <Navbar
        currentUser={currentUser}
        dark={dark}
        setDark={setDark}
        onLogout={handleLogout}
        C={C}
      />

      {/* Tab bar */}
      <div style={{
        background: C.navbar, borderBottom: `1px solid ${C.border}`,
        display: 'flex', gap: 2, overflowX: 'auto', padding: '0 16px',
        backdropFilter: 'blur(12px)',
      }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '14px 18px', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, background: 'transparent',
            color: tab === key ? C.accent : C.sub,
            fontWeight: tab === key ? 700 : 500,
            borderBottom: tab === key ? `3px solid ${C.accent}` : '3px solid transparent',
            borderRadius: 0, transition: 'all .2s', whiteSpace: 'nowrap',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        {tab === 'today' && (
          <TodayTab
            logs={todayLogs}
            onAddFood={handleAddFood}
            onRemoveFood={handleRemoveFood}
            C={C}
          />
        )}
        {tab === 'history' && (
          <HistoryTab logs={userData.logs} C={C} />
        )}
        {tab === 'water' && (
          <WaterTab
            water={userData.water}
            onSave={handleSaveWater}
            C={C}
          />
        )}
        {tab === 'profile' && (
          <ProfileTab
            currentUser={currentUser}
            userData={userData}
            onLogout={handleLogout}
            C={C}
          />
        )}
      </div>
    </div>
  );
}
