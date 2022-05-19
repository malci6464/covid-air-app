//react libs
import React, { useState } from "react";
import { render } from "react-dom";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { IconLayer, TextLayer, ArcLayer } from "@deck.gl/layers";

//import data
import { MAP_STYLE_STD } from "./dataFiles/mapStyles";

//import css
import styles from "./buttons.module.css";

//layers
import { FlightPositionLayer } from "./layers/flightPositionLayer";
import { airportIconLayerProps } from "./layers/airportIconLayer";
import { airportTextLayerProps } from "./layers/airportTextLayer";
import { flightArcsProps } from "./layers/routesLayer";

//routes processing
import {
  airportCount,
  totalFlights,
  createRoutes,
  fetchRoutes,
} from "./processing/createRoutes";
import { findAirCos } from "./processing/findCos";

//covid processing
import { CovidRenderLayer } from "./layers/covidRenderLayer";

// import components for render
import { LoadingAnimation } from "./components/loading";
import { AppTitles } from "./components/titles";
import { RoutesDropdown } from "./components/routesDropdown";
import { CovidDropdown } from "./components/covidDropdown";
import { C19Btn } from "./components/c19ChartBtn";
import { FlightChartBtn } from "./components/routesChartBtn";
import { SetMapBg } from "./components/mapStyle";
import { FlightInfoBar } from "./components/flighInfoBar";
import { C19Legend } from "./components/C19Legend";

//call main function to load app
export default function App() {
  //flights data store
  const [isFlightData, setIsFlightData] = useState(null); // api results
  const [routesData, setRoutesData] = useState(null); // api results
  const [airportsValue, setAirportsValue] = useState(
    "Select an incoming route"
  ); //ex: London Gatwick

  //covid data store
  const [c19Stat, setC19Stat] = useState("activePerOneMillion");
  const [c19Total, setC19Total] = useState("activePerOneMillion");
  const [currentC19List, setCurrentC19List] = useState({
    activePerOneMillion: 0,
    deathsPerOneMillion: 0,
    todayCases: 0,
    todayDeaths: 0,
  });
  const [showActive1m, setActive1m] = useState(true);
  const [showDeaths1m, setDeaths1m] = useState(false);
  const [showDeaths, setDeaths] = useState(false);
  const [showCases, setCases] = useState(false);

  //map data store
  const [showMenu, setshowMenu] = useState(true);
  const [mapStyle, setMapStyle] = useState(MAP_STYLE_STD);
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
    // format layer(data prop, visible bool, unique id, max list states)
    CovidRenderLayer(
      "activePerOneMillion",
      showActive1m,
      "activePerOneMillion",
      setCurrentC19List,
      currentC19List
    ),
    CovidRenderLayer(
      "deathsPerOneMillion",
      showDeaths1m,
      "deathsPerOneMillion",
      setCurrentC19List,
      currentC19List
    ),
    CovidRenderLayer(
      "todayCases",
      showCases,
      "todayCases",
      setCurrentC19List,
      currentC19List
    ),
    CovidRenderLayer(
      "todayDeaths",
      showDeaths,
      "todayDeaths",
      setCurrentC19List,
      currentC19List
    ),
    new ArcLayer({
      ...flightArcsProps,
      data: routesData,
    }),
    //these layers included directly for direct handling of clicks
    new IconLayer({
      ...airportIconLayerProps,
      onClick: (d) => handleClicks(d.object.name),
    }),
    new TextLayer({
      ...airportTextLayerProps,
      onClick: (d) => handleClicks(d.object.name),
    }),
  ];

  //handles click -routes
  async function handleClicks(airportVal) {
    await buildDF(airportVal);
  }

  async function buildDF(airportVal) {
    setAirportsValue(airportVal);
    // Routes;
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

  const toggleMenu = () => setshowMenu(!showMenu);

  return (
    <div>
      <DeckGL
        layers={[layers]}
        viewState={viewState}
        onViewStateChange={(e) => setViewState(e.viewState)}
        controller={true}
      >
        <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
        <div className={styles.menuBar}>
          <AppTitles />
          <button className={styles.menuBtn} onClick={toggleMenu}>
            Toggle menu
          </button>
          <div
            style={{
              display: showMenu ? "block" : "none",
            }}
          >
            <RoutesDropdown
              setRoutesData={setRoutesData}
              setIsFlightData={setIsFlightData}
              setViewState={setViewState}
              setAirportsValue={setAirportsValue}
              airportsValue={airportsValue}
            />
            <CovidDropdown
              setActive1m={setActive1m}
              setDeaths1m={setDeaths1m}
              setCases={setCases}
              setDeaths={setDeaths}
              setC19Stat={setC19Stat}
              setC19Total={setC19Total}
            />
            <FlightInfoBar
              totalFlights={totalFlights}
              airportTotal={airportCount}
            />
            <C19Legend c19Total={c19Total} currentC19List={currentC19List} />
            <C19Btn c19Stat={c19Stat} />
            <FlightChartBtn isFlightData={isFlightData} />
            <SetMapBg setMapStyle={setMapStyle} currentMap={mapStyle} />
          </div>
          <LoadingAnimation />
        </div>
      </DeckGL>
    </div>
  );
}

export function renderToDOM(container) {
  render(<App />, container);
}
