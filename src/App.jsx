import { useState, useEffect, useRef } from 'react';
import { DB, normalizeUserData } from './lib/db.js';
import { getLocalDateString } from './lib/date.js';
import { themes } from './lib/theme.js';
import AuthScreen   from './components/AuthScreen.jsx';
import Navbar       from './components/Navbar.jsx';
import TodayTab     from './components/TodayTab.jsx';
import HistoryTab   from './components/HistoryTab.jsx';
import WaterTab     from './components/WaterTab.jsx';
import ProfileTab   from './components/ProfileTab.jsx';
import { NotifBanner } from './components/UI.jsx';

const THEME_KEY = 'ct_theme';

const getInitialDarkMode = () => {
  const storedTheme = window.localStorage.getItem(THEME_KEY);

  if (storedTheme === 'dark') return true;
  if (storedTheme === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const TABS = [
  { key: 'today',   label: 'Today',   icon: '🍽️' },
  { key: 'history', label: 'History', icon: '📊' },
  { key: 'water',   label: 'Water',   icon: '💧' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

export default function App() {
  const [dark, setDark]               = useState(getInitialDarkMode);
  const [loggedIn, setLoggedIn]       = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData]       = useState(null);
  const [tab, setTab]                 = useState('today');
  const [notif, setNotif]             = useState(null);
  const waterTimer                    = useRef(null);
  const notifTimer                    = useRef(null);

  const C = dark ? themes.dark : themes.light;

  // ── Restore session ──────────────────────────────────────────────────────
  useEffect(() => {
    const email = DB.session();
    if (email && DB.userExists(email)) {
      doLogin(email);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }, [dark]);

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

  useEffect(() => () => {
    clearInterval(waterTimer.current);
    clearTimeout(notifTimer.current);
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showNotif = (msg, type = 'info') => {
    clearTimeout(notifTimer.current);
    setNotif({ msg, type });
    notifTimer.current = setTimeout(() => setNotif(null), 4500);
  };

  const doLogin = (email) => {
    setCurrentUser(email);
    setUserData(DB.userData(email));
    setLoggedIn(true);
  };

  const handleLogout = () => {
    DB.clearSession();
    clearInterval(waterTimer.current);
    clearTimeout(notifTimer.current);
    setNotif(null);
    setCurrentUser(null);
    setUserData(null);
    setLoggedIn(false);
    setTab('today');
  };

  const saveUserData = (data) => {
    if (!currentUser) return;

    const normalizedData = normalizeUserData(data);
    setUserData(normalizedData);
    DB.saveUserData(currentUser, normalizedData);
  };

  // ── Food actions ─────────────────────────────────────────────────────────
  const handleAddFood = (item) => {
    const today = getLocalDateString();
    const newLogs = { ...userData.logs };
    if (!newLogs[today]) newLogs[today] = [];
    newLogs[today] = [...newLogs[today], { ...item, id: Date.now() }];
    saveUserData({ ...userData, logs: newLogs });
    showNotif(`✅ Added ${item.name}`, 'success');
  };

  const handleRemoveFood = (id) => {
    const today = getLocalDateString();
    const newLogs = { ...userData.logs };
    newLogs[today] = (newLogs[today] || []).filter(f => f.id !== id);
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
  const todayLogs = userData.logs[getLocalDateString()] || [];
  const shellVars = {
    '--bg': C.bg,
    '--bg-alt': C.bgAlt,
    '--text': C.text,
    '--sub': C.sub,
    '--accent': C.accent,
    '--accent-strong': C.accentStrong,
    '--accent-light': C.accentLight,
    '--accent-glow': C.accentGlow,
    '--blue-light': C.blueLight,
    '--border': C.border,
    '--card': C.card,
    '--card-hover': C.cardHover,
    '--input': C.input,
    '--navbar': C.navbar,
    '--orb-a': C.orbA,
    '--orb-b': C.orbB,
    '--shadow': C.shadow,
    '--shadow-soft': C.shadowSoft,
  };

  return (
    <div className="app-shell" style={shellVars}>
      <NotifBanner notif={notif} C={C} />

      <div className="shell-frame">
        <div className="top-rail">
          <Navbar
            currentUser={currentUser}
            dark={dark}
            setDark={setDark}
            onLogout={handleLogout}
            C={C}
          />

          <div className="tab-strip">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`tab-button${tab === key ? ' active' : ''}`}
              >
                <span style={{ marginRight: 8 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="page-wrap">
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
    </div>
  );
}
