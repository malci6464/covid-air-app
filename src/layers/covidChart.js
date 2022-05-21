//charts
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useState, useEffect } from 'react';
import { C19_base } from './covidRenderLayer';

export function CovidChart(props) {
  let deathsArr = [];
  let casesArr = [];
  let cases1mArr = [];
  let deaths1mArr = [];
  let labelSet = [];

  const [dataApi, setDataApi] = useState(null);
  const [labels, setLabels] = useState(labelSet);
  const [cases, setCases] = useState(casesArr);
  const [cases1m, setCases1m] = useState(cases1mArr);
  const [deaths, setDeaths] = useState(deathsArr);
  const [deaths1m, setDeaths1m] = useState(deaths1mArr);

  useEffect(() => {
    if (dataApi === null) {
      fetch(C19_base)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp !== null) {
            setDataApi(resp);
            //select elements
            resp.forEach((element) => {
              labels.push(element.country);
              deathsArr.push(element.todayDeaths);
              casesArr.push(element.todayCases);
              cases1mArr.push(element.activePerOneMillion);
              deaths1mArr.push(element.deathsPerOneMillion);
            });
            //push to store
            setLabels(labels);
            setCases(casesArr);
            setCases1m(cases1mArr);
            setDeaths(deathsArr);
            setDeaths1m(deaths1mArr);
          }
        });
    }
  });

  //select correct dataframe
  function getData() {
    if (props.caseType === 'Cases today') {
      return cases;
    }
    if (props.caseType === 'Deaths today') {
      return deaths;
    }
    if (
      props.caseType === 'activePerOneMillion' ||
      props.caseType === 'Active cases per million'
    ) {
      return cases1m;
    }
    if (props.caseType === 'Deaths per million') {
      return deaths1m;
    }
  }

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
    series: [{ type: 'column', data: getData() }],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
