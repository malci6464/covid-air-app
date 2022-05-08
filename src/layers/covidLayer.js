import euroGEO from "../dataFiles/europe.geojson";
import { GeoJsonLayer } from "@deck.gl/layers";
import { scaleLinear, scaleThreshold } from "d3-scale";
import { europeanCountries } from "../dataFiles/countryList";
import { useState, createContext } from "react";

let clist = "";
europeanCountries.forEach((each) => (clist = clist + each + ","));
const C19_base = `https://corona.lmao.ninja/v2/countries/${clist}?yesterday`;

let c19max = 500000;
let c19min = 0;

//init
let res = callCovidApi();

function getCountryId(val) {
  let country = val.properties.NAME;
  let cs = 0;
  let rez = res.map((each) =>
    each.country === country ? (cs = each.cases) : ""
  );
  return c19Scale(cs);
}

const c19Scale = scaleLinear()
  .domain([100000, c19max])
  .range([
    [0, 0, 0], // <= the lightest shade we want
    [255, 0, 0],
  ]);

function getCovid(inputData) {
  let temp = [];

  //select cases data
  inputData.forEach((each) =>
    temp.push({ country: each.country, cases: each.activePerOneMillion })
  );

  //track limit
  inputData.forEach((each) =>
    each.activePerOneMillion > c19max ? (c19max = each.activePerOneMillion) : ""
  );

  // add time stamp : lastUpdated
  // add population for % figure
  //add deaths - switcher logic
  //add cumlative

  localStorage.setItem("covid", JSON.stringify(temp));

  return temp;
}

function callCovidApi() {
  fetch(C19_base)
    .then((response) => response.json())
    .then((data) => (res = getCovid(data)));
}

export const geoLayer = new GeoJsonLayer({
  id: "geojson",
  data: euroGEO,
  opacity: 0.4,
  stroked: false,
  filled: true,
  extruded: true,
  wireframe: true,
  getFillColor: (f) => getCountryId(f), //colour defined by covid levels
  getLineColor: [255, 255, 255],
  getPolygonOffset: (f) => [222, 22],
  pickable: true,
});

// export const covidDataContext = createContext();
// export const covidDataProvider = (props) => {};
// export function CovidData(newCovidData) {
//   const [covidData, setCovidData] = useState(null);
//   if (newCovidData !== undefined) {
//     setCovidData(newCovidData);
//   }
//   return covidData;
// }
