const axios = require("axios");

const getWeather = async ({ lat, lng }) => {
  const weather = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&exclude=minutely&appid=${process.env.WEATHER_API_KEY}`
  );
  const weatherData = weather?.data;
  if (weatherData) {
    return {
      weatherLocation: weatherData.city.name,
      weather: weatherData.list,
    };
  }
};

module.exports = { getWeather };
