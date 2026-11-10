# Weather Forecast

A responsive five-day weather dashboard built with HTML5, CSS3, and vanilla JavaScript ES modules. It uses Open-Meteo's free APIs, so no API key or backend is needed.

## Run locally

1. Open this folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Search for a city such as Addis Ababa. If more than one place matches, select the right location from the list.

The app uses JavaScript modules and should be served over HTTP by Live Server rather than opened directly as a `file://` URL. An internet connection is needed to load the APIs and Google Fonts.

## Try it out

- **Addis Ababa:** search for `Addis Ababa` to see current conditions and five daily forecast cards.
- **Another city:** try `Tokyo`, `London`, or a city near you.
- **Multiple matches:** search for a place name shared by several locations and choose the intended result.
- **Unknown city:** enter an invented city name to see the no-results message.
- **Empty input:** submit the empty search field to see validation feedback.
- **API/network failure:** temporarily go offline or block the Open-Meteo request, then search again to see the error state.
- **Mobile layout:** use browser developer tools to switch to a narrow viewport (for example, 375 px); detail cards stack and the forecast row scrolls horizontally.

## Project files

- `index.html` contains the accessible page structure, search form, live status area, weather panels, and module stylesheet/script links.
- `assets/css/style.css` styles the dashboard and adapts it to desktop, tablet, and mobile screens. Forecast and weather icons use text/emoji, so no image assets are required.
- `assets/js/app.js` handles form submission, empty-input validation, choosing a matching place, and the search-to-forecast workflow.
- `assets/js/weather.js` calls Open-Meteo's geocoding and forecast APIs, checks HTTP responses and required data, and maps WMO weather codes to descriptions and icons.
- `assets/js/ui.js` renders loading, empty, error, location-choice, current-weather, and five-day forecast views using DOM creation and `textContent`.
- `assets/images/` is reserved for optional local imagery; the app does not depend on external image assets.
- `.gitignore` excludes common local editor and operating-system files.

## Data sources

- City search: [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- Current conditions and daily forecast: [Open-Meteo Forecast API](https://open-meteo.com/en/docs)
- Attribution: weather data provided by [Open-Meteo](https://open-meteo.com/)

The app requests five forecast days in the location's local timezone and displays temperatures in Celsius and wind speed in km/h.
