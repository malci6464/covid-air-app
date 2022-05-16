import { GeoJsonLayer } from "@deck.gl/layers";
import { scaleLinear } from "d3-scale";
import { useState, useEffect } from "react";
import euroGEO from "../dataFiles/europe.geojson";
import { europeanCountries } from "../dataFiles/countryList";

//use to build dropdown
export let listOfC19Stats = {
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

export function CovidRenderLayer() {
  const [dataApi, setDataApi] = useState(null);
  const [currentC19, setcurrentC19] = useState(null);
  const [selected, setSelected] = useState("activePerOneMillion");
  const [timer, setTimer] = useState({});

  //definitions for colour scaling
  let c19max = 10000; //raw default
  let c19min = 0; //not updated

  //func that recieves prop

  async function selectData(inputD) {
    //select cases data
    let data = [];
    inputD.forEach((each) =>
      data.push({ country: each.country, cases: each[selected] })
    );

    await data.forEach(
      (each) => (each.fill = [(each.cases / c19max) * 255, 0, 0])
    );
    setcurrentC19(data);
    //set max
    //data.forEach((each) => (each.cases > c19max ? (c19max = each.cases) : ""));
    //change flag - layer ready
    return data;
  }

  // find country and assign RGB dependent on case count
  function getCountryId(val) {
    // let country = val.properties.NAME;
    // let cs = 0;
    // currentC19.map((each) =>
    //   each.country === country ? (cs = each.cases) : ""
    // );

    let res = dataApi.filter((each) => each.country === val.properties.NAME);
    if (res.length > 0) {
      let country = res[0].activePerOneMillion;
      console.log(country);
      let col = (country / c19max) * 255;
      if (col > 255) {
        col = 255;
      }
      let colour = [Math.round(col), 0, 0];
      console.log(colour);
      return colour;
    } else {
      return [255, 0, 0];
    }
    // console.log(cs, c19max);
    // console.log(c19Scale(cs));
    // return c19Scale(cs);
    // let p = (cs / c19max) * 255;
    // console.log(p);
    // return [255, 0, 0];
  }

  const c19Scale = scaleLinear()
    .domain([0, c19max])
    .range([
      [0, 0, 0], // <= the lightest shade we want
      [255, 0, 0], //dark red
    ]);

  // async function callCovidApi() {
  //   if (apiCallCount === 0) {
  //     //call api
  //     await fetch(C19_base)
  //       .then((response) => response.json())
  //       .then((data) => setDataApi(data));
  //     apiCallCount++;
  //   }
  // }

  useEffect(() => {
    fetch(C19_base)
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp !== null) {
          //console.log(resp);
          setDataApi(resp);
          selectData(resp);
        }
      })
      .finally(() => {
        timer.nextTimeoutId = setTimeout(
          () => setTimer({ id: timer.nextTimeoutId }),
          3000
        );
      });

    return () => {
      clearTimeout(timer.nextTimeoutId);
      timer.id = null;
    };
  }, [timer]);

  const geoLayer = new GeoJsonLayer({
    id: "geojson",
    data: euroGEO,
    opacity: 0.4,
    stroked: false,
    filled: true,
    extruded: true,
    wireframe: true,
    getFillColor: (f) => getCountryId(f), //colour defined by covid levels
    // getFillColor: (f) => getCountryId(f), //colour defined by covid levels
    getLineColor: [255, 255, 255],
    getPolygonOffset: (f) => [222, 22],
    pickable: true,
  });

  return geoLayer;
}
