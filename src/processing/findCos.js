import airportCodes from "../dataFiles/airportsDF.json";
import { FlyToInterpolator } from "deck.gl";

export function findAirCos(input) {
  //consider more than one match? - overwrite as failsafe
  let cos;
  airportCodes.map((each) =>
    each.ident === input ? (cos = each.coordinates) : ""
  );
  if (cos !== undefined) {
    return moveView(cos);
  }
}

function moveView(cords) {
  let parsedCord = convertCoordinates(cords);
  let newView = {
    longitude: parsedCord[0],
    latitude: parsedCord[1],
    zoom: 4,
    pitch: getRandomInt(30),
    bearing: getRandomInt(30),
    transitionDuration: 2000,
    transitionInterpolator: new FlyToInterpolator(),
  }; //for flytolocation
  return newView;
}

function convertCoordinates(input) {
  let cos2 = input.split(",");
  let long = parseFloat(cos2[0]);
  let lat = parseFloat(cos2[1]);
  return [long, lat];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
