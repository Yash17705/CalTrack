# ⚡ CalTrack

A lightweight React + Vite app for tracking daily calories, macros, hydration, and nutrition habits.

CalTrack stores all user data locally in the browser and runs entirely without a backend, making it ideal for personal use and demos.

## 🚀 Live Preview
> Visit the live site at https://caltrack12.netlify.app/

Or run locally at `http://localhost:5173` after starting the app.

## 💻 Features

- User authentication with sign up, sign in, and persistent session state
- Multiple user profiles with isolated localStorage data
- Food search from 70+ built-in items with autocomplete
- Custom food entry support with full nutritional values
- Meal logging for Breakfast, Lunch, Dinner, and Snack
- Calorie ring and macro bars for protein, carbs, and fat
- 7-day history, daily stats, and trend tracking
- Water reminder settings and intake timeline
- Dark/light theme toggle and clean dashboard UI

## 🧰 Built With

- React
- Vite
- JavaScript
- CSS variables for theming
- browser localStorage for persistence

## 📦 Getting Started

### Prerequisites

- Node.js 18+ (or latest stable version)
- npm

### Install dependencies

```bash
cd caltrack
npm install
```

### Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

The production-ready output is generated in the `dist/` folder.

## 📁 Project Structure

```
caltrack/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── lib/
    │   ├── db.js
    │   ├── foodData.js
    │   └── theme.js
    └── components/
        ├── AuthScreen.jsx
        ├── Navbar.jsx
        ├── TodayTab.jsx
        ├── HistoryTab.jsx
        ├── WaterTab.jsx
        ├── ProfileTab.jsx
        └── UI.jsx
```

## 🛠️ Customization

- `src/lib/foodData.js` — update built-in food items and calorie goals
- `src/lib/theme.js` — adjust dark/light theme colors
- `src/lib/db.js` — replace localStorage persistence with a backend API
- `src/components/WaterTab.jsx` — update water reminder behavior

## 📌 Notes

- Data is stored in browser localStorage only.
- Clearing site data will remove saved users and history.
- Fonts are loaded from Google Fonts on first visit.

## 🤝 Contributing

Feel free to open issues or submit pull requests for new features, bug fixes, or UI improvements.

---

Made with React + Vite.
