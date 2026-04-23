import { useEffect, useState } from 'react';
import { formatTimeFromMinutes, getMinutesSinceMidnight } from '../lib/date.js';
import { Card, Btn, Input, SectionHero } from './UI.jsx';

const MIN_QTY = 50;
const MAX_QTY = 2000;
const MIN_INTERVAL = 5;
const MAX_INTERVAL = 480;
const AWAKE_MINUTES = 16 * 60;
const START_HOUR = 7;

export default function WaterTab({ water, onSave, C }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ qty: String(water.qty), intervalMin: String(water.intervalMin) });
  const [error, setError]     = useState('');

  useEffect(() => {
    setForm({ qty: String(water.qty), intervalMin: String(water.intervalMin) });
    setError('');
  }, [water.intervalMin, water.qty]);

  const parsedQty = Number.parseInt(form.qty, 10);
  const parsedInterval = Number.parseInt(form.intervalMin, 10);
  const previewReady = Number.isFinite(parsedQty) && Number.isFinite(parsedInterval) && parsedInterval > 0;

  const handleSave = () => {
    if (!Number.isFinite(parsedQty) || parsedQty < MIN_QTY || parsedQty > MAX_QTY) {
      return setError(`Quantity must be between ${MIN_QTY}ml and ${MAX_QTY}ml.`);
    }

    if (!Number.isFinite(parsedInterval) || parsedInterval < MIN_INTERVAL || parsedInterval > MAX_INTERVAL) {
      return setError(`Reminder interval must be between ${MIN_INTERVAL} and ${MAX_INTERVAL} minutes.`);
    }

    setError('');
    onSave({ qty: parsedQty, intervalMin: parsedInterval });
    setEditing(false);
  };

  // Visual: how many reminders per day
  const remindersPerDay = Math.floor(AWAKE_MINUTES / water.intervalMin); // assume 16hr awake
  const totalPerDay     = remindersPerDay * water.qty;
  const previewRemindersPerDay = previewReady ? Math.floor(AWAKE_MINUTES / parsedInterval) : 0;
  const previewTotalPerDay = previewRemindersPerDay * (previewReady ? parsedQty : 0);
  const minutesNow = getMinutesSinceMidnight();

  return (
    <div className="page-stack" style={{ animation: 'fadeUp .3s' }}>
      <SectionHero
        eyebrow="Hydration"
        title="Build a rhythm that keeps water intake consistent."
        subtitle={`CalTrack will remind you every ${water.intervalMin} minutes to drink ${water.qty}ml while this tab stays open.`}
        C={C}
      >
        <Btn
          C={C}
          style={{ padding: '12px 18px', fontSize: 14 }}
          onClick={() => {
            if (editing) {
              setForm({ qty: String(water.qty), intervalMin: String(water.intervalMin) });
              setError('');
            }
            setEditing(!editing);
          }}
        >
          ⚙️ {editing ? 'Cancel Edit' : 'Edit Settings'}
        </Btn>
      </SectionHero>

      <div className="stats-grid">
        {[
          ['💧', water.qty + 'ml', 'Per reminder'],
          ['⏱️', water.intervalMin + ' min', 'Interval'],
          ['🔔', remindersPerDay + 'x', 'Reminders/day'],
          ['🏆', (totalPerDay / 1000).toFixed(1) + 'L', 'Daily intake'],
        ].map(([icon, val, label]) => (
          <Card key={label} C={C} style={{ padding: '18px 16px' }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.blue, fontFamily: "'Syne', sans-serif" }}>{val}</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 6 }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Edit panel */}
      {editing && (
        <Card C={C} style={{ border: `1px solid ${C.accent}44`, padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 18, fontFamily: "'Syne', sans-serif" }}>
            Water Reminder Settings
            </div>
            <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>
              Adjust the interval and amount. Preview updates before you save.
            </div>
          </div>

          <div className="form-grid-2" style={{ marginBottom: 20 }}>
            <div>
              <Input
                label="Quantity per reminder (ml)"
                C={C}
                type="number"
                min={MIN_QTY}
                max={MAX_QTY}
                step="50"
                value={form.qty}
                onChange={(event) => {
                  setError('');
                  setForm((current) => ({ ...current, qty: event.target.value }));
                }}
                style={{ marginBottom: 0 }}
              />
              <p style={{ fontSize: 11, color: C.sub, marginTop: 5 }}>{MIN_QTY}ml – {MAX_QTY}ml per reminder</p>
            </div>
            <div>
              <Input
                label="Remind every (minutes)"
                C={C}
                type="number"
                min={MIN_INTERVAL}
                max={MAX_INTERVAL}
                step="5"
                value={form.intervalMin}
                onChange={(event) => {
                  setError('');
                  setForm((current) => ({ ...current, intervalMin: event.target.value }));
                }}
                style={{ marginBottom: 0 }}
              />
              <p style={{ fontSize: 11, color: C.sub, marginTop: 5 }}>{MIN_INTERVAL} min – 8 hours interval</p>
            </div>
          </div>

          {/* Preview */}
          <div style={{ background: C.blueLight, border: `1px solid ${C.blue}33`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: C.sub }}>
            {previewReady
              ? `Preview: ~${previewRemindersPerDay} reminders/day · ${(previewTotalPerDay / 1000).toFixed(1)}L total`
              : 'Enter valid values to preview your daily schedule.'}
          </div>

          {error && (
            <div style={{ background: `${C.red}18`, color: C.red, padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <Btn
              C={C}
              variant="ghost"
              style={{ flex: 1 }}
              onClick={() => {
                setForm({ qty: String(water.qty), intervalMin: String(water.intervalMin) });
                setError('');
                setEditing(false);
              }}
            >
              Cancel
            </Btn>
            <Btn C={C} style={{ flex: 1 }} onClick={handleSave}>Save Settings</Btn>
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card C={C} style={{ background: C.blueLight, border: `1px solid ${C.blue}33`, padding: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16, color: C.blue }}>💡 Hydration Tips</div>
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
      <Card C={C} style={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Today's Reminder Schedule</div>
          <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>A simple timeline based on a 7:00 AM start and your current interval.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: Math.min(remindersPerDay, 16) }, (_, i) => {
            const totalMins = START_HOUR * 60 + i * water.intervalMin;
            const label = formatTimeFromMinutes(totalMins);
            const past = minutesNow > totalMins;
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
