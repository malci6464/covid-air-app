import { DATA_INDEX } from '../layers/flightPositionLayer';
import { currDFTooltip, titleTooltip } from '../layers/covidChart';
import airportCodes from '../dataFiles/airportsDF.json';

export function getTooltip({ object }) {
  if (object) {
    //if airport icon or text object
    if (object.label !== undefined) {
      return object && object.label;
    }
    //if a live flight
    // object[DATA_INDEX.CALL_SIGN] !== undefined &&
    // object[DATA_INDEX.ORIGIN_COUNTRY] !== undefined &&
    // object[DATA_INDEX.VERTICAL_RATE] !== undefined &&
    // object[DATA_INDEX.VELOCITY] !== undefined &&
    // object[DATA_INDEX.TRUE_TRACK] !== undefined
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
    } else if (object.count !== undefined) {
      let airportName = airportCodes.filter(
        (each) => each.ident === object.from.name
      );
      if (airportName.length > 0) {
        let airport = airportName[0].hasOwnProperty('name')
          ? airportName[0].name
          : airportName[0].ident;
        return (
          object &&
          `\
        ${object.count} flights incoming
        from ${airport} in the 
        previous 7 days`
        );
      } else {
        return (
          object &&
          `\
          ${object.count} flights incoming
          from in the previous 7 days`
        );
      }
    }
    //if a country covid layer
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
    } else {
      return object;
    }
  }
}
