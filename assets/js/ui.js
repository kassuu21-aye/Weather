import { getWeatherInfo } from "./weather.js";

const statusPanel = document.querySelector("#status-panel");
const locationPicker = document.querySelector("#location-picker");
const locationOptions = document.querySelector("#location-options");
const weatherContent = document.querySelector("#weather-content");
const formMessage = document.querySelector("#form-message");
const forecastGrid = document.querySelector("#forecast-grid");

export function showStatus(title, message, icon = "🌤️") {
  statusPanel.replaceChildren();
  statusPanel.hidden = false;
  statusPanel.classList.remove("is-loading", "is-error");
  locationPicker.hidden = true;
  weatherContent.hidden = true;

  const statusIcon = document.createElement("span");
  statusIcon.className = "status-icon";
  statusIcon.setAttribute("aria-hidden", "true");
  statusIcon.textContent = icon;

  const heading = document.createElement("h2");
  heading.textContent = title;
  const description = document.createElement("p");
  description.textContent = message;
  statusPanel.append(statusIcon, heading, description);
}

export function showLoading(message = "Finding your forecast…") {
  showStatus(message, "This may take a moment.", "⏳");
  statusPanel.classList.add("is-loading");
}

export function showError(message) {
  showStatus("Something went wrong", message, "!");
  statusPanel.classList.remove("is-loading");
  statusPanel.classList.add("is-error");
}

export function clearStatus() {
  statusPanel.hidden = true;
  statusPanel.classList.remove("is-loading", "is-error");
}

export function showFormMessage(message) {
  formMessage.textContent = message;
}

export function showPlaceOptions(places) {
  clearStatus();
  weatherContent.hidden = true;
  locationPicker.hidden = false;
  locationOptions.replaceChildren();

  places.forEach((place, index) => {
    const button = document.createElement("button");
    button.className = "location-option";
    button.type = "button";
    button.dataset.placeIndex = String(index);

    const name = document.createElement("span");
    name.className = "option-name";
    name.textContent = place.name;
    const details = document.createElement("span");
    details.className = "option-details";
    details.textContent = [place.admin1, place.country].filter(Boolean).join(", ");
    const arrow = document.createElement("span");
    arrow.className = "option-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    button.append(name, details, arrow);
    locationOptions.append(button);
  });
}

export function renderWeather(place, data) {
  clearStatus();
  locationPicker.hidden = true;
  weatherContent.hidden = false;

  const current = data.current;
  const weather = getWeatherInfo(current.weather_code);
  const cityParts = [place.name, place.admin1, place.country].filter(Boolean);
  document.querySelector("#current-title").textContent = [...new Set(cityParts)].join(", ");
  document.querySelector("#observation-time").textContent = current.time
    ? `As of ${formatTime(current.time)}`
    : "";
  document.querySelector("#current-description").textContent = weather.description;
  document.querySelector("#current-icon").textContent = weather.icon;
  document.querySelector("#current-temperature").textContent = formatValue(current.temperature_2m, "°");
  document.querySelector("#feels-like").textContent = formatValue(current.apparent_temperature, "°");
  document.querySelector("#humidity").textContent = formatValue(current.relative_humidity_2m, "%");
  document.querySelector("#wind-speed").textContent = formatValue(current.wind_speed_10m, " km/h");

  renderForecast(data.daily, data.daily_units?.temperature_2m_max ?? "°C");
}

function renderForecast(daily, temperatureUnit) {
  forecastGrid.replaceChildren();
  daily.time.slice(0, 5).forEach((date, index) => {
    const card = document.createElement("article");
    card.className = "forecast-card";
    const day = document.createElement("p");
    day.className = "forecast-day";
    day.textContent = formatDay(date, index);
    const icon = document.createElement("span");
    icon.className = "forecast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = getWeatherInfo(daily.weather_code?.[index]).icon;
    const description = document.createElement("p");
    description.className = "forecast-description";
    description.textContent = getWeatherInfo(daily.weather_code?.[index]).description;
    const temperatures = document.createElement("p");
    temperatures.className = "forecast-temperatures";
    temperatures.textContent = `${formatValue(daily.temperature_2m_max?.[index], temperatureUnit)} / ${formatValue(daily.temperature_2m_min?.[index], temperatureUnit)}`;
    const rain = document.createElement("p");
    rain.className = "forecast-rain";
    const rainChance = daily.precipitation_probability_max?.[index];
    rain.textContent = rainChance == null ? "Rain chance unavailable" : `${rainChance}% chance of rain`;
    card.append(day, icon, description, temperatures, rain);
    forecastGrid.append(card);
  });
}

function formatValue(value, unit) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${Math.round(value)}${unit}`
    : "—";
}

function formatTime(value) {
  const time = value.split("T")[1];
  return time ? time.slice(0, 5) : value;
}

function formatDay(value, index) {
  if (index === 0) return "Today";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
}
