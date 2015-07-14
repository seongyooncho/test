"use strict";

export {start};

let charts = [];
var ctx, ctx2, ctx3, myLineChart, myLineChart2, myLineChart3;

// Exported methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function start(charts) {
  Chart.defaults.global.responsive = true;
  Chart.defaults.global.maintainAspectRatio = false;
  Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>hfiehi: <%}%><%= value %>";

  var options = {
    legendTemplate : '<ul class="list-inline text-center">'
      +'<% for (var i=0; i<datasets.length; i++) { %>'
      +'<li>'
      +'<span class="label" style=\"background-color:<%=datasets[i].strokeColor%>\">'
      +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
      +'</span></li>'
      +'<% } %>'
      +'</ul>'
  };

  ctx = document.getElementById("chart1").getContext("2d");
  ctx.canvas.width = $(".chart").width();
  myLineChart = new Chart(ctx).Bar(charts[0], options);
  ctx2 = document.getElementById("chart2").getContext("2d");
  ctx2.canvas.width = $(".chart").width();
  myLineChart2 = new Chart(ctx2).Bar(charts[1], options);
  $("#chart-body").append($(myLineChart2.generateLegend()));
}
