import React from "react";
import styles from "../buttons.module.css";

export function C19Legend(props) {
  return (
    <>
      <p className={styles.wrapper}>Covid-19 colour legend</p>
      <div className={styles.wrapper}>
        <span className={styles.progress}></span>
      </div>
      <div className={styles.flex}>
        <p className={styles.def}>Min cases</p>
        <p className={styles.def}>
          Max cases {props.currentC19List[props.c19Total]}
        </p>
        <p
          style={{
            display: props.currentC19List[props.c19Total] > 0 ? "none" : "",
          }}
        >
          {" "}
          *** Unfortunately no data has been registered for today in Europe
        </p>
      </div>
    </>
  );
}
