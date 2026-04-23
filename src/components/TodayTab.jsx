import { useState } from 'react';
import { FOOD_DB, MEAL_TYPES, DAILY_GOAL_KCAL } from '../lib/foodData.js';
import { calcTotals, roundValue } from '../lib/nutrition.js';
import { CalorieRing, MacroBar, Card, Btn, Input, Select, SectionHero } from './UI.jsx';

const parseOptionalNumber = (value, label) => {
  if (value === '') return 0;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} must be 0 or greater.`);
  }

  return parsed;
};

export default function TodayTab({ logs, onAddFood, onRemoveFood, C }) {
  const [addMode, setAddMode]       = useState('search'); // 'search' | 'custom'
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedFood, setSelected] = useState(null);
  const [qty, setQty]               = useState('1');
  const [meal, setMeal]             = useState('Breakfast');
  const [custom, setCustom]         = useState({ name: '', cal: '', protein: '', carbs: '', fat: '' });
  const [error, setError]           = useState('');

  const searchTerm = foodSearch.trim().toLowerCase();
  const servings = Number.parseFloat(qty);
  const suggestions = searchTerm.length > 1
    ? FOOD_DB.filter((food) => food.name.toLowerCase().includes(searchTerm)).slice(0, 8)
    : [];

  const totals = calcTotals(logs);
  const remainingCalories = DAILY_GOAL_KCAL - totals.cal;

  const handleAdd = () => {
    setError('');

    if (addMode === 'search') {
      if (!selectedFood) return setError('Please select a food item.');

      if (!Number.isFinite(servings) || servings <= 0) {
        return setError('Enter a valid serving amount.');
      }

      onAddFood({
        name: selectedFood.name, meal,
        cal: selectedFood.cal * servings, protein: selectedFood.protein * servings,
        carbs: selectedFood.carbs * servings, fat: selectedFood.fat * servings,
        qty: servings,
      });

      setFoodSearch('');
      setSelected(null);
      setQty('1');
      return;
    } else {
      try {
        if (!custom.name.trim()) throw new Error('Food name is required.');
        if (custom.cal === '') throw new Error('Calories are required.');

        onAddFood({
          name: custom.name.trim(),
          meal,
          cal: parseOptionalNumber(custom.cal, 'Calories'),
          protein: parseOptionalNumber(custom.protein, 'Protein'),
          carbs: parseOptionalNumber(custom.carbs, 'Carbs'),
          fat: parseOptionalNumber(custom.fat, 'Fat'),
          qty: 1,
        });

        setCustom({ name: '', cal: '', protein: '', carbs: '', fat: '' });
        return;
      } catch (err) {
        return setError(err.message);
      }
    }
  };

  const upd = (key) => (event) => {
    setError('');
    setCustom((current) => ({ ...current, [key]: event.target.value }));
  };

  return (
    <div className="page-stack" style={{ animation: 'fadeUp .3s' }}>
      <SectionHero
        eyebrow="Today"
        title="Stay on top of what you actually ate."
        subtitle={
          logs.length > 0
            ? `You have ${logs.length} ${logs.length === 1 ? 'entry' : 'entries'} logged today. Keep an eye on calories and macros before the day gets away from you.`
            : 'Start with breakfast, lunch, dinner, or a quick snack. Your calorie ring and macro totals update immediately.'
        }
        C={C}
      >
        {[
          ['Goal', `${DAILY_GOAL_KCAL} kcal`],
          ['Logged', `${logs.length} items`],
          ['Status', remainingCalories >= 0 ? `${roundValue(remainingCalories)} left` : `${roundValue(Math.abs(remainingCalories))} over`],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              padding: '12px 14px',
              borderRadius: 18,
              background: C.input,
              border: `1px solid ${C.border}`,
              minWidth: 112,
            }}
          >
            <div style={{ color: C.sub, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 14, marginTop: 6 }}>{value}</div>
          </div>
        ))}
      </SectionHero>

      {/* ── Summary row ── */}
      <div className="responsive-grid-2">
        {/* Calorie ring */}
        <Card C={C} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 24 }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Calorie Target</div>
              <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>A quick read on your day so far.</div>
            </div>
            <div style={{
              padding: '8px 10px',
              borderRadius: 999,
              background: remainingCalories >= 0 ? `${C.green}16` : `${C.red}16`,
              color: remainingCalories >= 0 ? C.green : C.red,
              fontSize: 12,
              fontWeight: 700,
            }}>
              {remainingCalories >= 0 ? 'On pace' : 'Over goal'}
            </div>
          </div>
          <CalorieRing consumed={totals.cal} goal={DAILY_GOAL_KCAL} C={C} />
          <div style={{ fontSize: 12, color: C.sub, textAlign: 'center' }}>
            {totals.cal > DAILY_GOAL_KCAL
              ? <span style={{ color: C.red }}>⚠️ {roundValue(totals.cal - DAILY_GOAL_KCAL)} kcal over goal</span>
              : <span style={{ color: C.green }}>✅ {roundValue(DAILY_GOAL_KCAL - totals.cal)} kcal remaining</span>}
          </div>
        </Card>

        {/* Macros */}
        <Card C={C} style={{ padding: 24 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Macros Today</div>
            <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>Protein, carbs, and fat split at a glance.</div>
          </div>
          <MacroBar label="Protein"      value={totals.protein} max={150} color={C.accent} C={C} />
          <MacroBar label="Carbohydrates" value={totals.carbs}  max={250} color={C.orange} C={C} />
          <MacroBar label="Fat"           value={totals.fat}    max={65}  color={C.green}  C={C} />
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[['P', roundValue(totals.protein), C.accent], ['C', roundValue(totals.carbs), C.orange], ['F', roundValue(totals.fat), C.green]].map(([l, v, co]) => (
              <div key={l} style={{ textAlign: 'center', background: C.input, borderRadius: 16, padding: '10px 6px', border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: co }}>{v}g</div>
                <div style={{ fontSize: 10, color: C.sub }}>{l === 'P' ? 'Protein' : l === 'C' ? 'Carbs' : 'Fat'}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Add Food ── */}
      <Card C={C} style={{ padding: 24 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: -0.8 }}>
          Add Food Entry
          </div>
          <div style={{ color: C.sub, fontSize: 13, marginTop: 6 }}>
            Search the built-in catalog or add a custom item manually.
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18, background: C.input, borderRadius: 18, padding: 5, border: `1px solid ${C.border}` }}>
          {[['search', '🔍 Search Food'], ['custom', '✏️ Custom Entry']].map(([k, l]) => (
            <button key={k} type="button" onClick={() => { setAddMode(k); setError(''); }} style={{
              flex: 1, padding: '11px 0', border: 'none', borderRadius: 14,
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
              fontWeight: addMode === k ? 700 : 500,
              background: addMode === k ? `linear-gradient(135deg, ${C.accent}, ${C.accentStrong})` : 'transparent',
              color: addMode === k ? '#fff' : C.sub, transition: 'all .2s',
              boxShadow: addMode === k ? `0 14px 28px ${C.accentGlow}` : 'none',
            }}>{l}</button>
          ))}
        </div>

        {addMode === 'search' ? (
          <>
            {/* Search input */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <input
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
                placeholder="Search food (e.g. apple, rice, chicken…)"
                value={foodSearch}
                onChange={(event) => {
                  setError('');
                  setFoodSearch(event.target.value);
                  setSelected(null);
                }}
              />
              {suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 16, zIndex: 50, maxHeight: 240,
                  overflowY: 'auto', marginTop: 4,
                  boxShadow: C.shadowSoft,
                  backdropFilter: 'blur(18px)',
                }}>
                  {suggestions.map(f => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => { setSelected(f); setFoodSearch(f.name); setError(''); }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        cursor: 'pointer',
                        border: 'none',
                        borderBottom: `1px solid ${C.border}`,
                        background: 'transparent',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        transition: 'background .15s',
                        color: C.text,
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontWeight: 500 }}>{f.name}</span>
                      <span style={{ color: C.sub }}>{f.cal} kcal</span>
                    </button>
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
                <span style={{ color: C.sub }}>
                  P:{roundValue(selectedFood.protein * (Number.isFinite(servings) ? servings : 0))}g ·
                  {' '}C:{roundValue(selectedFood.carbs * (Number.isFinite(servings) ? servings : 0))}g ·
                  {' '}F:{roundValue(selectedFood.fat * (Number.isFinite(servings) ? servings : 0))}g
                </span>
                <span style={{ color: C.accent, fontWeight: 700, marginLeft: 'auto' }}>
                  {roundValue(selectedFood.cal * (Number.isFinite(servings) ? servings : 0))} kcal
                </span>
              </div>
            )}

            <div className="form-grid-2">
              <Input
                label="Servings"
                C={C}
                type="number"
                min="0.5"
                step="0.5"
                value={qty}
                onChange={(event) => {
                  setError('');
                  setQty(event.target.value);
                }}
              />
              <Select label="Meal" C={C} options={MEAL_TYPES} value={meal} onChange={(event) => setMeal(event.target.value)} />
            </div>
          </>
        ) : (
          <div className="form-grid-2">
            <Input
              label="Food Name *"
              C={C}
              style={{ gridColumn: 'span 2' }}
              placeholder="My custom food"
              value={custom.name}
              onChange={upd('name')}
            />
            {[['cal','Calories (kcal) *'],['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([k, l]) => (
              <Input
                key={k}
                label={l}
                C={C}
                type="number"
                min="0"
                placeholder="0"
                value={custom[k]}
                onChange={upd(k)}
              />
            ))}
            <Select label="Meal" C={C} options={MEAL_TYPES} value={meal} onChange={(event) => setMeal(event.target.value)} />
          </div>
        )}

        {error && (
          <div style={{ background: `${C.red}18`, color: C.red, padding: '10px 12px', borderRadius: 14, fontSize: 13, marginTop: 12, border: `1px solid ${C.red}33` }}>{error}</div>
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
          <Card key={mealType} C={C}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{mealType}</div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>{items.length} {items.length === 1 ? 'entry' : 'entries'} logged</div>
              </div>
              <div style={{
                fontSize: 13,
                color: C.accent,
                fontWeight: 700,
                padding: '8px 10px',
                borderRadius: 999,
                background: C.accentLight,
              }}>
                {roundValue(mt.cal)} kcal
              </div>
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
                    P:{roundValue(f.protein)}g · C:{roundValue(f.carbs)}g · F:{roundValue(f.fat)}g
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontWeight: 700, color: C.accent, fontSize: 14 }}>{roundValue(f.cal)}</span>
                  <button type="button" aria-label={`Remove ${f.name}`} onClick={() => onRemoveFood(f.id)} style={{
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
