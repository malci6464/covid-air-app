import React from "react";
import { apiLoading } from "../layers/flightPositionLayer";
import { loading } from "../processing/createRoutes";
import styles from "../buttons.module.css";

export function LoadingAnimation() {
  return (
    <div
      style={{
        maxWidth: 1600,
        maxHeight: 200,
        display: loading || apiLoading ? "block" : "none",
      }}
    >
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>{" "}
      <p
        style={{
          display: loading ? "block" : "none",
        }}
      >
        Flight route data loading from api
      </p>
      <p
        style={{
          display: apiLoading ? "block" : "none",
        }}
      >
        Live flight locations loading from api <br></br> Zoom in close to see
        animation
      </p>
    </div>
  );
}
