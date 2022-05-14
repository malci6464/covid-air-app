//react libs
import React, { useState } from "react";
import { render } from "react-dom";

//map libs
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { IconLayer, TextLayer, ArcLayer } from "@deck.gl/layers";

//import data
import airportCodes from "./dataFiles/airportsDF.json";

//import css
import styles from "./buttons.module.css";

//layers
import { FlightPositionLayer } from "./layers/flightPositionLayer";
import { findAirCos } from "./processing/findCos";
import { airportIconLayerProps } from "./layers/airportIconLayer";
import { airportTextLayerProps } from "./layers/airportTextLayer";
import { geoLayer } from "./layers/covidLayer";
import { flightArcsProps } from "./layers/routesLayer";
import {
  createRoutes,
  fetchRoutes,
  maxFlightCount,
} from "./processing/createRoutes";
import { CovidChart } from "./layers/covidChart";
import { FlightChart } from "./layers/flightChart";
import { ChildComponent } from "./ChildComponent";

const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
//dark
const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export default function App() {
  const [airportsValue, setAirportsValue] = React.useState("please select");

  const [isFlightData, setIsFlightData] = useState(null);

  const [routesData, setRoutesData] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 10,
    latitude: 59,
    zoom: 4,
    maxZoom: 15,
    pitch: 30,
    bearing: 30,
  });

  const layers = [
    //scengraph todo - filterout non europe, filter 0,0 clkump of flights
    FlightPositionLayer(),
    geoLayer,
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

  //refactor to single function - consider dom args
  async function handleChange(event) {
    setAirportsValue(event.target.value);
    let fetch = await fetchRoutes(event.target.value);
    let [simplifiedRoutes, chartRoutes, chartLabels] = await createRoutes(
      fetch,
      event.target.value
    );
    setRoutesData(simplifiedRoutes);
    setIsFlightData([chartRoutes, chartLabels]);

    let res = findAirCos(event.target.value);
    setViewState(res);
  }

  async function handleChange2(airportVal) {
    setAirportsValue(airportVal);
    let fetch = await fetchRoutes(airportVal);
    let [simplifiedRoutes, chartRoutes, chartLabels] = await createRoutes(
      fetch,
      airportVal
    );
    setRoutesData(simplifiedRoutes);
    setIsFlightData([chartRoutes, chartLabels]);

    let res2 = findAirCos(airportVal);
    setViewState(res2);
  }

  // // build dropdown
  let airportOptions = [];
  for (var i = 0; i < airportCodes.length; i++) {
    airportOptions.push({
      label: airportCodes[i].name,
      value: airportCodes[i].ident,
    });
  }
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
        //effects={effects}
        // initialViewState={initialViewState}
        viewState={viewState}
        onViewStateChange={(e) => setViewState(e.viewState)}
        controller={true}
        // getTooltip={getTooltip}
      >
        <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
        <div className={styles.menuBar}>
          <h1 className={styles.test}>
            Real time Covid-19 Air Traffic Dashboard for Europe
          </h1>
          <form>
            <label>
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

          <p>
            Max number of incoming flights:{" "}
            {maxFlightCount > 0 ? maxFlightCount : "No flights!"}
          </p>

          <button className={styles.btn} onClick={handleshowHCcovid}>
            Covid Chart
          </button>
          <button className={styles.btn} onClick={handleshowHCroutes}>
            Routes Chart
          </button>
          <button className={styles.btn} onClick={handleMapChange}>
            Dark / light mode
          </button>

          <div
            style={{
              maxWidth: 1400,
              maxHeight: 800,
              display: showHCcovid ? "block" : "none",
            }}
          >
            <CovidChart />
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
