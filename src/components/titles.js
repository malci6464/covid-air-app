import React from "react";
import styles from "../buttons.module.css";

export function AppTitles() {
  return (
    <>
      {/* using fragments */}
      <h1 className={styles.def}>Covid-19 Air Traffic Dashboard</h1>
      <h3 className={styles.def}>Real time for Europe</h3>
    </>
  );
}
