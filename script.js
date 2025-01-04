const getLatLon = async (city) => {
  // Use Open-Meteo API for geocoding (lat/lon lookup)
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
  const response = await fetch(geoUrl);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const { latitude, longitude } = data.results[0];
    return { latitude, longitude };
  } else {
    throw new Error('City not found');
  }
};

const getWeatherNWS = async (latitude, longitude) => {
  // Use NWS API for weather data
  const endpointUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
  const response = await fetch(endpointUrl);
  const data = await response.json();
  const forecastUrl = data.properties.forecast;

  const forecastResponse = await fetch(forecastUrl);
  const forecastData = await forecastResponse.json();
  return forecastData.properties.periods[0]; // Return current forecast
};

document.getElementById('getWeather').addEventListener('click', async () => {
  const city = document.getElementById('cityInput').value;
  const weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = 'Loading...';

  try {
    const { latitude, longitude } = await getLatLon(city);
    const weather = await getWeatherNWS(latitude, longitude);

    weatherInfo.innerHTML = `
      <h2>${city}</h2>
      <p>Temperature: ${weather.temperature}°${weather.temperatureUnit}</p>
      <p>Weather: ${weather.shortForecast}</p>
      <p>Wind: ${weather.windSpeed} ${weather.windDirection}</p>
    `;
  } catch (error) {
    weatherInfo.innerHTML = `<p>${error.message}</p>`;
  }
});
