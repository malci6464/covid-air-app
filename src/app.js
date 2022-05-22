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
import { FlightPositionLayer } from './layers/flightPositionLayer';
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
import { getTooltip } from './processing/tooltip';

// import components for render
import { LoadingAnimation } from './components/loading';
import { AppTitles } from './components/titles';
import { RoutesDropdown } from './components/routesDropdown';
import { CovidDropdown } from './components/covidDropdown';
import { C19Btn } from './components/c19ChartBtn';
import { FlightChartBtn } from './components/routesChartBtn';
import { SetMapBg } from './components/mapStyle';
import { FlightInfoBar } from './components/flightInfoBar';
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
  const [c19Stat, setC19Stat] = useState('active cases per milliom'); //init
  const [c19prop, setC19prop] = useState('activePerOneMillion'); //init
  const [currentC19Max, setCurrentC19Max] = useState({});
  const [globalDF, setGlobalDF] = useState();

  //map data store
  const [showMenu, setshowMenu] = useState(true);
  const [mapStyle, setMapStyle] = useState(MAP_STYLE_STD); //init
  const [viewState, setViewState] = useState({
    longitude: 10,
    latitude: 59,
    zoom: 4,
    maxZoom: 15,
    pitch: 30,
    bearing: 30,
  }); //camera data

  const layers = [
    FlightPositionLayer(),
    CovidRenderLayer(c19prop, setCurrentC19Max, setGlobalDF),
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
            <CovidDropdown setC19Stat={setC19Stat} setC19prop={setC19prop} />

            <C19Legend currentC19Max={currentC19Max > 0 ? currentC19Max : ''} />
          </div>
        </div>
        <C19Btn c19Stat={c19Stat} globalDF={globalDF} />
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
