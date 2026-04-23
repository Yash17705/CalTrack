import { useId } from 'react';

// ── MacroBar ───────────────────────────────────────────────────────────────
export function MacroBar({ label, value, max, color, C }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
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
    <div style={{ position: 'relative', width: 148, height: 148, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        position: 'absolute',
        inset: 14,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.accentLight}, transparent 72%)`,
        filter: 'blur(8px)',
      }} />
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
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
      position: 'fixed', top: 28, right: 20, zIndex: 999,
      background: C.cardHover,
      border: `1px solid ${C.border}`,
      padding: '12px 20px', borderRadius: 12,
      fontWeight: 600, fontSize: 14,
      boxShadow: C.shadowSoft,
      maxWidth: 340, animation: 'slideIn .3s ease',
      display: 'flex', alignItems: 'center', gap: 8,
      backdropFilter: 'blur(18px)',
      color: C.text,
    }} role="status" aria-live="polite">
      <span style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: bgMap[notif.type] || C.accent,
        boxShadow: `0 0 14px ${bgMap[notif.type] || C.accent}`,
        flexShrink: 0,
      }} />
      <span>{notif.msg}</span>
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, style, C }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 24,
      padding: 20,
      boxShadow: C.shadowSoft,
      backdropFilter: 'blur(18px)',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function SectionHero({ eyebrow, title, subtitle, children, C, style }) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 28,
        border: `1px solid ${C.border}`,
        background: `linear-gradient(135deg, ${C.cardHover}, ${C.card})`,
        boxShadow: C.shadow,
        padding: 24,
        ...style,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at top right, ${C.accentLight}, transparent 34%), radial-gradient(circle at bottom left, ${C.blueLight}, transparent 32%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 18,
        flexWrap: 'wrap',
      }}>
        <div style={{ maxWidth: 560 }}>
          {eyebrow && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '7px 12px',
              borderRadius: 999,
              background: C.accentLight,
              color: C.accent,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}>
              {eyebrow}
            </div>
          )}
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 30,
            lineHeight: 1.05,
            letterSpacing: -1.2,
            margin: 0,
            color: C.text,
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{
              margin: '12px 0 0',
              color: C.sub,
              fontSize: 14,
              lineHeight: 1.6,
              maxWidth: 620,
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────
export function Input({ label, C, style, ...props }) {
  const generatedId = useId();
  const inputId = props.id || generatedId;

  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.6 }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          background: C.input,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: '12px 14px',
          color: C.text,
          fontSize: 14,
          width: '100%',
          transition: 'border-color .2s, box-shadow .2s, background .2s',
          boxShadow: `inset 0 1px 0 ${C.cardHover}`,
        }}
        {...props}
      />
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────
export function Btn({ children, variant = 'primary', type = 'button', C, style, ...props }) {
  const base = {
    border: 'none', borderRadius: 14, padding: '11px 20px',
    cursor: 'pointer', fontWeight: 600, fontSize: 14,
    transition: 'all .2s', fontFamily: 'inherit', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', gap: 6,
    minHeight: 46,
  };
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${C.accent}, ${C.accentStrong})`,
      color: '#fff',
      boxShadow: `0 14px 28px ${C.accentGlow}`,
    },
    ghost: {
      background: C.input,
      color: C.text,
      border: `1px solid ${C.border}`,
    },
    danger: {
      background: `${C.red}12`,
      color: C.red,
      border: `1px solid ${C.red}44`,
    },
  };
  return (
    <button type={type} style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
}

// ── Select ─────────────────────────────────────────────────────────────────
export function Select({ label, options, C, style, ...props }) {
  const generatedId = useId();
  const selectId = props.id || generatedId;

  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{ fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.6 }}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        style={{
          background: C.input,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: '12px 14px',
          color: C.text,
          fontSize: 14,
          width: '100%',
          boxShadow: `inset 0 1px 0 ${C.cardHover}`,
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
