import { useState, useEffect } from 'react';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';

const DATA_URL_AIR = 'https://opensky-network.org/api/states/all';
const MODEL_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb';
const REFRESH_TIME = 10000;

const ANIMATIONS = {
  '*': { speed: 1 },
};

export let apiLoading = false;

//possible response data from api per flight
export const DATA_INDEX = {
  UNIQUE_ID: 0,
  CALL_SIGN: 1,
  ORIGIN_COUNTRY: 2,
  LONGITUDE: 5,
  LATITUDE: 6,
  BARO_ALTITUDE: 7,
  VELOCITY: 9,
  TRUE_TRACK: 10,
  VERTICAL_RATE: 11,
  GEO_ALTITUDE: 13,
  POSITION_SOURCE: 16,
};

export function verticalRateToAngle(object) {
  // Return: -90 looking up, +90 looking down
  const verticalRate = object[DATA_INDEX.VERTICAL_RATE] || 0;
  const velocity = object[DATA_INDEX.VELOCITY] || 0;
  return (-Math.atan2(verticalRate, velocity) * 180) / Math.PI;
}

export function FlightPositionLayer() {
  //scenegraph data
  const [data, setData] = useState(null);
  const [timer, setTimer] = useState({});

  //defined bounding box over europe
  function bboxCheck(cords) {
    //relies on [ long/lat ] format
    let temp = null;
    if (cords[0] > -35 && cords[0] < 45 && cords[1] < 72 && cords[1] > 34) {
      temp = true;
    } else {
      temp = false;
    }
    return temp;
  }

  useEffect(() => {
    if (data === null) {
      //only show spinner on first load
      apiLoading = true;
    }
    fetch(DATA_URL_AIR)
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp && resp.states && timer.id !== null) {
          // In order to keep the animation smooth we need to always return the same
          // objects in the exact same order
          let sortedData = resp.states;
          //filter for europe
          let filterres = sortedData.filter(
            (each) =>
              bboxCheck([
                each[DATA_INDEX.LONGITUDE],
                each[DATA_INDEX.LATITUDE],
              ]) === true
          );
          if (data) {
            // reformat
            const dataAsObj = {};
            //create values lookup
            filterres.forEach(
              (entry) => (dataAsObj[entry[DATA_INDEX.UNIQUE_ID]] = entry)
            );
            //define ordering
            filterres = data.map(
              (entry) => dataAsObj[entry[DATA_INDEX.UNIQUE_ID]] || entry
            );
          }
          apiLoading = false;
          setData(filterres);
        }
      })
      .finally(() => {
        //call the api again
        timer.nextTimeoutId = setTimeout(
          () => setTimer({ id: timer.nextTimeoutId }),
          REFRESH_TIME
        );
      });

    return () => {
      clearTimeout(timer.nextTimeoutId);
      timer.id = null;
      //cancel loading animation if error
      apiLoading = false;
    };
  }, [timer]);

  const flightLayerProps = new ScenegraphLayer({
    id: 'scenegraph-layer',
    data: data,
    pickable: true,
    sizeScale: 35,
    scenegraph: MODEL_URL,
    _animations: ANIMATIONS,
    sizeMinPixels: 0.2,
    sizeMaxPixels: 0.7,
    getPosition: (d) => [
      d[DATA_INDEX.LONGITUDE] || 0,
      d[DATA_INDEX.LATITUDE] || 0,
      d[DATA_INDEX.GEO_ALTITUDE] || 0,
    ],
    getOrientation: (d) => [
      verticalRateToAngle(d),
      -d[DATA_INDEX.TRUE_TRACK] || 0,
      90,
    ],
    transitions: {
      getPosition: 10000,
    },
  });
  return flightLayerProps;
}
