/**
 * CalTrack – localStorage "database" layer
 * All user data is stored per-email key under ct_users.
 * The active session email is kept in ct_session.
 */

const USERS_KEY   = 'ct_users';
const SESSION_KEY = 'ct_session';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULT_USER_DATA = () => ({
  logs:  {},           // { "YYYY-MM-DD": [ FoodEntry, … ] }
  water: { qty: 250, intervalMin: 60 },
});

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const normalizeWaterSettings = (water) => {
  const qty = Number.parseInt(water?.qty, 10);
  const intervalMin = Number.parseInt(water?.intervalMin, 10);

  return {
    qty: Number.isFinite(qty) && qty >= 50 && qty <= 2000 ? qty : 250,
    intervalMin: Number.isFinite(intervalMin) && intervalMin >= 5 && intervalMin <= 480 ? intervalMin : 60,
  };
};

const normalizeLogs = (logs) => {
  if (!logs || typeof logs !== 'object' || Array.isArray(logs)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(logs)
      .filter(([, entries]) => Array.isArray(entries))
      .map(([date, entries]) => [date, entries.filter(Boolean)])
  );
};

export const normalizeUserData = (data) => ({
  ...DEFAULT_USER_DATA(),
  ...data,
  logs: normalizeLogs(data?.logs),
  water: normalizeWaterSettings(data?.water),
});

export const DB = {
  // ── Users ──────────────────────────────────────────────────────────────
  users() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
    catch { return {}; }
  },

  saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  userExists(email) {
    return !!this.users()[normalizeEmail(email)];
  },

  getUser(email) {
    return this.users()[normalizeEmail(email)] || null;
  },

  createUser(email, password, name) {
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = (name || '').trim();
    const users = this.users();

    if (!EMAIL_RE.test(normalizedEmail)) throw new Error('Enter a valid email address.');
    if (!normalizedName) throw new Error('Full name is required.');
    if (users[normalizedEmail]) throw new Error('Email already registered.');

    users[normalizedEmail] = {
      password,
      name: normalizedName,
      data: DEFAULT_USER_DATA(),
    };
    this.saveUsers(users);
  },

  verifyUser(email, password) {
    const u = this.getUser(email);
    if (!u)                    throw new Error('No account found for that email.');
    if (u.password !== password) throw new Error('Incorrect password.');
    return u;
  },

  // ── Per-user data ───────────────────────────────────────────────────────
  userData(email) {
    return normalizeUserData(this.getUser(email)?.data);
  },

  saveUserData(email, data) {
    const users = this.users();
    const normalizedEmail = normalizeEmail(email);
    if (!users[normalizedEmail]) return;
    users[normalizedEmail].data = normalizeUserData(data);
    this.saveUsers(users);
  },

  // ── Session ─────────────────────────────────────────────────────────────
  session()             { return localStorage.getItem(SESSION_KEY); },
  setSession(email)     { localStorage.setItem(SESSION_KEY, normalizeEmail(email)); },
  clearSession()        { localStorage.removeItem(SESSION_KEY); },
};
