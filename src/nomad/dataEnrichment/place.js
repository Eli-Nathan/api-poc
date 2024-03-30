const axios = require("axios");
const logger = require("../../nomad/logger");

const getPlaceFromLatLng = async ({ lat, lng }) => {
  const place = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  return place?.data;
};

const getPlacesFromQuery = async ({ query }) => {
  try {
    const places = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${query}, Scotland&format=jsonv2&countrycodes=gb&limit=50&namedetails=1&addressdetails=1&extratags=1&accept-language=en-GB`,
      {
        headers: { "User-Agent": `WildWay-${query}` },
      }
    );
    logger.warn(
      "Nominatim",
      `https://nominatim.openstreetmap.org/search?q=${query}, Scotland&format=jsonv2&countrycodes=gb&limit=50&namedetails=1&addressdetails=1&extratags=1&accept-language=en-GB`
    );
    return places?.data;
  } catch (err) {
    logger.warn("Nominatim error", err);
    return [];
  }
};

module.exports = { getPlaceFromLatLng, getPlacesFromQuery };
