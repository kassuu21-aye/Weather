const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchPlaces(cityName) {
  const url = new URL(GEOCODING_URL);
  url.search = new URLSearchParams({
    name: cityName,
    count: "5",
    language: "en",
    format: "json"
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`City search failed (HTTP ${response.status}). Please try again.`);
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

export async function getForecast(place) {
  const url = new URL(FORECAST_URL);
  url.search = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m"
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max"
    ].join(","),
    timezone: "auto",
    forecast_days: "5"
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather request failed (HTTP ${response.status}). Please try again.`);
  }

  const data = await response.json();
  if (!data.current || !data.daily || !Array.isArray(data.daily.time)) {
    throw new Error("The weather service returned incomplete forecast data. Please try again.");
  }

  return data;
}

export function getWeatherInfo(code) {
  const weatherTypes = [
    { codes: [0], description: "Clear sky", icon: "☀️" },
    { codes: [1], description: "Mainly clear", icon: "🌤️" },
    { codes: [2], description: "Partly cloudy", icon: "⛅" },
    { codes: [3], description: "Overcast", icon: "☁️" },
    { codes: [45, 48], description: "Foggy", icon: "🌫️" },
    { codes: [51, 53, 55], description: "Drizzle", icon: "🌦️" },
    { codes: [56, 57], description: "Freezing drizzle", icon: "🌧️" },
    { codes: [61, 63, 65], description: "Rain", icon: "🌧️" },
    { codes: [66, 67], description: "Freezing rain", icon: "🌧️" },
    { codes: [71, 73, 75], description: "Snow", icon: "❄️" },
    { codes: [77], description: "Snow grains", icon: "❄️" },
    { codes: [80, 81, 82], description: "Rain showers", icon: "🌦️" },
    { codes: [85, 86], description: "Snow showers", icon: "🌨️" },
    { codes: [95], description: "Thunderstorm", icon: "⛈️" },
    { codes: [96, 99], description: "Thunderstorm with hail", icon: "⛈️" }
  ];

  return weatherTypes.find((type) => type.codes.includes(code))
    ?? { description: "Conditions unavailable", icon: "🌡️" };
}
