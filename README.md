# 🌤️ Weather App

A modern, fully responsive weather application built with **HTML, CSS, Bootstrap 5, and Vanilla JavaScript** — no frameworks, no backend. It fetches real-time weather data from the **OpenWeatherMap API** and displays it in a clean glassmorphism-style UI.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap%205-7952B3?style=flat&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 📋 Features

- 🔍 Search weather by city name
- 📍 Auto-detect weather using Geolocation API (with user permission)
- 🌡️ Displays temperature, feels-like, humidity, wind speed, and pressure
- 🌅 Sunrise and sunset times (calculated using the city's own timezone)
- 🕒 Live current date and time
- 💾 Remembers the last searched city using LocalStorage
- 🌗 Light/Dark mode toggle
- ⏳ Loading spinner while fetching data
- ⚠️ Friendly error messages (e.g. city not found, invalid API key)
- ⌨️ Press **Enter** to search
- 📱 Fully responsive — works on mobile, tablet, and desktop
- ✨ Smooth hover effects and animations

---

## 🖥️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Structure  | HTML5                                |
| Styling    | CSS3, Bootstrap 5, Bootstrap Icons   |
| Logic      | Vanilla JavaScript (Fetch API, async/await) |
| Data       | OpenWeatherMap REST API              |
| Storage    | Browser LocalStorage                 |

---

## 📁 Project Structure

```
weather-app/
│── index.html     # Page structure & Bootstrap layout
│── style.css      # Custom styling, glassmorphism, animations, themes
│── script.js      # App logic: API calls, DOM updates, event handling
└── README.md
```

---

## ⚙️ Setup & Installation

This project requires a **free API key** from OpenWeatherMap to fetch weather data.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Get your free API key
- Sign up at [OpenWeatherMap](https://openweathermap.org/api)
- Go to the **API keys** tab and copy your default key
- Note: new keys can take **10 minutes to 2 hours** to activate

### 3. Add your API key
Open `script.js` and replace the placeholder:
```js
const API_KEY = "YOUR_API_KEY";
```
with your actual key:
```js
const API_KEY = "your_actual_api_key_here";
```

### 4. Run the app
No build tools or server required — just open `index.html` directly in your browser, or serve it with any static server (e.g. VS Code Live Server extension).

---

## 🚀 Usage

1. Type a city name in the search box and press **Enter** or click **Search**
2. Click the 📍 location icon to get weather for your current location
3. Toggle the 🌙/☀️ icon (top-right) to switch between light and dark mode

---

## 🔒 Security Note

Never commit your real API key to a public repository. This project uses a placeholder (`YOUR_API_KEY`) intentionally — replace it locally and avoid pushing your actual key. For production use, consider environment variables or a backend proxy to keep the key private.

---

## 🙌 Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Bootstrap Icons](https://icons.getbootstrap.com/)
- UI framework: [Bootstrap 5](https://getbootstrap.com/)

---

## 📄 License

This project is open-source and available for learning purposes. Feel free to fork and modify it.
