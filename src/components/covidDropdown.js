import React, { useState } from 'react';
import styles from '../buttons.module.css';
import { c19KeysFull, listOfC19StatsFull } from '../layers/covidRenderLayer';

export function CovidDropdown(props) {
  const [covidValue, setCovidValue] = useState('activePerOneMillion');

  function handleCovidChange(eventVal) {
    for (const [key, value] of Object.entries(listOfC19StatsFull)) {
      if (value === eventVal.target.value) {
        setCovidValue(value); //set current selected for dropdwon
        props.setC19Stat(value); // for chart selector prop - pretty printed
        props.setC19prop(key); // prop vlaue for use in funcs
      }
    }
  }

  return (
    <form style={{ paddingBottom: '6px' }}>
      <div className={styles.def}>Select Covid-19 statistic</div>
      <select value={covidValue} onChange={handleCovidChange}>
        {c19KeysFull.map((keyVal) => (
          <option
            key={listOfC19StatsFull[keyVal]}
            value={listOfC19StatsFull[keyVal]}
          >
            {listOfC19StatsFull[keyVal]}
          </option>
        ))}
      </select>
    </form>
  );
}
