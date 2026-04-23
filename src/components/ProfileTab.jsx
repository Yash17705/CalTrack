import { Card, Btn } from './UI.jsx';
import { DB } from '../lib/db.js';
import { DAILY_GOAL_KCAL } from '../lib/foodData.js';

const fmt = (n) => Math.round(n);
const todayStr = () => new Date().toISOString().slice(0, 10);

function calcTotals(items) {
  return items.reduce(
    (a, f) => ({ cal: a.cal + f.cal, protein: a.protein + f.protein, carbs: a.carbs + f.carbs, fat: a.fat + f.fat }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export default function ProfileTab({ currentUser, userData, onLogout, C }) {
  const user = DB.getUser(currentUser);
  const userName = user?.name || currentUser;

  const allEntries   = Object.values(userData.logs).flat();
  const daysTracked  = Object.keys(userData.logs).filter(d => userData.logs[d].length > 0).length;
  const todayTotals  = calcTotals(userData.logs[todayStr()] || []);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
  const streak = (() => {
    let s = 0;
    for (const d of last7) {
      if ((userData.logs[d] || []).length > 0) s++;
      else break;
    }
    return s;
  })();

  const avgCal = (() => {
    const vals = last7.map(d => calcTotals(userData.logs[d] || []).cal).filter(Boolean);
    return vals.length ? fmt(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  })();

  return (
    <div style={{ animation: 'fadeUp .3s' }}>
      {/* Avatar card */}
      <Card C={C} style={{ textAlign: 'center', padding: '36px 24px', marginBottom: 16 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.accent}, #9f6cff)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 32,
          margin: '0 auto 16px',
          boxShadow: `0 0 0 4px ${C.accentLight}`,
        }}>
          {userName[0]?.toUpperCase()}
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", margin: '0 0 6px', fontSize: 22 }}>{userName}</h2>
        <p style={{ color: C.sub, margin: '0 0 6px', fontSize: 13 }}>{currentUser}</p>
        {streak > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${C.orange}22`, borderRadius: 99, padding: '4px 14px', fontSize: 13, color: C.orange, fontWeight: 600 }}>
            🔥 {streak}-day logging streak
          </div>
        )}
      </Card>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          ['🍽️', 'Total Entries',      allEntries.length,                      ''],
          ['📅', 'Days Tracked',        daysTracked,                            'days'],
          ['🔥', "Today's Calories",    fmt(todayTotals.cal),                   'kcal'],
          ['📊', '7-Day Avg',           avgCal,                                 'kcal/day'],
          ['💧', 'Water Interval',      userData.water.intervalMin,              'min'],
          ['💦', 'Per Reminder',        userData.water.qty,                     'ml'],
        ].map(([icon, label, val, unit]) => (
          <Card key={label} C={C} style={{ padding: '18px 16px' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: C.accent }}>
              {val}<span style={{ fontSize: 13, color: C.sub, fontWeight: 400, marginLeft: 4 }}>{unit}</span>
            </div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Daily goal progress */}
      <Card C={C} style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Daily Calorie Goal</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: C.sub }}>
          <span>{fmt(todayTotals.cal)} consumed</span>
          <span>{DAILY_GOAL_KCAL} goal</span>
        </div>
        <div style={{ height: 10, borderRadius: 99, background: C.border }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: Math.min(100, (todayTotals.cal / DAILY_GOAL_KCAL) * 100) + '%',
            background: todayTotals.cal > DAILY_GOAL_KCAL ? C.red : C.accent,
            transition: 'width .5s',
          }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: C.sub }}>
          {todayTotals.cal > DAILY_GOAL_KCAL
            ? `⚠️ ${fmt(todayTotals.cal - DAILY_GOAL_KCAL)} kcal over goal`
            : `✅ ${fmt(DAILY_GOAL_KCAL - todayTotals.cal)} kcal remaining for today`}
        </div>
      </Card>

      {/* App info */}
      <Card C={C} style={{ marginBottom: 16, fontSize: 13, color: C.sub }}>
        <div style={{ fontWeight: 700, color: C.text, marginBottom: 10 }}>About CalTrack</div>
        <p style={{ margin: '0 0 6px' }}>⚡ Version 1.0 · All data stored locally in your browser</p>
        <p style={{ margin: '0 0 6px' }}>🔒 No server, no cloud, completely private</p>
        <p style={{ margin: 0 }}>🍽️ 70+ foods · Water reminders · 7-day history</p>
      </Card>

      <Btn C={C} variant="danger" style={{ width: '100%', padding: '13px 0', fontSize: 15 }} onClick={onLogout}>
        Sign Out
      </Btn>
    </div>
  );
}
