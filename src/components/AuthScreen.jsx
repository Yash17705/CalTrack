import { useState } from 'react';
import { DB } from '../lib/db.js';
import { Btn, Input } from './UI.jsx';

export default function AuthScreen({ onLogin, dark, setDark, C }) {
  const [mode, setMode]     = useState('login'); // 'login' | 'signup'
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!form.name || !form.email || !form.password)
          throw new Error('All fields are required.');
        if (form.password.length < 6)
          throw new Error('Password must be at least 6 characters.');
        DB.createUser(form.email.trim().toLowerCase(), form.password, form.name.trim());
      } else {
        DB.verifyUser(form.email.trim().toLowerCase(), form.password);
      }
      DB.setSession(form.email.trim().toLowerCase());
      onLogin(form.email.trim().toLowerCase());
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', top: -200, right: -200,
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.accent}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -200, left: -200,
        width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${C.blue}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp .5s ease', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 36, color: C.accent, letterSpacing: -1.5, marginBottom: 8,
          }}>
            ⚡ CalTrack
          </div>
          <p style={{ color: C.sub, margin: 0, fontSize: 15 }}>
            Your personal nutrition & hydration companion
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: 28,
          boxShadow: dark ? '0 24px 64px rgba(0,0,0,.4)' : '0 24px 64px rgba(108,99,255,.08)',
        }}>
          {/* Tab switcher */}
          <div style={{
            display: 'flex', gap: 6, marginBottom: 24,
            background: C.input, borderRadius: 12, padding: 4,
          }}>
            {[['login', 'Sign In'], ['signup', 'Create Account']].map(([k, l]) => (
              <button
                key={k}
                onClick={() => { setMode(k); setError(''); }}
                style={{
                  flex: 1, padding: '9px 0', border: 'none', borderRadius: 9,
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: k === mode ? 700 : 500,
                  fontSize: 13, background: k === mode ? C.accent : 'transparent',
                  color: k === mode ? '#fff' : C.sub, transition: 'all .25s',
                }}
              >{l}</button>
            ))}
          </div>

          {/* Fields */}
          {mode === 'signup' && (
            <Input label="Full Name" C={C} placeholder="Jane Doe"
              value={form.name} onChange={update('name')} onKeyDown={handleKey} />
          )}
          <Input label="Email" C={C} type="email" placeholder="you@email.com"
            value={form.email} onChange={update('email')} onKeyDown={handleKey} />
          <Input label="Password" C={C} type="password"
            placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
            value={form.password} onChange={update('password')} onKeyDown={handleKey} />

          {/* Error */}
          {error && (
            <div style={{
              background: `${C.red}18`, color: C.red, border: `1px solid ${C.red}44`,
              padding: '10px 14px', borderRadius: 9, fontSize: 13, marginBottom: 16,
            }}>{error}</div>
          )}

          {/* Submit */}
          <Btn C={C} style={{ width: '100%', padding: '13px 0', fontSize: 15 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? '…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </Btn>

          {/* Dark toggle */}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => setDark(!dark)} style={{
              background: 'none', border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '6px 16px', cursor: 'pointer',
              color: C.sub, fontSize: 13, transition: 'border-color .2s',
            }}>
              {dark ? '☀️  Light Mode' : '🌙  Dark Mode'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: C.sub, fontSize: 12, marginTop: 20 }}>
          Data stored locally in your browser · No server required
        </p>
      </div>
    </div>
  );
}
