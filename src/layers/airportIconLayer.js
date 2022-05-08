import { IconLayer } from "@deck.gl/layers";
import airportCodes from "../dataFiles/airportsDF.json";
import handleChange2 from "../app";

function convertCoordinates(inputEl) {
  let cos2 = inputEl.split(",");
  let long = parseFloat(cos2[0]);
  let lat = parseFloat(cos2[1]);
  return [long, lat];
}

export function parseAirports() {
  let airportsParsed = [];
  airportCodes.map((each) => {
    airportsParsed.push({
      location: convertCoordinates(each.coordinates),
      name: each.ident,
      label: each.name,
    });
  });
  return airportsParsed;
}

let airportIcon =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png";

export const airportIconLayerProps = {
  id: "icon",
  getIcon: (d) => "marker",
  sizeUnits: "meters",
  sizeScale: 1000,
  sizeMinPixels: 20,
  data: parseAirports(),
  pickable: true,
  getPosition: (d) => d.location,
  iconAtlas: airportIcon,
  iconMapping: {
    marker: {
      x: 0,
      y: 0,
      width: 128,
      height: 128,
      anchorY: 128,
      mask: true,
    },
  },
  //onClick: (d) => handleChange2(d.object.name), - this handled in main cmponent
  // iconAtlas,
  // iconMapping,
  //onHover: !hoverInfo.objects && setHoverInfo,
};
