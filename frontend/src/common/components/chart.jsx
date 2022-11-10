import React, { Component } from "react";
import Chart from "chart.js";
import { browserHistory, Link } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';


const getLineOptions = (type, data, labels, clickType) => {
  return {
    type: type,
    data: {
      datasets: [{
        data: data,
        fill: true,
        backgroundColor:'#E643F1',
        borderColor: '#fff'
       
      }],
      labels: labels
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      cutoutPercentage: 75,
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      onClick: (e) => {
        
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            const { index, datasetIndex } = tooltipItem;
            var label = data.datasets[datasetIndex].data[index] || '';
            // if (label) {
            //   label += ': ' + data.labels[index];
            // }
            return label;
          }
        }
      },
      scales: {
        xAxes: [{
          type: 'time',
          ticks: {
            fontSize: 16,
            fontColor: '#fff'
            },
          time: {
            unit: 'week'
          }
        }],
        yAxes: [{
         
          ticks: {
            fontSize: 16,
            fontColor: '#fff'
            },
         
        }]
      }
    }
  }
}

export default class PandoChart extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.doughnut = React.createRef();
    this.line = React.createRef();
    this.state = {

    };
  }
  static defaultProps = {
    includeDetails: true,
    truncate: 35,
  }
  componentDidMount() {
    const { chartType, labels, data, clickType } = this.props;
    const chartRef = chartType === 'line' ? this.line.current.getContext("2d") : this.doughnut.current.getContext("2d");
    const options = chartType === 'line' ? getLineOptions(chartType, data, labels, clickType) : this.getInitialOptions(chartType, data, labels, clickType);
    this.chart = new Chart(chartRef, options);
    Chart.defaults.global.defaultFontColor = '#8A8FB5';
    Chart.defaults.global.defaultFontFamily = 'Alwyn';
  }
  componentWillUpdate(nextProps) {
    if (nextProps.labels !== this.props.labels) {
      this.updateChart(this.chart, nextProps.labels, nextProps.data);
    }
  }
  getInitialOptions = (type, data, labels, clickType) => {
    return {
      type: type,
      data: {
        datasets: [{
          data: data,
          backgroundColor: [
            '#FF5CEA',
            '#8652C9',
            '#017CF8',
            '#0EC1E6',
            '#BAD930',
            '#FFE643',
            '#F7921E',
            '#F1424D',
            '#A5ACB9'
          ],
          borderWidth: 0
        }],
        labels: labels
      },
      options: {
        responsive: true,
        cutoutPercentage: 75,
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        onClick: (e) => {
          if (clickType === 'account') {
            var activeElement = this.chart.getElementAtEvent(e);
            if (activeElement.length > 0) {
              const address = this.chart.config.data.labels[activeElement[0]._index];
              if (address !== 'Rest Nodes') browserHistory.push(`/account/${address}`);
              return;
            }
          }
          if (clickType === 'stake') {
            browserHistory.push(`/stakes`);
          }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const { index, datasetIndex } = tooltipItem;
              if (type !== 'line') {
                var label = data.datasets[datasetIndex].data[index] || '';
                if (label) {
                  label += '% ' + data.labels[index];
                }
                return label;
              } else {
                var label = data.datasets[datasetIndex].data[index] || '';
                if (label) {
                  label += ': ' + data.labels[index];
                }
                return label;
              }
            }
          }
        }
      }
    }
  }
  updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
  }
  render() {
    const { chartType } = this.props;
    return (
      <div className={cx("chart", chartType)}>
        {chartType === 'doughnut' && <canvas ref={this.doughnut} className="canvas doughnut" />}
        {chartType === 'line' && <canvas ref={this.line} className="canvas line" />}
      </div>);
  }
}



