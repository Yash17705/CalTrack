/**
 * Static nutrition database
 * Each entry: { name, cal, protein (g), carbs (g), fat (g) }
 * Values are per standard serving unless noted in the name.
 */
export const FOOD_DB = [
  // Fruits
  { name: 'Apple',                    cal: 95,  protein: 0.5, carbs: 25,  fat: 0.3 },
  { name: 'Banana',                   cal: 105, protein: 1.3, carbs: 27,  fat: 0.4 },
  { name: 'Orange',                   cal: 62,  protein: 1.2, carbs: 15,  fat: 0.2 },
  { name: 'Grapes (100g)',            cal: 69,  protein: 0.7, carbs: 18,  fat: 0.2 },
  { name: 'Mango (100g)',             cal: 60,  protein: 0.8, carbs: 15,  fat: 0.4 },
  { name: 'Strawberries (100g)',      cal: 32,  protein: 0.7, carbs: 7.7, fat: 0.3 },
  { name: 'Blueberries (100g)',       cal: 57,  protein: 0.7, carbs: 14,  fat: 0.3 },
  { name: 'Watermelon (100g)',        cal: 30,  protein: 0.6, carbs: 7.6, fat: 0.2 },
  { name: 'Pineapple (100g)',         cal: 50,  protein: 0.5, carbs: 13,  fat: 0.1 },
  { name: 'Avocado (half)',           cal: 120, protein: 1.5, carbs: 6,   fat: 11  },

  // Vegetables
  { name: 'Broccoli (100g)',          cal: 34,  protein: 2.8, carbs: 7,   fat: 0.4 },
  { name: 'Spinach (100g)',           cal: 23,  protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: 'Carrot (medium)',          cal: 25,  protein: 0.6, carbs: 6,   fat: 0.1 },
  { name: 'Tomato (medium)',          cal: 22,  protein: 1.1, carbs: 4.8, fat: 0.2 },
  { name: 'Cucumber (100g)',          cal: 15,  protein: 0.7, carbs: 3.6, fat: 0.1 },
  { name: 'Bell Pepper (medium)',     cal: 31,  protein: 1,   carbs: 7,   fat: 0.3 },
  { name: 'Potato (medium)',          cal: 163, protein: 4.3, carbs: 37,  fat: 0.2 },
  { name: 'Sweet Potato (medium)',    cal: 103, protein: 2.3, carbs: 24,  fat: 0.1 },
  { name: 'Onion (medium)',           cal: 44,  protein: 1.2, carbs: 10,  fat: 0.1 },
  { name: 'Corn (100g)',              cal: 96,  protein: 3.4, carbs: 21,  fat: 1.5 },

  // Grains & Bread
  { name: 'White Rice (100g cooked)',       cal: 130, protein: 2.7, carbs: 28,  fat: 0.3 },
  { name: 'Brown Rice (100g cooked)',       cal: 123, protein: 2.7, carbs: 26,  fat: 1   },
  { name: 'Oatmeal (100g dry)',             cal: 389, protein: 17,  carbs: 66,  fat: 7   },
  { name: 'Pasta (100g cooked)',            cal: 131, protein: 5,   carbs: 25,  fat: 1.1 },
  { name: 'Whole Wheat Bread (slice)',      cal: 80,  protein: 4,   carbs: 15,  fat: 1   },
  { name: 'White Bread (slice)',            cal: 75,  protein: 2.7, carbs: 14,  fat: 1   },
  { name: 'Tortilla (medium)',              cal: 146, protein: 4,   carbs: 26,  fat: 3.5 },
  { name: 'Quinoa (100g cooked)',           cal: 120, protein: 4.4, carbs: 22,  fat: 1.9 },

  // Protein
  { name: 'Chicken Breast (100g)',    cal: 165, protein: 31,  carbs: 0,   fat: 3.6 },
  { name: 'Chicken Thigh (100g)',     cal: 209, protein: 26,  carbs: 0,   fat: 11  },
  { name: 'Salmon (100g)',            cal: 208, protein: 20,  carbs: 0,   fat: 13  },
  { name: 'Tuna (100g)',              cal: 132, protein: 29,  carbs: 0,   fat: 1   },
  { name: 'Shrimp (100g)',            cal: 99,  protein: 24,  carbs: 0,   fat: 0.3 },
  { name: 'Egg (boiled)',             cal: 78,  protein: 6,   carbs: 0.6, fat: 5   },
  { name: 'Egg White',               cal: 17,  protein: 3.6, carbs: 0.2, fat: 0.1 },
  { name: 'Beef (100g lean)',         cal: 215, protein: 26,  carbs: 0,   fat: 12  },
  { name: 'Turkey Breast (100g)',     cal: 135, protein: 30,  carbs: 0,   fat: 1   },

  // Dairy
  { name: 'Milk (250ml)',             cal: 150, protein: 8,   carbs: 12,  fat: 8   },
  { name: 'Skim Milk (250ml)',        cal: 85,  protein: 8,   carbs: 12,  fat: 0.4 },
  { name: 'Greek Yogurt (100g)',      cal: 59,  protein: 10,  carbs: 3.6, fat: 0.4 },
  { name: 'Cheddar Cheese (30g)',     cal: 120, protein: 7,   carbs: 0.4, fat: 10  },
  { name: 'Cottage Cheese (100g)',    cal: 98,  protein: 11,  carbs: 3.4, fat: 4.3 },
  { name: 'Butter (10g)',             cal: 72,  protein: 0.1, carbs: 0,   fat: 8   },

  // Legumes
  { name: 'Lentils (100g cooked)',    cal: 116, protein: 9,   carbs: 20,  fat: 0.4 },
  { name: 'Chickpeas (100g cooked)', cal: 164, protein: 9,   carbs: 27,  fat: 2.6 },
  { name: 'Black Beans (100g)',       cal: 132, protein: 9,   carbs: 24,  fat: 0.5 },
  { name: 'Kidney Beans (100g)',      cal: 127, protein: 8.7, carbs: 23,  fat: 0.5 },

  // Nuts & Fats
  { name: 'Almonds (30g)',            cal: 170, protein: 6,   carbs: 6,   fat: 15  },
  { name: 'Walnuts (30g)',            cal: 196, protein: 4.6, carbs: 4.1, fat: 20  },
  { name: 'Cashews (30g)',            cal: 157, protein: 5.2, carbs: 9,   fat: 12  },
  { name: 'Peanut Butter (tbsp)',     cal: 94,  protein: 4,   carbs: 3,   fat: 8   },
  { name: 'Olive Oil (tbsp)',         cal: 119, protein: 0,   carbs: 0,   fat: 13.5},

  // Snacks & Fast Food
  { name: 'Pizza (slice)',            cal: 285, protein: 12,  carbs: 36,  fat: 10  },
  { name: 'Burger',                   cal: 540, protein: 27,  carbs: 40,  fat: 29  },
  { name: 'French Fries (medium)',    cal: 365, protein: 4,   carbs: 48,  fat: 17  },
  { name: 'Hot Dog',                  cal: 290, protein: 10,  carbs: 24,  fat: 17  },
  { name: 'Chips (30g)',              cal: 152, protein: 2,   carbs: 15,  fat: 10  },
  { name: 'Chocolate (30g)',          cal: 155, protein: 1.4, carbs: 17,  fat: 9   },
  { name: 'Ice Cream (100g)',         cal: 207, protein: 3.5, carbs: 24,  fat: 11  },
  { name: 'Cookie (medium)',          cal: 78,  protein: 1,   carbs: 11,  fat: 3.5 },
  { name: 'Donut (glazed)',           cal: 269, protein: 3,   carbs: 31,  fat: 15  },
  { name: 'Muffin (blueberry)',       cal: 340, protein: 5,   carbs: 55,  fat: 11  },

  // Drinks
  { name: 'Coca Cola (355ml)',        cal: 140, protein: 0,   carbs: 39,  fat: 0   },
  { name: 'Orange Juice (250ml)',     cal: 112, protein: 1.7, carbs: 26,  fat: 0.5 },
  { name: 'Coffee (black)',           cal: 2,   protein: 0.3, carbs: 0,   fat: 0   },
  { name: 'Latte (medium)',           cal: 190, protein: 10,  carbs: 19,  fat: 7   },
  { name: 'Green Tea',               cal: 2,   protein: 0,   carbs: 0.5, fat: 0   },
  { name: 'Protein Shake (30g mix)', cal: 120, protein: 24,  carbs: 5,   fat: 2   },
  { name: 'Beer (355ml)',             cal: 153, protein: 1.6, carbs: 13,  fat: 0   },
];

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
export const DAILY_GOAL_KCAL = 2000;
