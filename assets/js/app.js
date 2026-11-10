import { getForecast, searchPlaces } from "./weather.js";
import {
  renderWeather,
  showError,
  showFormMessage,
  showLoading,
  showPlaceOptions,
  showStatus
} from "./ui.js";

const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const locationOptions = document.querySelector("#location-options");
let matchingPlaces = [];

searchForm.addEventListener("submit", handleSearch);
locationOptions.addEventListener("click", handlePlaceSelection);

async function handleSearch(event) {
  event.preventDefault();
  const cityName = cityInput.value.trim();

  if (!cityName) {
    showFormMessage("Enter a city name to search.");
    cityInput.focus();
    showStatus("Start with a city", "Enter a city name above to see its forecast.");
    return;
  }

  showFormMessage("");
  showLoading("Searching for your city…");

  try {
    matchingPlaces = await searchPlaces(cityName);
    if (matchingPlaces.length === 0) {
      showStatus("No cities found", `We couldn't find “${cityName}”. Check the spelling and try again.`, "⌕");
      return;
    }

    if (matchingPlaces.length > 1) {
      showPlaceOptions(matchingPlaces);
      return;
    }

    await loadPlace(matchingPlaces[0]);
  } catch (error) {
    showError(getErrorMessage(error));
  }
}

async function handlePlaceSelection(event) {
  const button = event.target.closest("button[data-place-index]");
  if (!button) return;

  const place = matchingPlaces[Number(button.dataset.placeIndex)];
  if (place) await loadPlace(place);
}

async function loadPlace(place) {
  showLoading(`Loading the forecast for ${place.name}…`);
  try {
    const forecast = await getForecast(place);
    renderWeather(place, forecast);
  } catch (error) {
    showError(getErrorMessage(error));
  }
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
}
