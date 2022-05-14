//charts
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";

export function FlightChart(props) {
  console.log(props.toFlightChart);

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
      categories: props.toFlightChart[1],
      title: {
        text: "Incoming airport",
      },
      // labels: {
      //     format: '<a href="{link}">{text}</a>'
      // }
    },
    series: [{ type: "column", data: props.toFlightChart[0] }],
  };

  return <HighchartsReact highcharts={Highcharts} options={optionsRoute} />;
}
