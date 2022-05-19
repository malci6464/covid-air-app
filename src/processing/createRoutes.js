import { scaleThreshold } from "d3-scale";
import airportCodes from "../dataFiles/airportsDF.json";

export let totalFlights = 0;
export let airportCount = 0;
//global store - refacror
export let currentCoordinates = [];
//route counts per airport - multiple objects/vals
export let currentFlightCount = {};
export let loading = false;

export async function createRoutes(res, selectedAirport) {
  let simplifiedRoutes = [];
  // return length of all potentially in tooltip
  await res.map((each) =>
    each.estDepartureAirport !== null
      ? simplifiedRoutes.push({
          count: 1,
          from: {
            name: each.estDepartureAirport,
            coordinates: findAirportCoordinates(each.estDepartureAirport),
          },
          to: {
            name: selectedAirport,
            coordinates: findAirportCoordinates(selectedAirport),
          },
        })
      : ""
  );
  // (each.count = currentFlightCount[each.from.name].count)
  await simplifiedRoutes.map((each) =>
    currentFlightCount[each.from.name] !== undefined
      ? (each.count = currentFlightCount[each.from.name].count)
      : (each.count = 1)
  );

  return simplifiedRoutes;
}

export async function fetchRoutes(airport) {
  loading = true;
  let end = parseInt(Date.now() / 1000);
  //let end = 1649967142;
  let buffer = 10000;
  let week = 604800;
  let start = parseInt(end - (week - buffer)); // on week - max of api
  // let start = 1649707942;
  let url = `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=${start}&end=${end}`;

  let fetchedData = null;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => (fetchedData = data));
  let flightChartData = await countRoutesPerAirport(fetchedData);
  loading = false;
  return [fetchedData, flightChartData];
}

async function countRoutesPerAirport(data) {
  loading = true;

  let routeCounts = {};
  const filteredData = await data.filter(
    (each) => each.estDepartureAirport !== null
  );
  filteredData.map((each) =>
    routeCounts[each.estDepartureAirport] !== undefined
      ? routeCounts[each.estDepartureAirport].count++
      : (routeCounts[each.estDepartureAirport] = {
          count: 1,
        })
  );
  //get total of all routes
  Object.values(routeCounts).forEach(
    (each) => (totalFlights = totalFlights + each.count)
  );

  airportCount = Object.keys(routeCounts).length;
  //used to colour scale routes
  currentFlightCount = routeCounts;
  //set loading status
  loading = false;
  return routeCounts;
}

export const COLOR_SCALE = scaleThreshold()
  .domain([0.2, 0.5, 1])
  .range([
    [10, 217, 5],
    [255, 217, 71],
    [255, 99, 71],
  ]);

function findAirportCoordinates(input) {
  //consider more than one match? - overwrite as failsafe
  let cos;
  airportCodes.map((each) =>
    each.ident === input ? (cos = each.coordinates) : ""
  );
  if (cos !== undefined) {
    let parsedCord = convertCoordinates(cos);
    currentCoordinates = parsedCord; //for flytolocation
    return parsedCord;
  }
}

function convertCoordinates(inputEl) {
  let cos2 = inputEl.split(",");
  let long = parseFloat(cos2[0]);
  let lat = parseFloat(cos2[1]);
  return [long, lat];
}
