export function calcTotals(items = []) {
  return items.reduce(
    (totals, item) => ({
      cal: totals.cal + (Number(item?.cal) || 0),
      protein: totals.protein + (Number(item?.protein) || 0),
      carbs: totals.carbs + (Number(item?.carbs) || 0),
      fat: totals.fat + (Number(item?.fat) || 0),
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function roundValue(value) {
  return Math.round(Number(value) || 0);
}
