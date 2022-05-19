import React, { useState } from "react";
import styles from "../buttons.module.css";

export function FlightInfoBar(props) {
  return (
    <p className={styles.def} style={{ paddingBottom: "6px" }}>
      {props.totalFlights > 0
        ? "A total of " +
          props.totalFlights +
          " incoming flights from " +
          props.airportTotal +
          " different airports in the last 7 days"
        : "No flights available -  Please select another airport! "}
    </p>
  );
}
