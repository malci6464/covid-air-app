import React, { useState } from "react";
import styles from "../buttons.module.css";
import { FlightChart } from "../layers/flightChart";

export function FlightChartBtn(props) {
  const [showHCroutes, setshowHCroutes] = useState(false);
  const handleshowHCroutes = () => setshowHCroutes(!showHCroutes);

  return (
    <>
      <button className={styles.btn} onClick={handleshowHCroutes}>
        Routes Chart
      </button>
      <div
        style={{
          maxWidth: 1400,
          maxHeight: 800,
          display: showHCroutes ? "block" : "none",
        }}
      >
        <FlightChart toFlightChart={props.isFlightData} />
      </div>
    </>
  );
}
