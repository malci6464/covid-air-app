//charts
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CovidData } from "./covidLayer";
import React, { useState } from "react";

let hcdata = [];
let hclabels = [];

const covidLocal = localStorage.getItem("covid");
const currentCovidData = JSON.parse(covidLocal);

Object.values(currentCovidData).forEach(
  (each) => hcdata.push(each.cases) && hclabels.push(each.country)
);
//highlight current country
//re order bar chart maybe?
const options = {
  title: {
    text: "Covid Data",
  },
  yAxis: {
    title: {
      text: "Cases per million people",
    },
  },
  legend: {
    enabled: false,
  },
  xAxis: {
    categories: hclabels,

    // labels: {
    //     format: '<a href="{link}">{text}</a>'
    // }
  },
  series: [{ type: "column", data: hcdata }],
};
export function CovidChart() {
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
