import React, { useState } from "react";
import styles from "../buttons.module.css";
import { MAP_STYLE_DARK, MAP_STYLE_STD } from "../dataFiles/mapStyles";

export function SetMapBg({ setMapStyle, currentMap }) {
  function handleMapChange() {
    if (currentMap === MAP_STYLE_DARK) {
      return setMapStyle(MAP_STYLE_STD);
    } else {
      return setMapStyle(MAP_STYLE_DARK);
    }
  }

  return (
    <button className={styles.btn} onClick={handleMapChange}>
      Dark / light mode
    </button>
  );
}
