import React, { useState } from "react";
import styles from "../buttons.module.css";
import airportCodes from "../dataFiles/airportsDF.json";
import osloDemo from "../dataFiles/OSL.json";
import {
  createRoutes,
  fetchRoutes,
  maxFlightCount,
  airportCount,
  loading,
} from "../processing/createRoutes";
import { findAirCos } from "../processing/findCos";

export function RoutesDropdown({
  setRoutesData,
  setIsFlightData,
  setViewState,
}) {
  const [airportsValue, setAirportsValue] = useState(
    "Select an incoming route"
  ); //ex: London Gatwick
  const [newRoutesData, setNewRoutesData] = useState(null);
  // console.log(newRoute);
  //handles dropdown arg - routes
  async function handleChange(event) {
    await buildDF(event.target.value);
  }

  async function buildDF(airportVal) {
    setAirportsValue(airportVal);
    // Routes;
    let [fetch, flightChart] = await fetchRoutes(airportVal);
    let simplifiedRoutes = await createRoutes(fetch, airportVal);
    setRoutesData(simplifiedRoutes);
    // setRoutesData(osloDemo);

    //build chart data
    setIsFlightData(flightChart); //pass as prop to  flight chart
    // get co-oridnates
    let res2 = findAirCos(airportVal);
    // //move camera view
    setViewState(res2);
  }

  // build dropdown
  let airportOptions = [];
  for (var i = 0; i < airportCodes.length; i++) {
    airportOptions.push({
      label: airportCodes[i].name,
      value: airportCodes[i].ident,
    });
  }

  return (
    <form>
      <label className={styles.def}>
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
  );
}
