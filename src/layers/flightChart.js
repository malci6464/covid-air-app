//charts
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";

export function FlightChart(props) {
  if (props.toFlightChart !== null) {
    let countSet = [];
    let res = Object.values(props.toFlightChart).forEach((each) =>
      countSet.push(each.count)
    );
    let nameSet = Object.keys(props.toFlightChart);

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
        categories: nameSet,
        title: {
          text: "Incoming airport: IATA code",
        },
      },
      series: [{ type: "column", data: countSet }],
    };

    return <HighchartsReact highcharts={Highcharts} options={optionsRoute} />;
  } else {
    return null;
  }
}
