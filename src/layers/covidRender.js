import { GeoJsonLayer } from "@deck.gl/layers";
import { scaleLinear } from "d3-scale";
import { c19max, c19min } from "./covidLayer";

// find country and assign RGB dependent on case count
export async function getCountryId(val, data) {
  let country = val.properties.NAME;
  let cs = 0;
  data.map((each) => (each.country === country ? (cs = each.cases) : ""));
  return c19Scale(cs);
}

const c19Scale = scaleLinear()
  .domain([0, c19max])
  .range([
    [0, 0, 0], // <= the lightest shade we want
    [255, 0, 0], //dark red
  ]);

export const geoLayerProps = {
  id: "geojson",

  opacity: 0.4,
  stroked: false,
  filled: true,
  extruded: true,
  wireframe: true,
  // getFillColor: (f) => getCountryId(f, data), //colour defined by covid levels
  getLineColor: [255, 255, 255],
  getPolygonOffset: (f) => [222, 22],
  pickable: true,
};
