import React, { useState } from 'react';
import styles from '../buttons.module.css';
import { c19Keys, listOfC19Stats } from '../layers/covidRenderLayer';

export function CovidDropdown(
  // setActive1m,
  // setDeaths1m,
  // setCases,
  // setDeaths,
  // setC19Stat,
  // c19Stat,
  // setC19prop,
  props
) {
  const [covidValue, setCovidValue] = useState('activePerOneMillion');

  function handleCovidChange(eventVal) {
    for (const [key, value] of Object.entries(listOfC19Stats)) {
      if (value === eventVal.target.value) {
        setCovidValue(value); //set current selected for dropdwon
        props.setC19Stat(value); // for chart selector prop - pretty printed
        props.setC19prop(key); // prop vlaue for use in funcs
        //set state for layers
        // key === 'activePerOneMillion' ? setActive1m(true) : setActive1m(false);
        // key === 'deathsPerOneMillion' ? setDeaths1m(true) : setDeaths1m(false);
        // key === 'todayCases' ? setCases(true) : setCases(false);
        // key === 'todayDeaths' ? setDeaths(true) : setDeaths(false);
        //props sent to single chart instance
      }
    }
  }

  return (
    <form style={{ paddingBottom: '6px' }}>
      <div className={styles.def}>Select Covid-19 statistic</div>
      <select value={covidValue} onChange={handleCovidChange}>
        {/* <option key={'init'} value={'Choose a case type'}>
          {c19Stat}
        </option> */}
        {c19Keys.map((keyVal) => (
          <option key={listOfC19Stats[keyVal]} value={listOfC19Stats[keyVal]}>
            {listOfC19Stats[keyVal]}
          </option>
        ))}
      </select>
    </form>
  );
}
