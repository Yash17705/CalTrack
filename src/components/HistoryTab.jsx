import { Card } from './UI.jsx';
import { DAILY_GOAL_KCAL } from '../lib/foodData.js';

const fmt = (n) => Math.round(n);

function calcTotals(items) {
  return items.reduce(
    (a, f) => ({ cal: a.cal + f.cal, protein: a.protein + f.protein, carbs: a.carbs + f.carbs, fat: a.fat + f.fat }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const last7Days = () => Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - i);
  return d.toISOString().slice(0, 10);
}).reverse();

export default function HistoryTab({ logs, C }) {
  const days = last7Days();

  const dayData = days.map(d => ({
    date: d,
    label: d === todayStr() ? 'Today' : new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    items: logs[d] || [],
    totals: calcTotals(logs[d] || []),
    isToday: d === todayStr(),
  }));

  const allCals = dayData.map(d => d.totals.cal).filter(Boolean);
  const avgCal  = allCals.length ? fmt(allCals.reduce((a, b) => a + b, 0) / allCals.length) : 0;
  const minCal  = allCals.length ? fmt(Math.min(...allCals)) : 0;
  const maxCal  = allCals.length ? fmt(Math.max(...allCals)) : 0;
  const totalItems = dayData.reduce((a, d) => a + d.items.length, 0);
  const daysOnTrack = dayData.filter(d => d.totals.cal > 0 && d.totals.cal <= DAILY_GOAL_KCAL).length;

  return (
    <div style={{ animation: 'fadeUp .3s' }}>
      <h2 style={{ fontFamily: "'Syne', sans-serif", marginTop: 0, marginBottom: 20, fontSize: 22 }}>
        7-Day Overview
      </h2>

      {/* Bar chart */}
      <Card C={C} style={{ marginBottom: 20 }}>
        {dayData.map(d => {
          const pct = Math.min(100, (d.totals.cal / DAILY_GOAL_KCAL) * 100);
          const overGoal = d.totals.cal > DAILY_GOAL_KCAL;
          return (
            <div key={d.date} style={{
              padding: '11px 0', borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 110, fontSize: 12, flexShrink: 0,
                color: d.isToday ? C.accent : C.sub,
                fontWeight: d.isToday ? 700 : 400,
              }}>
                {d.label}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ height: 9, borderRadius: 99, background: C.border, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: pct + '%',
                    background: overGoal ? C.red : d.isToday ? C.accent : C.blue,
                    borderRadius: 99, transition: 'width .6s cubic-bezier(.4,0,.2,1)',
                    boxShadow: pct > 0 ? `0 0 6px ${overGoal ? C.red : C.accent}66` : 'none',
                  }} />
                </div>
              </div>
              <div style={{ width: 80, textAlign: 'right', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                {d.totals.cal > 0 ? (
                  <>
                    <span style={{ color: overGoal ? C.red : C.text }}>{fmt(d.totals.cal)}</span>
                    <span style={{ color: C.sub, fontWeight: 400 }}> kcal</span>
                  </>
                ) : (
                  <span style={{ color: C.sub, fontWeight: 400 }}>—</span>
                )}
              </div>
              <div style={{ width: 36, fontSize: 11, color: C.sub, textAlign: 'right', flexShrink: 0 }}>
                {d.items.length > 0 ? `${d.items.length}×` : ''}
              </div>
            </div>
          );
        })}
      </Card>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          ['📊', 'Avg Calories',   avgCal ? avgCal + ' kcal' : '—'],
          ['🔽', 'Lowest Day',     minCal ? minCal + ' kcal' : '—'],
          ['🔼', 'Highest Day',    maxCal ? maxCal + ' kcal' : '—'],
          ['✅', 'Days On Track',  daysOnTrack + ' / 7'],
          ['🍽️', 'Total Entries', totalItems + ' items'],
        ].map(([icon, label, val]) => (
          <Card key={label} C={C} style={{ textAlign: 'center', padding: '18px 12px' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: C.accent }}>{val}</div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Macro breakdown by day */}
      <Card C={C}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Macro Breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
          {['Date', 'Protein', 'Carbs', 'Fat'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</div>
          ))}
        </div>
        {dayData.filter(d => d.items.length > 0).reverse().map(d => (
          <div key={d.date} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8,
            padding: '8px 0', borderBottom: `1px solid ${C.border}`, fontSize: 13,
          }}>
            <div style={{ color: d.isToday ? C.accent : C.text, fontWeight: d.isToday ? 600 : 400 }}>
              {d.isToday ? 'Today' : d.date.slice(5)}
            </div>
            <div style={{ color: C.accent }}>{fmt(d.totals.protein)}g</div>
            <div style={{ color: C.orange }}>{fmt(d.totals.carbs)}g</div>
            <div style={{ color: C.green }}>{fmt(d.totals.fat)}g</div>
          </div>
        ))}
        {dayData.every(d => d.items.length === 0) && (
          <div style={{ textAlign: 'center', padding: 24, color: C.sub }}>No data recorded yet</div>
        )}
      </Card>
    </div>
  );
}
