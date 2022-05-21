import { GeoJsonLayer } from '@deck.gl/layers';
import { useState, useEffect } from 'react';
import euroGEO from '../dataFiles/europe.geojson';
import { europeanCountries } from '../dataFiles/countryList';

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

export function CovidRenderLayer(dataProp, show, setCurrentC19List) {
  //contains all state
  const [dataApi, setDataApi] = useState(null);
  const [resData, setResData] = useState(null);

  //contains max object
  const [maxC19, setMaxC19] = useState();

  //local vars
  let todayDeathsMax = 0;
  let todayCasesMax = 0;
  let activePerOneMillionMax = 0;
  let deathsPerOneMillionMax = 0;

  function defineMax(elem) {
    if (elem.todayDeaths > todayDeathsMax) {
      todayDeathsMax = elem.todayDeaths;
    }
    if (elem.todayCases > todayCasesMax) {
      todayCasesMax = elem.todayCases;
    }
    if (elem.activePerOneMillion > activePerOneMillionMax) {
      activePerOneMillionMax = elem.activePerOneMillion;
    }
    if (elem.deathsPerOneMillion > deathsPerOneMillionMax) {
      deathsPerOneMillionMax = elem.deathsPerOneMillion;
    }
  }

  async function build(apiResponse) {
    let masterdf = [];
    apiResponse.forEach((element) => {
      masterdf.push({
        country: element.country,
        todayDeaths: element.todayDeaths,
        todayCases: element.todayCases,
        activePerOneMillion: element.activePerOneMillion,
        deathsPerOneMillion: element.deathsPerOneMillion,
      });
      //create max
      defineMax(element);
    });

    // return
    setDataApi(masterdf);
    setMaxC19({
      todayDeathsMax: todayDeathsMax,
      todayCasesMax: todayCasesMax,
      activePerOneMillionMax: activePerOneMillionMax,
      deathsPerOneMillionMax: deathsPerOneMillionMax,
    });
    // callback for max list to be used in legend
    setCurrentC19List(maxC19);
  }

  useEffect(() => {
    //ensures call is made once
    if (resData === null) {
      fetch(C19_base)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp !== null) {
            build(resp);
            setResData(resp);
          }
        });
    }
  });

  // find country and assign RGB dependent on case count
  function getCountryId(val) {
    // // //val props name comes from geo json file - country comes from api response
    let res = dataApi.filter((each) => each.country === val.properties.NAME);
    if (res.length > 0) {
      //todo - make dyncamic - and reinstate max
      let countryTotal = res[0][dataProp]; //unwrap from array

      let maxProp = maxC19[`${dataProp}Max`]; //shortcut - append max to prop value
      let col = (countryTotal / maxProp) * 255;
      if (col > 255) {
        console.log('max eceeded', col);
        col = 255;
      }
      let colour = [Math.round(col), 0, 0];
      return colour;
    } else {
      return [0, 0, 0];
    }
  }

  const geoLayer = new GeoJsonLayer({
    id: dataProp,
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
    visible: show,
  });

  return geoLayer;
}
