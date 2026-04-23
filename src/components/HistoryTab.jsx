import { Card, SectionHero } from './UI.jsx';
import { DAILY_GOAL_KCAL } from '../lib/foodData.js';
import { formatShortDate, getLastNDates, getLocalDateString } from '../lib/date.js';
import { calcTotals, roundValue } from '../lib/nutrition.js';

export default function HistoryTab({ logs, C }) {
  const today = getLocalDateString();
  const days = getLastNDates(7);

  const dayData = days.map(d => ({
    date: d,
    label: d === today ? 'Today' : formatShortDate(d),
    items: logs[d] || [],
    totals: calcTotals(logs[d] || []),
    isToday: d === today,
  }));

  const allCals = dayData.map(d => d.totals.cal).filter(Boolean);
  const avgCal  = allCals.length ? roundValue(allCals.reduce((a, b) => a + b, 0) / allCals.length) : 0;
  const minCal  = allCals.length ? roundValue(Math.min(...allCals)) : 0;
  const maxCal  = allCals.length ? roundValue(Math.max(...allCals)) : 0;
  const totalItems = dayData.reduce((a, d) => a + d.items.length, 0);
  const daysOnTrack = dayData.filter(d => d.totals.cal > 0 && d.totals.cal <= DAILY_GOAL_KCAL).length;

  return (
    <div className="page-stack" style={{ animation: 'fadeUp .3s' }}>
      <SectionHero
        eyebrow="History"
        title="Review the last seven days without the clutter."
        subtitle="Use the weekly trend to catch under-eating, over-shooting your target, or inconsistent logging before it becomes a habit."
        C={C}
      >
        {[
          ['On track', `${daysOnTrack}/7`],
          ['Entries', `${totalItems}`],
          ['Average', avgCal ? `${avgCal} kcal` : 'No data'],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              padding: '12px 14px',
              borderRadius: 18,
              background: C.input,
              border: `1px solid ${C.border}`,
              minWidth: 118,
            }}
          >
            <div style={{ color: C.sub, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 14, marginTop: 6 }}>{value}</div>
          </div>
        ))}
      </SectionHero>

      {/* Bar chart */}
      <Card C={C} style={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>7-Day Calorie Trend</div>
          <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>Today stays pinned to the top of the week so comparisons are easy.</div>
        </div>
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
                    <span style={{ color: overGoal ? C.red : C.text }}>{roundValue(d.totals.cal)}</span>
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
      <div className="stats-grid">
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
      <Card C={C} style={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Macro Breakdown</div>
          <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>Recent days with logged meals and their protein, carbs, and fat totals.</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 420 }}>
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
                <div style={{ color: C.accent }}>{roundValue(d.totals.protein)}g</div>
                <div style={{ color: C.orange }}>{roundValue(d.totals.carbs)}g</div>
                <div style={{ color: C.green }}>{roundValue(d.totals.fat)}g</div>
              </div>
            ))}
            {dayData.every(d => d.items.length === 0) && (
              <div style={{ textAlign: 'center', padding: 24, color: C.sub }}>No data recorded yet</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
