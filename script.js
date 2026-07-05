const API_KEY = "fcc8de7015bbb202209bbf0261babf4c"; 

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";


const cityInput      = document.getElementById("cityInput");
const searchBtn       = document.getElementById("searchBtn");
const locationBtn     = document.getElementById("locationBtn");

const loader          = document.getElementById("loader");
const errorBox        = document.getElementById("errorBox");
const errorMessage     = document.getElementById("errorMessage");
const weatherResult    = document.getElementById("weatherResult");

const dateTimeEl      = document.getElementById("dateTime");
const cityNameEl       = document.getElementById("cityName");
const countryNameEl    = document.getElementById("countryName");
const weatherIconEl    = document.getElementById("weatherIcon");
const temperatureEl    = document.getElementById("temperature");
const weatherConditionEl = document.getElementById("weatherCondition");
const feelsLikeEl      = document.getElementById("feelsLike");
const feelsLikeCardEl  = document.getElementById("feelsLikeCard");
const humidityEl       = document.getElementById("humidity");
const windSpeedEl      = document.getElementById("windSpeed");
const pressureEl       = document.getElementById("pressure");
const sunriseEl        = document.getElementById("sunrise");
const sunsetEl         = document.getElementById("sunset");

const themeToggleBtn   = document.getElementById("themeToggleBtn");
const themeIcon        = document.getElementById("themeIcon");


function showLoader() {
  loader.classList.remove("d-none");
  errorBox.classList.add("d-none");
  weatherResult.classList.add("d-none");
}


function hideLoader() {
  loader.classList.add("d-none");
}


function showError(message) {
  errorMessage.textContent = message;
  errorBox.classList.remove("d-none");
  weatherResult.classList.add("d-none");
}


function formatDateTime(date) {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}


function formatUnixTime(unixSeconds, timezoneOffsetSeconds) {
  
  const localMillis = (unixSeconds + timezoneOffsetSeconds) * 1000;
  const date = new Date(localMillis);
  
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}


async function getWeather(city) {
  
  if (!city || city.trim() === "") {
    showError("Please enter a city name.");
    return;
  }

  showLoader();

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the spelling and try again.");
      } else if (response.status === 401) {
        throw new Error("Invalid API key. Please add a valid OpenWeatherMap API key in script.js.");
      } else {
        throw new Error("Something went wrong while fetching weather data.");
      }
    }

    const data = await response.json();

    displayWeather(data);
    localStorage.setItem("lastCity", city);

  } catch (error) {
    showError(error.message || "Unable to fetch weather data. Please try again.");
  } finally {
    hideLoader();
  }
}


async function getWeatherByCoords(lat, lon) {
  showLoader();

  try {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Could not fetch weather for your current location.");
    }

    const data = await response.json();
    displayWeather(data);

    if (data.name) {
      cityInput.value = data.name;
      localStorage.setItem("lastCity", data.name);
    }

  } catch (error) {
    showError(error.message || "Unable to fetch weather data for your location.");
  } finally {
    hideLoader();
  }
}


function displayWeather(data) {

  dateTimeEl.textContent = formatDateTime(new Date());

  cityNameEl.textContent = data.name;
  countryNameEl.textContent = data.sys.country;

  const iconCode = data.weather[0].icon;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconEl.alt = data.weather[0].description;

  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  weatherConditionEl.textContent = data.weather[0].description;
  feelsLikeEl.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;

  humidityEl.textContent = `${data.main.humidity}%`;
  windSpeedEl.textContent = `${data.wind.speed} m/s`;
  pressureEl.textContent = `${data.main.pressure} hPa`;
  feelsLikeCardEl.textContent = `${Math.round(data.main.feels_like)}°C`;

  sunriseEl.textContent = formatUnixTime(data.sys.sunrise, data.timezone);
  sunsetEl.textContent = formatUnixTime(data.sys.sunset, data.timezone);

  weatherResult.classList.remove("d-none");
  errorBox.classList.add("d-none");
}


searchBtn.addEventListener("click", () => {
  getWeather(cityInput.value.trim());
});

cityInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    getWeather(cityInput.value.trim());
  }
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }

  showLoader();
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherByCoords(latitude, longitude);
    },
    () => {
      hideLoader();
      showError("Location permission denied. Please search for a city manually.");
    }
  );
});


function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    themeIcon.className = "bi bi-sun-fill";
  } else {
    document.body.classList.remove("dark-theme");
    themeIcon.className = "bi bi-moon-stars-fill";
  }
  localStorage.setItem("theme", theme);
}

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-theme");
  applyTheme(isDark ? "light" : "dark");
});


window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  const lastCity = localStorage.getItem("lastCity");

  if (lastCity) {
    cityInput.value = lastCity;
    getWeather(lastCity);
  } else if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        
      }
    );
  }
});
