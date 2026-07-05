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

/* -----------------------------------------------------------------------
   3. HELPER FUNCTIONS
------------------------------------------------------------------------ */

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
  // Convert to milliseconds and shift by the city's timezone offset
  const localMillis = (unixSeconds + timezoneOffsetSeconds) * 1000;
  const date = new Date(localMillis);
  // Use UTC getters because we've already manually shifted the time
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}


async function getWeather(city) {
  // Guard: don't search for an empty string
  if (!city || city.trim() === "") {
    showError("Please enter a city name.");
    return;
  }

  showLoader();

  try {
    // Build the request URL: metric units gives temperature in °C
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);

    // OpenWeatherMap returns HTTP 404 when the city isn't found,
    // and 401 when the API key is missing/invalid.
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

    // Success! Render the data and remember this city for next visit.
    displayWeather(data);
    localStorage.setItem("lastCity", city);

  } catch (error) {
    // Network errors (e.g. no internet) also land here
    showError(error.message || "Unable to fetch weather data. Please try again.");
  } finally {
    // Always hide the loader, whether the request succeeded or failed
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

    // Update the search box and localStorage with the resolved city name
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
  // --- Date & time (user's local device time, shown at the top) ---
  dateTimeEl.textContent = formatDateTime(new Date());

  // --- City & country ---
  cityNameEl.textContent = data.name;
  countryNameEl.textContent = data.sys.country;

  // --- Main temperature + icon + condition ---
  const iconCode = data.weather[0].icon;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconEl.alt = data.weather[0].description;

  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  weatherConditionEl.textContent = data.weather[0].description;
  feelsLikeEl.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;

  // --- Details grid ---
  humidityEl.textContent = `${data.main.humidity}%`;
  windSpeedEl.textContent = `${data.wind.speed} m/s`;
  pressureEl.textContent = `${data.main.pressure} hPa`;
  feelsLikeCardEl.textContent = `${Math.round(data.main.feels_like)}°C`;

  // --- Sunrise / sunset (converted using the city's own timezone offset) ---
  sunriseEl.textContent = formatUnixTime(data.sys.sunrise, data.timezone);
  sunsetEl.textContent = formatUnixTime(data.sys.sunset, data.timezone);

  // Reveal the result section and make sure error/loader are hidden
  weatherResult.classList.remove("d-none");
  errorBox.classList.add("d-none");
}


// Search button click
searchBtn.addEventListener("click", () => {
  getWeather(cityInput.value.trim());
});

// Pressing "Enter" inside the input field also triggers a search
cityInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    getWeather(cityInput.value.trim());
  }
});

// "Use my location" button - asks for Geolocation permission
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
  // Restore theme preference
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  // Restore last searched city, if any
  const lastCity = localStorage.getItem("lastCity");

  if (lastCity) {
    cityInput.value = lastCity;
    getWeather(lastCity);
  } else if (navigator.geolocation) {
    // No saved city — try to auto-detect weather via Geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        // Permission denied or unavailable — that's fine, just wait
        // for the user to search manually. No error shown here since
        // this is a silent, optional convenience feature.
      }
    );
  }
});
