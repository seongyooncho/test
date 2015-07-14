"use strict";

export default class {
  constructor(lbnChart) {
    this.lbnData_ = lbnChart;

    this.data_ = [];
    for (let lbnChartData of lbnChart) {
      let colors = [ 
        "rgba(66,139,202,1)",
        "rgba(92,184,92,1)",
        "rgba(91,192,222,1)",
        "rgba(240,173,78,1)",
        "rgba(217,83,79,1)",
        "rgba(66,139,202,1)",
        "rgba(92,184,92,1)",
        "rgba(91,192,222,1)",
        "rgba(240,173,78,1)",
        "rgba(217,83,79,1)",
      ];
      let colorsLight = [ 
        "rgba(66,139,202,0.2)",
        "rgba(92,184,92,0.2)",
        "rgba(91,192,222,0.2)",
        "rgba(240,173,78,0.2)",
        "rgba(217,83,79,0.2)",
        "rgba(66,139,202,0.2)",
        "rgba(92,184,92,0.2)",
        "rgba(91,192,222,0.2)",
        "rgba(240,173,78,0.2)",
        "rgba(217,83,79,0.2)",
      ];

      let datum = {};
      datum.labels = lbnChartData.xLabels;
      datum.datasets = [];
      
      for (let lbnDataset of lbnChartData.data) {
        let color = colors.pop();
        let colorLight = colorsLight.pop();
        let dataset = {
          label: lbnDataset.title,
          fillColor: colorLight,
          strokeColor: color,
          pointColor: color,
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: color,
          data: lbnDataset.values, 
        }
        datum.datasets.push(dataset);
      }
      this.data_.push(datum);
    }
  }

  get data() { return this.data_ }
}
