//charts
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";

function getFlightData() {
  const flightsLocal = localStorage.getItem("flights");
  if (flightsLocal) {
    const currentFlightCount = JSON.parse(flightsLocal);
    let HCflightsData = [];
    Object.values(currentFlightCount).forEach((each) =>
      HCflightsData.push(each.count)
    );

    return HCflightsData;
  }
}

function getFlightLabels() {
  let HCflightsLabels = [];
  const flightsLocal = localStorage.getItem("flights");
  if (flightsLocal) {
    const currentFlightCount = JSON.parse(flightsLocal);
    Object.keys(currentFlightCount).forEach((each) =>
      HCflightsLabels.push(each)
    );

    return HCflightsLabels;
  }
}

const optionsRoute = {
  title: {
    text: "Route Data",
  },
  legend: {
    enabled: false,
  },
  yAxis: {
    title: {
      text: "Flight count in last 7 days",
    },
  },
  xAxis: {
    categories: getFlightLabels(),
    title: {
      text: "Incoming airport",
    },
    // labels: {
    //     format: '<a href="{link}">{text}</a>'
    // }
  },
  series: [{ type: "column", data: getFlightData() }],
};

export function FlightChart() {
  return <HighchartsReact highcharts={Highcharts} options={optionsRoute} />;
}
