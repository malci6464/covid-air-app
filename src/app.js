//react libs
import React, { useState, useEffect } from "react";
import { render } from "react-dom";

//map libs
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { IconLayer, TextLayer, ArcLayer, GeoJsonLayer } from "@deck.gl/layers";

//import data
import airportCodes from "./dataFiles/airportsDF.json";

//import css
import styles from "./buttons.module.css";

//layers
import { FlightPositionLayer } from "./layers/flightPositionLayer";
import { findAirCos } from "./processing/findCos";
import { airportIconLayerProps } from "./layers/airportIconLayer";
import { airportTextLayerProps } from "./layers/airportTextLayer";
import { flightArcsProps } from "./layers/routesLayer";
import {
  createRoutes,
  fetchRoutes,
  maxFlightCount,
  airportCount,
  loading,
} from "./processing/createRoutes";
import { CovidChart } from "./layers/covidChart";
import { FlightChart } from "./layers/flightChart";

import {
  c19Keys,
  CovidRenderLayer,
  listOfC19Stats,
} from "./layers/covidRenderLayer";

const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
//dark
const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export default function App() {
  const [airportsValue, setAirportsValue] = useState(null); //ex: London Gatwick
  const [isFlightData, setIsFlightData] = useState(null); // api results
  const [routesData, setRoutesData] = useState(null); // api results
  //covid dropdown state
  const [covidValue, setCovidValue] = useState("activePerOneMillion");
  const [showActive1m, setActive1m] = useState(true);
  const [showDeaths1m, setDeaths1m] = useState(false);
  const [showDeaths, setDeaths] = useState(false);
  const [showCases, setCases] = useState(false);

  const [viewState, setViewState] = useState({
    longitude: 10,
    latitude: 59,
    zoom: 4,
    maxZoom: 15,
    pitch: 30,
    bearing: 30,
  }); //camera data

  const layers = [
    //scengraph todo - filterout non europe, filter 0,0 clkump of flights
    FlightPositionLayer(),
    // hardcoded to enable layer selction - using visible  deck.gl layer prop
    // format layer(data prop, visible bool, unique id)
    CovidRenderLayer(
      "activePerOneMillion",
      showActive1m,
      "activePerOneMillion"
    ),
    CovidRenderLayer(
      "deathsPerOneMillion",
      showDeaths1m,
      "deathsPerOneMillion"
    ),
    CovidRenderLayer("todayCases", showCases, "todayCases"),
    CovidRenderLayer("todayDeaths", showDeaths, "todayDeaths"),
    new ArcLayer({
      ...flightArcsProps,
      data: routesData,
    }),
    //these layers included directly for direct handling of clicks
    new IconLayer({
      ...airportIconLayerProps,
      onClick: (d) => handleChange2(d.object.name),
    }),
    new TextLayer({
      ...airportTextLayerProps,
      onClick: (d) => handleChange2(d.object.name),
    }),
  ];

  //handles dropdown arg - routes
  async function handleChange(event) {
    await buildDF(event.target.value);
  }

  //handles click -routes
  async function handleChange2(airportVal) {
    await buildDF(airportVal);
  }

  function handleCovidChange(eventVal) {
    for (const [key, value] of Object.entries(listOfC19Stats)) {
      if (value === eventVal.target.value) {
        //set current selected
        setCovidValue(value);
        //set state for layers
        key === "activePerOneMillion" ? setActive1m(true) : setActive1m(false);
        key === "deathsPerOneMillion" ? setDeaths1m(true) : setDeaths1m(false);
        key === "todayCases" ? setCases(true) : setCases(false);
        key === "todayDeaths" ? setDeaths(true) : setDeaths(false);

        //update covid chart props
      }
    }
  }

  async function buildDF(airportVal) {
    setAirportsValue(airportVal);
    let [fetch, flightChart] = await fetchRoutes(airportVal);
    let simplifiedRoutes = await createRoutes(fetch, airportVal);
    setRoutesData(simplifiedRoutes);
    //build chart data
    setIsFlightData(flightChart);
    // get co-oridnates
    let res2 = findAirCos(airportVal);
    //move camera view
    setViewState(res2);
  }

  // build dropdown
  let airportOptions = [];
  for (var i = 0; i < airportCodes.length; i++) {
    airportOptions.push({
      label: airportCodes[i].name,
      value: airportCodes[i].ident,
    });
  }

  // vars and functions to handle charts logic
  const [showHCcovid, setshowHCcovid] = useState(false);
  const handleshowHCcovid = () => setshowHCcovid(!showHCcovid);

  const [showHCroutes, setshowHCroutes] = useState(false);
  const handleshowHCroutes = () => setshowHCroutes(!showHCroutes);

  const [mapStyle, setMapStyle] = useState(MAP_STYLE);
  function handleMapChange() {
    if (mapStyle === MAP_STYLE_DARK) {
      return setMapStyle(MAP_STYLE);
    } else {
      return setMapStyle(MAP_STYLE_DARK);
    }
  }

  return (
    <div>
      <DeckGL
        layers={[layers]}
        viewState={viewState}
        onViewStateChange={(e) => setViewState(e.viewState)}
        controller={true}
        // getTooltip={getTooltip}
      >
        <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
        <div className={styles.menuBar}>
          <h1 className={styles.def}>Covid-19 Air Traffic Dashboard</h1>
          <h3 className={styles.def}>Real time for Europe</h3>
          <form>
            <label className={styles.def}>
              Pick an airport:
              <select value={airportsValue} onChange={handleChange}>
                <option key={"test"} value={"Please select airport"}>
                  {"Please select airport"}
                </option>
                {airportOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </form>

          <form>
            <label className={styles.def}>
              Select Covid-19 statistic
              <select value={covidValue} onChange={handleCovidChange}>
                {c19Keys.map((keyVal) => (
                  <option
                    key={listOfC19Stats[keyVal]}
                    value={listOfC19Stats[keyVal]}
                  >
                    {listOfC19Stats[keyVal]}
                  </option>
                ))}
              </select>
            </label>
          </form>

          <p className={styles.def}>
            {maxFlightCount > 0
              ? "Max number of incoming flights: " +
                maxFlightCount +
                " from " +
                airportCount +
                " different airports"
              : "No flights - Please select another airport! "}
          </p>

          <button className={styles.btn} onClick={handleshowHCcovid}>
            Covid Chart
          </button>
          <button
            className={styles.btn}
            onClick={handleshowHCroutes}
            style={{
              display: routesData !== null ? "inline" : "none",
            }}
          >
            Routes Chart
          </button>
          <button className={styles.btn} onClick={handleMapChange}>
            Dark / light mode
          </button>
          <div
            style={{
              maxWidth: 1600,
              maxHeight: 200,
              display: loading ? "block" : "none",
            }}
          >
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
            </div>{" "}
            Waiting for data from the flights API
          </div>
          <div
            style={{
              maxWidth: 1400,
              maxHeight: 800,
              display: showHCcovid ? "block" : "none",
            }}
          >
            <CovidChart caseType={covidValue} />
          </div>
          <div
            style={{
              maxWidth: 1400,
              maxHeight: 800,
              display: showHCroutes ? "block" : "none",
            }}
          >
            <FlightChart toFlightChart={isFlightData} />
          </div>
        </div>
      </DeckGL>
    </div>
  );
}

export function renderToDOM(container) {
  render(<App />, container);
}
