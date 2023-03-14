const { default: axios } = require("axios");
const logger = require("./logger");

const WAYPOINT_LIMIT = 10;
function decode(t) {
  let points = [];
  for (let step of t) {
    let encoded = step.polyline.points;
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;
    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
  }
  return points;
}

async function fetchDirections(props) {
  let {
    origin: initialOrigin,
    destination: initialDestination,
    waypoints: initialWaypoints = [],
    apikey = "AIzaSyDmSQL-Km5Vrrb_rfnEj9NEF2vTA133Ij8",
    onStart,
    onError,
    mode = "DRIVING",
    language = "en",
    optimizeWaypoints,
    splitWaypoints,
    directionsServiceBaseUrl = "https://maps.googleapis.com/maps/api/directions/json",
    region,
    precision = "high",
    timePrecision = "none",
    channel,
  } = props;

  if (!apikey) {
    logger.error("Error: Missing API Key when generating polyline");
    return;
  }

  if (!initialOrigin || !initialDestination) {
    return;
  }

  const timePrecisionString = timePrecision === "none" ? "" : timePrecision;

  // Routes array which we'll be filling.
  // We'll perform a Directions API Request for reach route
  const routes = [];

  // We need to split the waypoints in chunks, in order to not exceede the max waypoint limit
  // ~> Chunk up the waypoints, yielding multiple routes
  if (
    splitWaypoints &&
    initialWaypoints &&
    initialWaypoints.length > WAYPOINT_LIMIT
  ) {
    // Split up waypoints in chunks with chunksize WAYPOINT_LIMIT
    const chunckedWaypoints = initialWaypoints.reduce(
      (accumulator, waypoint, index) => {
        const numChunk = Math.floor(index / WAYPOINT_LIMIT);
        accumulator[numChunk] = [].concat(
          accumulator[numChunk] || [],
          waypoint
        );
        return accumulator;
      },
      []
    );

    // Create routes for each chunk, using:
    // - Endpoints of previous chunks as startpoints for the route (except for the first chunk, which uses initialOrigin)
    // - Startpoints of next chunks as endpoints for the route (except for the last chunk, which uses initialDestination)
    for (let i = 0; i < chunckedWaypoints.length; i++) {
      routes.push({
        waypoints: chunckedWaypoints[i],
        origin:
          i === 0
            ? initialOrigin
            : chunckedWaypoints[i - 1][chunckedWaypoints[i - 1].length - 1],
        destination:
          i === chunckedWaypoints.length - 1
            ? initialDestination
            : chunckedWaypoints[i + 1][0],
      });
    }
  }

  // No splitting of the waypoints is requested/needed.
  // ~> Use one single route
  else {
    routes.push({
      waypoints: initialWaypoints,
      origin: initialOrigin,
      destination: initialDestination,
    });
  }

  // Perform a Directions API Request for each route
  const routesResults = await Promise.all(
    routes.map((route, index) => {
      let { origin, destination, waypoints } = route;

      if (origin.latitude && origin.longitude) {
        origin = `${origin.latitude},${origin.longitude}`;
      }

      if (destination.latitude && destination.longitude) {
        destination = `${destination.latitude},${destination.longitude}`;
      }

      waypoints = waypoints
        .map((waypoint) =>
          waypoint.latitude && waypoint.longitude
            ? `${waypoint.latitude},${waypoint.longitude}`
            : waypoint
        )
        .join("|");

      if (optimizeWaypoints) {
        waypoints = `optimize:true|${waypoints}`;
      }

      if (index === 0) {
        onStart &&
          onStart({
            origin,
            destination,
            waypoints: initialWaypoints,
          });
      }

      return fetchRoute(
        directionsServiceBaseUrl,
        origin,
        waypoints,
        destination,
        apikey,
        mode,
        language,
        region,
        precision,
        timePrecisionString,
        channel
      )
        .then((result) => {
          return result;
        })
        .catch((errorMessage) => {
          logger.error(`Error fetching route: ${errorMessage}`);
          return Promise.reject(errorMessage);
        });
    })
  )
    .then((results) => {
      // Combine all Directions API Request results into one
      const result = results.reduce(
        (acc, { distance, duration, coordinates, fare, waypointOrder }) => {
          acc.coordinates = [...acc.coordinates, ...coordinates];
          acc.distance += distance;
          acc.duration += duration;
          acc.fares = [...acc.fares, fare];
          acc.waypointOrder = [...acc.waypointOrder, waypointOrder];

          return acc;
        },
        {
          coordinates: [],
          distance: 0,
          duration: 0,
          fares: [],
          waypointOrder: [],
        }
      );

      return result.coordinates;
    })
    .catch((errorMessage) => {
      logger.warn(`Generate polyline error: ${errorMessage}`);
      onError && onError(errorMessage);
    });
  return routesResults;
}

function fetchRoute(
  directionsServiceBaseUrl,
  origin,
  waypoints,
  destination,
  apikey,
  mode,
  language,
  region,
  precision,
  timePrecision,
  channel
) {
  // Define the URL to call. Only add default parameters to the URL if it's a string.
  let url = directionsServiceBaseUrl;
  if (typeof directionsServiceBaseUrl === "string") {
    url += `?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode.toLowerCase()}&language=${language}&region=${region}`;
    if (timePrecision) {
      url += `&departure_time=${timePrecision}`;
    }
    if (channel) {
      url += `&channel=${channel}`;
    }
  }

  return axios
    .get(url)
    .then((response) => response.data)
    .then((json) => {
      if (json.status !== "OK") {
        const errorMessage =
          json.error_message || json.status || "Unknown error";
        return Promise.reject(errorMessage);
      }

      if (json.routes.length) {
        const route = json.routes[0];

        return Promise.resolve({
          distance:
            route.legs.reduce((carry, curr) => {
              return carry + curr.distance.value;
            }, 0) / 1000,
          duration:
            route.legs.reduce((carry, curr) => {
              return (
                carry +
                (curr.duration_in_traffic
                  ? curr.duration_in_traffic.value
                  : curr.duration.value)
              );
            }, 0) / 60,
          coordinates:
            precision === "low"
              ? decode([{ polyline: route.overview_polyline }])
              : route.legs.reduce((carry, curr) => {
                  return [...carry, ...decode(curr.steps)];
                }, []),
          fare: route.fare,
          waypointOrder: route.waypoint_order,
        });
      } else {
        logger.warn("No directions found");
        return Promise.reject();
      }
    })
    .catch((err) => {
      return Promise.reject(`Error on GMAPS route request: ${err}`);
    });
}

const generatePolyline = async ({ origin, destination, waypoints }) => {
  const directions = await fetchDirections({
    origin,
    destination,
    waypoints,
  });
  return directions;
};

module.exports = generatePolyline;
