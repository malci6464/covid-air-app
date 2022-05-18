import React, { useState } from "react";
import styles from "../buttons.module.css";
import { CovidChart } from "../layers/covidChart";

export function C19Btn(props) {
  const [showHCcovid, setshowHCcovid] = useState(false);
  const handleshowHCcovid = () => setshowHCcovid(!showHCcovid);

  return (
    <>
      <button className={styles.btn} onClick={handleshowHCcovid}>
        Covid Chart
      </button>
      <div
        style={{
          maxWidth: 1400,
          maxHeight: 800,
          display: showHCcovid ? "block" : "none",
        }}
      >
        <CovidChart caseType={props.c19Stat} />
      </div>
    </>
  );
}
