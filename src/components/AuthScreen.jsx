import { useState } from 'react';
import { DB } from '../lib/db.js';
import { Btn, Input } from './UI.jsx';

export default function AuthScreen({ onLogin, dark, setDark, C }) {
  const [mode, setMode]   = useState('login'); // 'login' | 'signup'
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const features = [
    { label: 'Log meals fast', detail: 'Search built-in foods or create your own entries in seconds.' },
    { label: 'See the full picture', detail: 'Track calories, macros, and hydration in one place.' },
    { label: 'Stay private', detail: 'Everything stays in your browser with no backend required.' },
  ];

  const update = (key) => (event) => {
    setError('');
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError('');

    const email = form.email.trim().toLowerCase();

    try {
      if (mode === 'signup') {
        if (!form.name || !form.email || !form.password)
          throw new Error('All fields are required.');
        if (form.password.length < 6)
          throw new Error('Password must be at least 6 characters.');
        DB.createUser(email, form.password, form.name);
      } else {
        DB.verifyUser(email, form.password);
      }

      DB.setSession(email);
      onLogin(email);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: `
        radial-gradient(circle at top right, ${C.orbA}, transparent 26%),
        radial-gradient(circle at bottom left, ${C.orbB}, transparent 22%),
        linear-gradient(180deg, ${C.bgAlt}, ${C.bg})
      `,
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

      <div className="auth-layout" style={{ animation: 'fadeUp .5s ease', position: 'relative' }}>
        <div
          className="auth-panel"
          style={{
            background: `linear-gradient(145deg, ${C.cardHover}, ${C.card})`,
            border: `1px solid ${C.border}`,
            borderRadius: 32,
            padding: 30,
            boxShadow: C.shadow,
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at top right, ${C.accentLight}, transparent 35%), radial-gradient(circle at bottom left, ${C.blueLight}, transparent 32%)`,
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div className="capsule" style={{ marginBottom: 16 }}>
              Personal Nutrition Hub
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 48,
              color: C.text,
              letterSpacing: -2.2,
              lineHeight: 0.95,
              maxWidth: 440,
            }}>
              Build better routines without bloated tracking tools.
            </div>
            <p style={{
              color: C.sub,
              margin: '18px 0 0',
              fontSize: 15,
              lineHeight: 1.75,
              maxWidth: 500,
            }}>
              CalTrack keeps your daily dashboard focused: fast meal logging, simple macro visibility,
              and hydration reminders that stay entirely local to your browser.
            </p>

            <div style={{ display: 'grid', gap: 12, marginTop: 28 }}>
              {features.map((feature) => (
                <div
                  key={feature.label}
                  style={{
                    padding: 16,
                    borderRadius: 20,
                    border: `1px solid ${C.border}`,
                    background: C.input,
                    boxShadow: `inset 0 1px 0 ${C.cardHover}`,
                  }}
                >
                  <div style={{ color: C.text, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                    {feature.label}
                  </div>
                  <div style={{ color: C.sub, fontSize: 13, lineHeight: 1.65 }}>
                    {feature.detail}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 24,
            }}>
              {['Calories', 'Macros', 'Hydration'].map((label) => (
                <div
                  key={label}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 999,
                    background: C.accentLight,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 32,
            padding: 30,
            boxShadow: C.shadow,
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
            <div>
              <div className="capsule" style={{ marginBottom: 12 }}>
                ⚡ CalTrack
              </div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 34,
                lineHeight: 1,
                margin: 0,
                letterSpacing: -1.4,
                color: C.text,
              }}>
                {mode === 'login' ? 'Welcome back' : 'Create your space'}
              </h1>
              <p style={{ margin: '10px 0 0', color: C.sub, fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
                {mode === 'login'
                  ? 'Jump straight into your dashboard and keep the streak going.'
                  : 'Start with a private, lightweight tracker that stays on this device.'}
              </p>
            </div>
            <button type="button" onClick={() => setDark(!dark)} style={{
              background: C.input,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: '10px 12px',
              cursor: 'pointer',
              color: C.text,
              fontSize: 16,
            }}>
              {dark ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', gap: 6, marginBottom: 24,
            background: C.input, borderRadius: 18, padding: 5,
            border: `1px solid ${C.border}`,
          }}>
            {[['login', 'Sign In'], ['signup', 'Create Account']].map(([k, l]) => (
              <button
                key={k}
                type="button"
                onClick={() => { setMode(k); setError(''); }}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  border: 'none',
                  borderRadius: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: k === mode ? 700 : 500,
                  fontSize: 13,
                  background: k === mode ? `linear-gradient(135deg, ${C.accent}, ${C.accentStrong})` : 'transparent',
                  color: k === mode ? '#fff' : C.sub,
                  transition: 'all .25s',
                  boxShadow: k === mode ? `0 14px 28px ${C.accentGlow}` : 'none',
                }}
              >{l}</button>
            ))}
          </div>

          {/* Fields */}
          {mode === 'signup' && (
            <Input
              label="Full Name"
              C={C}
              placeholder="Jane Doe"
              autoComplete="name"
              value={form.name}
              onChange={update('name')}
            />
          )}
          <Input
            label="Email"
            C={C}
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
          />
          <Input
            label="Password"
            C={C}
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
            value={form.password}
            onChange={update('password')}
          />

          {/* Error */}
          {error && (
            <div style={{
              background: `${C.red}18`, color: C.red, border: `1px solid ${C.red}44`,
              padding: '10px 14px', borderRadius: 9, fontSize: 13, marginBottom: 16,
            }}>{error}</div>
          )}

          {/* Submit */}
          <Btn type="submit" C={C} style={{ width: '100%', padding: '13px 0', fontSize: 15 }}>
            {mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </Btn>

          <div style={{
            marginTop: 20,
            paddingTop: 18,
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            color: C.sub,
            fontSize: 12,
          }}>
            <span>Stored locally in your browser</span>
            <span>No server required</span>
          </div>
        </form>
      </div>
    </div>
  );
}
