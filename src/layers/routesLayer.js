import { maxFlightCount } from "../processing/createRoutes";
import { scaleLinear } from "d3-scale";

const flightRouteScale = scaleLinear()
  .domain([0, 50])
  .range([
    [152, 251, 152], // <= the lightest shade we want
    [255, 127, 0],
  ]);

function getArcSize(countVal) {
  let maxThickness = 6;
  let minThickness = 1;
  let perc = countVal / maxFlightCount;
  let res = perc * maxThickness;
  return res > minThickness ? res : minThickness;
}

export const flightArcsProps = {
  id: "arc-layer",
  //data: routesData,//comes from main component
  pickable: true,
  getWidth: (d) => getArcSize(d.count),
  getSourcePosition: (d) => d.from.coordinates,
  getTargetPosition: (d) => d.to.coordinates,
  getSourceColor: (d) => flightRouteScale(d.count),
  getTargetColor: (d) => flightRouteScale(d.count),
};
