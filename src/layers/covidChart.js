//charts
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useState, useEffect } from 'react';

export let currDFTooltip = null;
export let caseType = null;

export function CovidChart(props) {
  const [labels, setLabels] = useState();
  const [currData, setCurrData] = useState();

  useEffect(() => {
    let df = [];
    let names = [];
    props.globalDF.forEach((each) => {
      names.push(each.country);
      df.push(each.cases);
    });
    setLabels(names); // for axis titles
    setCurrData(df); // set data
    currDFTooltip = props.globalDF; // fro tooltip
    caseType = props.caseType;
  }, [props.globalDF, props.caseType]);

  //highlight with colour and re-order potentially
  const options = {
    title: {
      text: 'Covid Data',
    },
    yAxis: {
      title: {
        text: props.caseType,
      },
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      categories: labels,
      labels: {
        //prevent long labels
        formatter: function () {
          return this.value.slice(0, 10);
        },
      },
    },
    series: [{ type: 'column', data: currData }],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
