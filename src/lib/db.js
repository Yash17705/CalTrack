/**
 * CalTrack – localStorage "database" layer
 * All user data is stored per-email key under ct_users.
 * The active session email is kept in ct_session.
 */

const USERS_KEY   = 'ct_users';
const SESSION_KEY = 'ct_session';

const DEFAULT_USER_DATA = () => ({
  logs:  {},           // { "YYYY-MM-DD": [ FoodEntry, … ] }
  water: { qty: 250, intervalMin: 60 },
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
    return !!this.users()[email];
  },

  getUser(email) {
    return this.users()[email] || null;
  },

  createUser(email, password, name) {
    const users = this.users();
    if (users[email]) throw new Error('Email already registered.');
    users[email] = { password, name, data: DEFAULT_USER_DATA() };
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
    return this.getUser(email)?.data || DEFAULT_USER_DATA();
  },

  saveUserData(email, data) {
    const users = this.users();
    if (!users[email]) return;
    users[email].data = data;
    this.saveUsers(users);
  },

  // ── Session ─────────────────────────────────────────────────────────────
  session()             { return localStorage.getItem(SESSION_KEY); },
  setSession(email)     { localStorage.setItem(SESSION_KEY, email); },
  clearSession()        { localStorage.removeItem(SESSION_KEY); },
};
