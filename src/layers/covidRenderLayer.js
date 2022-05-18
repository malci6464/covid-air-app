import { GeoJsonLayer } from "@deck.gl/layers";
import { scaleLinear } from "d3-scale";
import { useState, useEffect } from "react";
import euroGEO from "../dataFiles/europe.geojson";
import { europeanCountries } from "../dataFiles/countryList";

//use to build dropdown
export let listOfC19Stats = {
  activePerOneMillion: "Active cases per million",
  deathsPerOneMillion: "Deaths per million",
  todayCases: "Cases today",
  todayDeaths: "Deaths today",
};

// full list of other possible props to use
let listOfC19StatsFull = {
  active: "Active cases",
  activePerOneMillion: "Active cases per million",
  cases: "Cumulative cases",
  casesPerOneMillion: "Cumulative per million",
  critical: "Currently critical",
  criticalPerOneMillion: "Critical per million",
  deaths: "Cumulative deaths",
  deathsPerOneMillion: "Deaths per million",
  recovered: "Recovered cases",
  recoveredPerOneMillion: "Recovered cases per million",
  tests: "Tests taken total",
  testsPerOneMillion: "Tests taken per million",
  todayCases: "Cases today",
  todayDeaths: "Deaths today",
  todayRecovered: "Recovered today",
};

//used for easy parsing of object
export const c19Keys = Object.keys(listOfC19Stats);

//add all countries as param to api call endpoint
let clist = "";
europeanCountries.forEach((each) => (clist = clist + each + ","));
// novel covid api base endpoint
export const C19_base = `https://corona.lmao.ninja/v2/countries/${clist}?yesterday`;

export function CovidRenderLayer(props, show, newId) {
  const [dataApi, setDataApi] = useState(null);
  const [currentC19, setcurrentC19] = useState(null);
  const [selected, setSelected] = useState("activePerOneMillion");
  const [activeState, setActivestate] = useState(false);

  //definitions for colour scaling
  let c19max = 10000; //raw default
  let c19min = 0; //not updated

  function getMax(data) {
    const amounts = data.map((each) => each[props]);
    c19max = Math.max(...amounts);
    setActivestate(true);
  }

  // find country and assign RGB dependent on case count
  async function getCountryId(caseType, data) {
    await data.map((each) => (each.fillC = getColour(each[caseType])));
    setDataApi(data);
  }

  function getColour(cases) {
    //todo - make dyncamic - and reinstate max
    let col = (cases / c19max) * 255;
    console.log("col", cases / c19max);
    if (col > 255) {
      col = 255;
    }
    let colour = [Math.round(col), 0, 0];
    console.log(colour);
    return colour;
  }
  // find country and assign RGB dependent on case count
  function getCountryId2(val, caseType) {
    let res = dataApi.filter((each) => each.country === val.properties.NAME);

    if (res.length > 0) {
      //todo - make dyncamic - and reinstate max
      let country = res[0][caseType];
      let col = (country / c19max) * 255;
      if (col > 255) {
        col = 255;
      }
      let colour = [Math.round(col), 0, 0];
      return colour;
    } else {
      //null colour
      return [0, 0, 0];
    }
  }

  useEffect(() => {
    if (dataApi === null) {
      fetch(C19_base)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp !== null) {
            //console.log(resp);
            setDataApi(resp);
            getMax(resp);
            getCountryId(props, resp);
          }
        });
    }
  });

  const geoLayer = new GeoJsonLayer({
    id: newId,
    data: euroGEO,
    opacity: 0.4,
    stroked: false,
    filled: true,
    extruded: true,
    wireframe: true,
    getFillColor: (f) => getCountryId2(f, props), //colour defined by covid levels
    getLineColor: [255, 255, 255],
    getPolygonOffset: (f) => [222, 22],
    pickable: true,
    visible: show,
  });

  return geoLayer;
}
