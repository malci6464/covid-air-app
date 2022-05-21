import { parseAirports } from './airportIconLayer';
export const airportTextLayerProps = {
  id: 'text-layer',
  data: parseAirports(),
  pickable: true,
  getPosition: (d) => d.location,
  getText: (d) => d.label,
  getSize: 10,
  getPixelOffset: [4, 14],
  getAngle: 0,
  getTextAnchor: 'middle',
  getAlignmentBaseline: 'center',
};
