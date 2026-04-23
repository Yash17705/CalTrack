import { useState } from 'react';
import { Card, Btn } from './UI.jsx';

export default function WaterTab({ water, onSave, C }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ qty: water.qty, intervalMin: water.intervalMin });

  const handleSave = () => {
    const qty = parseInt(form.qty, 10);
    const intervalMin = parseInt(form.intervalMin, 10);
    if (isNaN(qty) || qty < 50 || qty > 2000) return;
    if (isNaN(intervalMin) || intervalMin < 5 || intervalMin > 480) return;
    onSave({ qty, intervalMin });
    setEditing(false);
  };

  // Visual: how many reminders per day
  const remindersPerDay = Math.floor((16 * 60) / water.intervalMin); // assume 16hr awake
  const totalPerDay     = remindersPerDay * water.qty;

  return (
    <div style={{ animation: 'fadeUp .3s' }}>
      {/* Hero card */}
      <Card C={C} style={{ textAlign: 'center', padding: '40px 32px', marginBottom: 20 }}>
        <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>💧</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", margin: '0 0 10px', fontSize: 24 }}>
          Water Intake Tracker
        </h2>
        <p style={{ color: C.sub, margin: '0 0 28px', lineHeight: 1.6 }}>
          You'll be reminded every{' '}
          <strong style={{ color: C.text }}>{water.intervalMin} minutes</strong> to drink{' '}
          <strong style={{ color: C.text }}>{water.qty}ml</strong> of water.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            ['💧', water.qty + 'ml', 'Per reminder'],
            ['⏱️', water.intervalMin + ' min', 'Interval'],
            ['🔔', remindersPerDay + 'x', 'Reminders/day'],
            ['🏆', (totalPerDay / 1000).toFixed(1) + 'L', 'Daily intake'],
          ].map(([icon, val, label]) => (
            <div key={label} style={{
              background: C.input, borderRadius: 14, padding: '16px 24px',
              minWidth: 110,
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.blue, fontFamily: "'Syne', sans-serif" }}>{val}</div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <Btn C={C} style={{ padding: '12px 28px', fontSize: 15 }} onClick={() => setEditing(!editing)}>
          ⚙️ {editing ? 'Cancel Edit' : 'Edit Settings'}
        </Btn>
      </Card>

      {/* Edit panel */}
      {editing && (
        <Card C={C} style={{ marginBottom: 20, border: `1px solid ${C.accent}44` }}>
          <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 16, fontFamily: "'Syne', sans-serif" }}>
            Water Reminder Settings
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Quantity per reminder (ml)
              </label>
              <input type="number" min="50" max="2000" step="50" value={form.qty}
                onChange={e => setForm({ ...form, qty: e.target.value })}
                style={{ background: C.input, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 14, width: '100%' }} />
              <p style={{ fontSize: 11, color: C.sub, marginTop: 5 }}>50ml – 2000ml per reminder</p>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Remind every (minutes)
              </label>
              <input type="number" min="5" max="480" step="5" value={form.intervalMin}
                onChange={e => setForm({ ...form, intervalMin: e.target.value })}
                style={{ background: C.input, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 14, width: '100%' }} />
              <p style={{ fontSize: 11, color: C.sub, marginTop: 5 }}>5 min – 8 hours interval</p>
            </div>
          </div>

          {/* Preview */}
          <div style={{ background: C.blueLight, border: `1px solid ${C.blue}33`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: C.sub }}>
            Preview: ~{Math.floor((16 * 60) / (+form.intervalMin || 1))} reminders/day · {(Math.floor((16 * 60) / (+form.intervalMin || 1)) * +form.qty / 1000).toFixed(1)}L total
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Btn C={C} variant="ghost" style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</Btn>
            <Btn C={C} style={{ flex: 1 }} onClick={handleSave}>Save Settings</Btn>
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card C={C} style={{ background: C.blueLight, border: `1px solid ${C.blue}33` }}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15, color: C.blue }}>💡 Hydration Tips</div>
        <ul style={{ margin: 0, paddingLeft: 20, color: C.sub, fontSize: 13, lineHeight: 2 }}>
          <li>Aim for at least 2L (8 glasses) of water daily</li>
          <li>Drink a glass of water before every meal</li>
          <li>Start your morning with a large glass of water</li>
          <li>Herbal teas and infused water count toward your intake</li>
          <li>Increase intake on hot days, during illness, or after exercise</li>
          <li>Mild headache? Try drinking water first</li>
        </ul>
      </Card>

      {/* Timeline */}
      <Card C={C} style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Today's Reminder Schedule</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: Math.min(remindersPerDay, 16) }, (_, i) => {
            const startHour = 7; // assume start at 7am
            const totalMins = startHour * 60 + i * water.intervalMin;
            const h = Math.floor(totalMins / 60) % 24;
            const m = totalMins % 60;
            const label = `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
            const past = new Date().getHours() * 60 + new Date().getMinutes() > totalMins;
            return (
              <div key={i} style={{
                background: past ? C.green + '22' : C.input,
                border: `1px solid ${past ? C.green + '55' : C.border}`,
                borderRadius: 8, padding: '6px 12px', fontSize: 12,
                color: past ? C.green : C.sub, fontWeight: past ? 600 : 400,
              }}>
                {past ? '✓ ' : ''}{label}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
