import { Card, Btn, SectionHero } from './UI.jsx';
import { DB } from '../lib/db.js';
import { DAILY_GOAL_KCAL } from '../lib/foodData.js';
import { getLastNDates, getLocalDateString } from '../lib/date.js';
import { calcTotals, roundValue } from '../lib/nutrition.js';

export default function ProfileTab({ currentUser, userData, onLogout, C }) {
  const user = DB.getUser(currentUser);
  const userName = user?.name || currentUser;

  const allEntries   = Object.values(userData.logs).flat();
  const daysTracked  = Object.keys(userData.logs).filter(d => userData.logs[d].length > 0).length;
  const todayTotals  = calcTotals(userData.logs[getLocalDateString()] || []);

  const last7 = getLastNDates(7).reverse();
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
    return vals.length ? roundValue(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  })();

  return (
    <div className="page-stack" style={{ animation: 'fadeUp .3s' }}>
      <SectionHero
        eyebrow="Profile"
        title="Your personal tracking snapshot."
        subtitle="This page keeps the account details lightweight and focuses on the habits that matter: consistency, calorie trends, and reminder settings."
        C={C}
      >
        {[
          ['Streak', streak > 0 ? `${streak} days` : 'Start today'],
          ['Tracked days', `${daysTracked}`],
          ['7-day avg', avgCal ? `${avgCal} kcal` : 'No data'],
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

      {/* Avatar card */}
      <Card C={C} style={{ textAlign: 'center', padding: '36px 24px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.accent}, ${C.orange})`,
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
      <div className="stats-grid">
        {[
          ['🍽️', 'Total Entries',      allEntries.length,                      ''],
          ['📅', 'Days Tracked',        daysTracked,                            'days'],
          ['🔥', "Today's Calories",    roundValue(todayTotals.cal),            'kcal'],
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
      <Card C={C} style={{ padding: 24 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Daily Calorie Goal</div>
          <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>A quick comparison between today’s intake and your default target.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: C.sub }}>
          <span>{roundValue(todayTotals.cal)} consumed</span>
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
            ? `⚠️ ${roundValue(todayTotals.cal - DAILY_GOAL_KCAL)} kcal over goal`
            : `✅ ${roundValue(DAILY_GOAL_KCAL - todayTotals.cal)} kcal remaining for today`}
        </div>
      </Card>

      {/* App info */}
      <Card C={C} style={{ fontSize: 13, color: C.sub, padding: 24 }}>
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
