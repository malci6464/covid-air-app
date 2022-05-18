import React, { useState } from "react";
import styles from "../buttons.module.css";
import { c19Keys, listOfC19Stats } from "../layers/covidRenderLayer";

export function CovidDropdown({
  setActive1m,
  setDeaths1m,
  setCases,
  setDeaths,
  setC19Stat,
}) {
  const [covidValue, setCovidValue] = useState("activePerOneMillion");

  function handleCovidChange(eventVal) {
    for (const [key, value] of Object.entries(listOfC19Stats)) {
      if (value === eventVal.target.value) {
        setCovidValue(value); //set current selected for dropdwon
        setC19Stat(value); // for chart selector prop
        //set state for layers
        key === "activePerOneMillion" ? setActive1m(true) : setActive1m(false);
        key === "deathsPerOneMillion" ? setDeaths1m(true) : setDeaths1m(false);
        key === "todayCases" ? setCases(true) : setCases(false);
        key === "todayDeaths" ? setDeaths(true) : setDeaths(false);
        //props sent to single chart instance
      }
    }
  }

  return (
    <form>
      <label className={styles.def}>
        Select Covid-19 statistic
        <select value={covidValue} onChange={handleCovidChange}>
          {c19Keys.map((keyVal) => (
            <option key={listOfC19Stats[keyVal]} value={listOfC19Stats[keyVal]}>
              {listOfC19Stats[keyVal]}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
