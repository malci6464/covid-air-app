import { GeoJsonLayer } from '@deck.gl/layers';
import { useState, useEffect } from 'react';
import euroGEO from '../dataFiles/europe.geojson';
import { europeanCountries } from '../dataFiles/countryList';
import c19mock from '../dataFiles/covidResponse.json';

//export let countryCount = 0;

//use to build dropdown
export let listOfC19Stats = {
  activePerOneMillion: 'Active cases per million',
  deathsPerOneMillion: 'Deaths per million',
  todayCases: 'Cases today',
  todayDeaths: 'Deaths today',
};

// full list of other possible props to use
// let listOfC19StatsFull = {
//   active: "Active cases",
//   activePerOneMillion: "Active cases per million",
//   cases: "Cumulative cases",
//   casesPerOneMillion: "Cumulative per million",
//   critical: "Currently critical",
//   criticalPerOneMillion: "Critical per million",
//   deaths: "Cumulative deaths",
//   deathsPerOneMillion: "Deaths per million",
//   recovered: "Recovered cases",
//   recoveredPerOneMillion: "Recovered cases per million",
//   tests: "Tests taken total",
//   testsPerOneMillion: "Tests taken per million",
//   todayCases: "Cases today",
//   todayDeaths: "Deaths today",
//   todayRecovered: "Recovered today",
// };

//used for easy parsing of object
export const c19Keys = Object.keys(listOfC19Stats);

//add all countries as param to api call endpoint
let clist = '';
europeanCountries.forEach((each) => (clist = clist + each + ','));
// novel covid api base endpoint
export const C19_base = `https://corona.lmao.ninja/v2/countries/${clist}?yesterday`;

export let c19loading = false;

export function CovidRenderLayer(c19prop, setCurrentC19Max, setGlobalDF) {
  //contains all state
  const [dataApi, setDataApi] = useState(null); // filtered res
  const [localMax, setLocalMax] = useState(null);
  const [prevProp, setPrevProp] = useState(null);
  const [mainDF, setDF] = useState(null); // api res

  function buildData(resp) {
    let max = 0;
    let masterdf = [];
    resp.forEach((element) => {
      masterdf.push({
        country: element.country,
        cases: Math.round(element[c19prop]),
      });
      if (element[c19prop] > max) {
        max = element[c19prop];
      }
    });
    setDataApi(masterdf); // set new dfx
    setLocalMax(max); //internal component ref
    setCurrentC19Max(max); //send to main
    setGlobalDF(masterdf); //send to main
    return max;
  }
  // set to true to use stored response from may 2022
  let test = false;
  useEffect(() => {
    if (dataApi && prevProp !== c19prop) {
      setPrevProp(c19prop);
      buildData(mainDF);
    }
    //ensures call is made once
    else if (test) {
      buildData(c19mock);
      setPrevProp(c19prop);
      setDF(c19mock);
    } else if (dataApi === null) {
      c19loading = true;
      fetch(C19_base)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp !== null) {
            buildData(resp);
            setPrevProp(c19prop);
            setDF(resp);
          }
        });
    }
    return () => {
      //cancel loading animation if error
      c19loading = false;
    };
  }, [prevProp, c19prop]);

  // find country and assign RGB dependent on case count
  function getCountryId(val) {
    // // //val props name comes from geo json file - country comes from api response
    if (dataApi) {
      let res = dataApi.filter((each) => each.country === val.properties.NAME);
      if (res.length > 0) {
        //todo - make dyncamic - and reinstate max
        let countryTotal = res[0]['cases']; //unwrap from array
        //let maxProp = localMax; //`${dataProp}Max`; //shortcut - append max to prop value
        let col = (countryTotal / localMax) * 255;
        if (col > 255) {
          col = 255;
        }
        let colour = [Math.round(col), 0, 0];
        return colour;
      } else {
        return [0, 0, 0];
      }
    }
  }

  const geoLayer = new GeoJsonLayer({
    id: c19prop,
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

  return geoLayer;
}
