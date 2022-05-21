import { DATA_INDEX } from '../layers/flightPositionLayer';
import { currDFTooltip, titleTooltip } from '../layers/covidChart';

export function getTooltip({ object }) {
  // return null if no matching valid objects to avoid crashing the app
  if (object) {
    //if airport icon or text object
    if (object.label !== undefined) {
      return object && object.label;
    }
    //if a live flight
    else if (object[DATA_INDEX.CALL_SIGN] !== undefined) {
      return (
        object &&
        `\
      Call Sign: ${object[DATA_INDEX.CALL_SIGN] || ''}
      Country of origin: ${object[DATA_INDEX.ORIGIN_COUNTRY] || ''}
      Vertical Rate: ${object[DATA_INDEX.VERTICAL_RATE] || 0} m/s
      Velocity: ${object[DATA_INDEX.VELOCITY] || 0} m/s
      Direction: ${object[DATA_INDEX.TRUE_TRACK] || 0}`
      );
    } //if a country covid layer
    else if (
      object.properties.NAME !== undefined &&
      object.properties.POP2005 !== undefined
    ) {
      //import currdf from chart api call
      let cases = currDFTooltip.filter(
        (each) => each[0] === object.properties.NAME
      );
      return (
        object &&
        `\
        ${object.properties.NAME} 
          Population: ${object.properties.POP2005} 
          ${cases} cases - ${titleTooltip}`
      );
    } else if (object.properties.NAME !== undefined) {
      return object && object.properties.NAME;
    } else {
      return null;
    }
  }
}
