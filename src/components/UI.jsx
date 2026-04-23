import React from 'react';

// ── MacroBar ───────────────────────────────────────────────────────────────
export function MacroBar({ label, value, max, color, C }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: C.sub }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span>{Math.round(value)}g</span>
      </div>
      <div style={{ height: 7, borderRadius: 99, background: C.border }}>
        <div style={{
          height: '100%', width: pct + '%', borderRadius: 99,
          background: color, transition: 'width .5s cubic-bezier(.4,0,.2,1)',
          boxShadow: `0 0 8px ${color}55`,
        }} />
      </div>
    </div>
  );
}

// ── CalorieRing ────────────────────────────────────────────────────────────
export function CalorieRing({ consumed, goal, C }) {
  const pct     = Math.min(100, (consumed / goal) * 100);
  const r       = 54;
  const circ    = 2 * Math.PI * r;
  const dash    = (pct / 100) * circ;
  const over    = consumed > goal;
  const color   = over ? C.red : C.accent;

  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="70" cy="70" r={r} fill="none" stroke={C.border} strokeWidth="10" />
        {/* Progress */}
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray .6s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: C.text, lineHeight: 1 }}>
          {Math.round(consumed)}
        </div>
        <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>/ {goal} kcal</div>
      </div>
    </div>
  );
}

// ── Notification Banner ────────────────────────────────────────────────────
export function NotifBanner({ notif, C }) {
  if (!notif) return null;
  const bgMap = { water: C.blue, error: C.red, success: C.green, info: C.accent };
  return (
    <div style={{
      position: 'fixed', top: 76, right: 20, zIndex: 999,
      background: bgMap[notif.type] || C.accent,
      color: '#fff', padding: '12px 20px', borderRadius: 12,
      fontWeight: 600, fontSize: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,.3)',
      maxWidth: 340, animation: 'slideIn .3s ease',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {notif.msg}
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, style, C }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: 20, ...style,
    }}>
      {children}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────
export function Input({ label, C, style, ...props }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          {label}
        </label>
      )}
      <input
        style={{
          background: C.input, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: '10px 14px', color: C.text,
          fontSize: 14, width: '100%', transition: 'border-color .2s',
        }}
        {...props}
      />
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────
export function Btn({ children, variant = 'primary', C, style, ...props }) {
  const base = {
    border: 'none', borderRadius: 10, padding: '10px 20px',
    cursor: 'pointer', fontWeight: 600, fontSize: 14,
    transition: 'all .2s', fontFamily: 'inherit', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', gap: 6,
  };
  const variants = {
    primary: { background: C.accent, color: '#fff' },
    ghost:   { background: 'transparent', color: C.text, border: `1px solid ${C.border}` },
    danger:  { background: 'transparent', color: C.red,  border: `1px solid ${C.red}` },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
}

// ── Select ─────────────────────────────────────────────────────────────────
export function Select({ label, options, C, style, ...props }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          {label}
        </label>
      )}
      <select
        style={{
          background: C.input, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: '10px 14px', color: C.text,
          fontSize: 14, width: '100%',
        }}
        {...props}
      >
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
