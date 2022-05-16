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

//definitions for colour scaling
export let c19max = 0; //raw default
export let c19min = 0; //not updated

//filer vars
let apiCallCount = 0;
export let res = null;
export let c19data = [];

//add all countries as param to api call endpoint
let clist = "";
europeanCountries.forEach((each) => (clist = clist + each + ","));
// novel covid api base endpoint
const C19_base = `https://corona.lmao.ninja/v2/countries/${clist}?yesterday`;

export function selectData(inputVal) {
  //select cases data
  res.forEach((each) =>
    c19data.push({ country: each.country, cases: each[inputVal] })
  );
  //set max
  getMaxMin();
  return c19data;
}

function getMaxMin() {
  c19data.forEach((each) => (each.cases > c19max ? (c19max = each.cases) : ""));
}

//callCovidApi()
//selectData(val)
//getMaxMin

export async function callCovidApi() {
  if (apiCallCount === 0) {
    //call api
    await fetch(C19_base)
      .then((response) => response.json())
      .then((data) => (res = data));
    apiCallCount++;
    return res;
  } else {
    return res;
  }
}
