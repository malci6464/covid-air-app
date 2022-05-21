//react libs
import React, { useState } from 'react';
import { render } from 'react-dom';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { IconLayer, TextLayer, ArcLayer } from '@deck.gl/layers';

//import data
import { MAP_STYLE_STD } from './dataFiles/mapStyles';

//import css
import styles from './buttons.module.css';

//layers
import { FlightPositionLayer, DATA_INDEX } from './layers/flightPositionLayer';
import { airportIconLayerProps } from './layers/airportIconLayer';
import { airportTextLayerProps } from './layers/airportTextLayer';
import { flightArcsProps } from './layers/routesLayer';

//routes processing
import {
  airportCount,
  totalFlights,
  createRoutes,
  fetchRoutes,
} from './processing/createRoutes';
import { findAirCos } from './processing/findCos';

//covid processing
import { CovidRenderLayer } from './layers/covidRenderLayer';

// import components for render
import { LoadingAnimation } from './components/loading';
import { AppTitles } from './components/titles';
import { RoutesDropdown } from './components/routesDropdown';
import { CovidDropdown } from './components/covidDropdown';
import { C19Btn } from './components/c19ChartBtn';
import { currDF } from './layers/covidChart';
import { FlightChartBtn } from './components/routesChartBtn';
import { SetMapBg } from './components/mapStyle';
import { FlightInfoBar } from './components/flighInfoBar';
import { C19Legend } from './components/C19Legend';

//call main function to load app
export default function App() {
  //flights data store
  const [isFlightData, setIsFlightData] = useState(null); // api results
  const [routesData, setRoutesData] = useState(null); // api results
  const [airportsValue, setAirportsValue] = useState(
    'Select an incoming route'
  ); //ex: London Gatwick

  //covid data store
  const [c19Stat, setC19Stat] = useState('activePerOneMillion');
  const [c19Total, setC19Total] = useState('activePerOneMillion');
  const [currentC19List, setCurrentC19List] = useState({
    activePerOneMillion: 0,
    deathsPerOneMillion: 0,
    todayCases: 0,
    todayDeaths: 0,
  });
  //show hide data
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
      'activePerOneMillion',
      showActive1m,
      'activePerOneMillion',
      setCurrentC19List,
      currentC19List
    ),
    CovidRenderLayer(
      'deathsPerOneMillion',
      showDeaths1m,
      'deathsPerOneMillion',
      setCurrentC19List,
      currentC19List
    ),
    CovidRenderLayer(
      'todayCases',
      showCases,
      'todayCases',
      setCurrentC19List,
      currentC19List
    ),
    CovidRenderLayer(
      'todayDeaths',
      showDeaths,
      'todayDeaths',
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

  function getTooltip({ object }) {
    // return null if no matching valid objects to avoid crashing the app
    if (object) {
      //if airport icon or text object
      if (object.label) {
        return object && object.label;
      }
      //if a live flight
      else if (object[DATA_INDEX.CALL_SIGN]) {
        return (
          object &&
          `\
        Call Sign: ${object[DATA_INDEX.CALL_SIGN] || ''}
        Country of origin: ${object[DATA_INDEX.ORIGIN_COUNTRY] || ''}
        Vertical Rate: ${object[DATA_INDEX.VERTICAL_RATE] || 0} m/s
        Velocity: ${object[DATA_INDEX.VELOCITY] || 0} m/s
        Direction: ${object[DATA_INDEX.TRUE_TRACK] || 0}`
        );
      } //if a country covid layer
      else if (object.properties.NAME && object.properties.POP2005) {
        //import currdf from chart api call
        let cases = currDF.filter((each) => each[0] === object.properties.NAME);
        return (
          object &&
          `\
          ${object.properties.NAME} 
            Population: ${object.properties.POP2005} 
            ${cases} cases (${c19Stat})`
        );
      } else if (object.properties.NAME) {
        return object && object.properties.NAME;
      } else {
        return null;
      }
    }
  }

  return (
    <div>
      <div
        className={styles.menuBar}
        style={{ height: '50%', width: '100%', position: 'relative' }}
      >
        <AppTitles />
        <button className={styles.menuBtn} onClick={toggleMenu}>
          Toggle menu
        </button>
        <div
          className={styles.mobile}
          style={{
            display: showMenu ? 'flex' : 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <RoutesDropdown
              setRoutesData={setRoutesData}
              setIsFlightData={setIsFlightData}
              setViewState={setViewState}
              setAirportsValue={setAirportsValue}
              airportsValue={airportsValue}
            />
            <FlightInfoBar
              totalFlights={totalFlights}
              airportTotal={airportCount}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CovidDropdown
              setActive1m={setActive1m}
              setDeaths1m={setDeaths1m}
              setCases={setCases}
              setDeaths={setDeaths}
              setC19Stat={setC19Stat}
              setC19Total={setC19Total}
            />

            <C19Legend c19Total={c19Total} currentC19List={currentC19List} />
          </div>
        </div>
        <C19Btn c19Stat={c19Stat} />
        <FlightChartBtn isFlightData={isFlightData} />
        <SetMapBg setMapStyle={setMapStyle} currentMap={mapStyle} />

        <LoadingAnimation />
      </div>
      <div className={styles.controls}>Hold ctrl/cmd + drag for 3d view</div>

      <DeckGL
        style={{ height: '100vh', width: '100%', position: 'relative' }}
        layers={[layers]}
        viewState={viewState}
        onViewStateChange={(e) => setViewState(e.viewState)}
        controller={true}
        getTooltip={getTooltip}
      >
        <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
      </DeckGL>
    </div>
  );
}

export function renderToDOM(container) {
  render(<App />, container);
}
