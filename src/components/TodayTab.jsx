import { useState } from 'react';
import { FOOD_DB, MEAL_TYPES, DAILY_GOAL_KCAL } from '../lib/foodData.js';
import { CalorieRing, MacroBar, Card, Btn, Input, Select } from './UI.jsx';

const fmt = (n) => Math.round(n);

function calcTotals(items) {
  return items.reduce(
    (acc, f) => ({ cal: acc.cal + f.cal, protein: acc.protein + f.protein, carbs: acc.carbs + f.carbs, fat: acc.fat + f.fat }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export default function TodayTab({ logs, onAddFood, onRemoveFood, C }) {
  const [addMode, setAddMode]       = useState('search'); // 'search' | 'custom'
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedFood, setSelected] = useState(null);
  const [qty, setQty]               = useState(1);
  const [meal, setMeal]             = useState('Breakfast');
  const [custom, setCustom]         = useState({ name: '', cal: '', protein: '', carbs: '', fat: '' });
  const [error, setError]           = useState('');

  const suggestions = foodSearch.length > 1
    ? FOOD_DB.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase())).slice(0, 8)
    : [];

  const totals = calcTotals(logs);

  const handleAdd = () => {
    setError('');
    if (addMode === 'search') {
      if (!selectedFood) return setError('Please select a food item.');
      onAddFood({
        name: selectedFood.name, meal,
        cal: selectedFood.cal * qty, protein: selectedFood.protein * qty,
        carbs: selectedFood.carbs * qty, fat: selectedFood.fat * qty,
        qty,
      });
      setFoodSearch(''); setSelected(null); setQty(1);
    } else {
      if (!custom.name) return setError('Food name is required.');
      if (!custom.cal || isNaN(+custom.cal)) return setError('Valid calories required.');
      onAddFood({
        name: custom.name, meal,
        cal: +custom.cal, protein: +custom.protein || 0,
        carbs: +custom.carbs || 0, fat: +custom.fat || 0, qty: 1,
      });
      setCustom({ name: '', cal: '', protein: '', carbs: '', fat: '' });
    }
  };

  const upd = (k) => (e) => setCustom({ ...custom, [k]: e.target.value });

  return (
    <div style={{ animation: 'fadeUp .3s' }}>
      {/* ── Summary row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Calorie ring */}
        <Card C={C} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <CalorieRing consumed={totals.cal} goal={DAILY_GOAL_KCAL} C={C} />
          <div style={{ fontSize: 12, color: C.sub, textAlign: 'center' }}>
            {totals.cal > DAILY_GOAL_KCAL
              ? <span style={{ color: C.red }}>⚠️ {fmt(totals.cal - DAILY_GOAL_KCAL)} kcal over goal</span>
              : <span style={{ color: C.green }}>✅ {fmt(DAILY_GOAL_KCAL - totals.cal)} kcal remaining</span>}
          </div>
        </Card>

        {/* Macros */}
        <Card C={C}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Macros Today</div>
          <MacroBar label="Protein"      value={totals.protein} max={150} color={C.accent} C={C} />
          <MacroBar label="Carbohydrates" value={totals.carbs}  max={250} color={C.orange} C={C} />
          <MacroBar label="Fat"           value={totals.fat}    max={65}  color={C.green}  C={C} />
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[['P', fmt(totals.protein), C.accent], ['C', fmt(totals.carbs), C.orange], ['F', fmt(totals.fat), C.green]].map(([l, v, co]) => (
              <div key={l} style={{ textAlign: 'center', background: C.input, borderRadius: 8, padding: '8px 4px' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: co }}>{v}g</div>
                <div style={{ fontSize: 10, color: C.sub }}>{l === 'P' ? 'Protein' : l === 'C' ? 'Carbs' : 'Fat'}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Add Food ── */}
      <Card C={C} style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 16 }}>
          Add Food Entry
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: C.input, borderRadius: 10, padding: 4 }}>
          {[['search', '🔍 Search Food'], ['custom', '✏️ Custom Entry']].map(([k, l]) => (
            <button key={k} onClick={() => { setAddMode(k); setError(''); }} style={{
              flex: 1, padding: '8px 0', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
              fontWeight: addMode === k ? 700 : 500,
              background: addMode === k ? C.accent : 'transparent',
              color: addMode === k ? '#fff' : C.sub, transition: 'all .2s',
            }}>{l}</button>
          ))}
        </div>

        {addMode === 'search' ? (
          <>
            {/* Search input */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <input
                style={{
                  background: C.input, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '10px 14px', color: C.text,
                  fontSize: 14, width: '100%',
                }}
                placeholder="Search food (e.g. apple, rice, chicken…)"
                value={foodSearch}
                onChange={e => { setFoodSearch(e.target.value); setSelected(null); }}
              />
              {suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 10, zIndex: 50, maxHeight: 240,
                  overflowY: 'auto', marginTop: 4,
                  boxShadow: '0 12px 36px rgba(0,0,0,.25)',
                }}>
                  {suggestions.map(f => (
                    <div key={f.name} onClick={() => { setSelected(f); setFoodSearch(f.name); }}
                      style={{
                        padding: '10px 14px', cursor: 'pointer',
                        borderBottom: `1px solid ${C.border}`,
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 13, transition: 'background .15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontWeight: 500 }}>{f.name}</span>
                      <span style={{ color: C.sub }}>{f.cal} kcal</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected preview */}
            {selectedFood && (
              <div style={{
                background: C.accentLight, border: `1px solid ${C.accent}44`,
                borderRadius: 10, padding: '10px 14px', marginBottom: 14,
                fontSize: 13, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 700, color: C.text }}>{selectedFood.name}</span>
                <span style={{ color: C.sub }}>P:{fmt(selectedFood.protein * qty)}g · C:{fmt(selectedFood.carbs * qty)}g · F:{fmt(selectedFood.fat * qty)}g</span>
                <span style={{ color: C.accent, fontWeight: 700, marginLeft: 'auto' }}>{fmt(selectedFood.cal * qty)} kcal</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Servings</label>
                <input type="number" min="0.5" step="0.5" value={qty} onChange={e => setQty(+e.target.value)}
                  style={{ background: C.input, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 14, width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Meal</label>
                <select value={meal} onChange={e => setMeal(e.target.value)}
                  style={{ background: C.input, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 14, width: '100%' }}>
                  {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Food Name *</label>
              <input placeholder="My custom food" value={custom.name} onChange={upd('name')}
                style={{ background: C.input, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 14, width: '100%' }} />
            </div>
            {[['cal','Calories (kcal) *'],['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([k, l]) => (
              <div key={k}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{l}</label>
                <input type="number" min="0" placeholder="0" value={custom[k]} onChange={upd(k)}
                  style={{ background: C.input, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 14, width: '100%' }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Meal</label>
              <select value={meal} onChange={e => setMeal(e.target.value)}
                style={{ background: C.input, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 14, width: '100%' }}>
                {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: `${C.red}18`, color: C.red, padding: '8px 12px', borderRadius: 8, fontSize: 13, marginTop: 12 }}>{error}</div>
        )}

        <Btn C={C} style={{ width: '100%', marginTop: 16, padding: '12px 0', fontSize: 15 }} onClick={handleAdd}>
          + Add Entry
        </Btn>
      </Card>

      {/* ── Food log grouped by meal ── */}
      {MEAL_TYPES.map(mealType => {
        const items = logs.filter(f => f.meal === mealType);
        if (!items.length) return null;
        const mt = calcTotals(items);
        return (
          <Card key={mealType} C={C} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{mealType}</div>
              <div style={{ fontSize: 13, color: C.accent, fontWeight: 700 }}>{fmt(mt.cal)} kcal</div>
            </div>
            {items.map(f => (
              <div key={f.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 0', borderBottom: `1px solid ${C.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    {f.name} {f.qty && f.qty > 1 ? <span style={{ color: C.sub }}>×{f.qty}</span> : ''}
                  </div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                    P:{fmt(f.protein)}g · C:{fmt(f.carbs)}g · F:{fmt(f.fat)}g
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontWeight: 700, color: C.accent, fontSize: 14 }}>{fmt(f.cal)}</span>
                  <button onClick={() => onRemoveFood(f.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: C.red, fontSize: 18, padding: 0, lineHeight: 1,
                    opacity: 0.7, transition: 'opacity .15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                  >×</button>
                </div>
              </div>
            ))}
          </Card>
        );
      })}

      {logs.length === 0 && (
        <Card C={C} style={{ textAlign: 'center', padding: 48, color: C.sub }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🍽️</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No entries yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Add your first meal using the form above</div>
        </Card>
      )}
    </div>
  );
}
