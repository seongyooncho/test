$(window).load(function(){
  var mainW = $(window).height() -70;
  $('.nav').css({ height : mainW });
  $('.nav-logo').hide();
  $('#loading').fadeOut(1000);
  $('.nav-logo').fadeIn();
});

$(document).ready(function(){

  toastr.options = {
    "closeButton": true,
  "debug": false,
  "positionClass": "toast-bottom-right",
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut",
  };

  $(window).resize(function() {
    var mainW = $(window).height() -70;
    $('.nav').css({ height : mainW })

    mQuery();
  }); // Window resize


  function mQuery() {
    // Same as @media (max-width: 767px) -> hide the navigation
    if ($('.fluid [class*="grid"]').css('float') == 'none' ){
      $('.nav').removeClass('show');
    } else {
      $('.nav').addClass('show');
    }
  }
  mQuery();

  // $('.nav').hide();
  $('.nav-button').click(function(){
    // $('.nav').toggleClass('show');
    $('.nav').toggleClass('show')
    //$('.nav').fadeToggle(function(){

    //})
  })
  $('.collapsible > a').click(function(){
    $(this).parent().toggleClass('open')
  })

  $(".spinner").spinner({
    icons: { down: "ui-icon-carat-1-s", up: "ui-icon-carat-1-n" },
    min:1,
    max:3
  });
  $("#spinner-table").on( "spin", function(event, ui) {
    var val = ui.value;
    if (val == 2) { $('#media-table tbody tr:last-child').hide(); $('#media-table tbody tr:nth-child(2)').show() };
    if (val == 1) { $('#media-table tbody tr:nth-child(2), #media-table tbody tr:last-child').hide(); };
    if (val == 3) { $('#media-table tbody tr').show(); };
  });

  $('#eTabs').easytabs({
    animate:false,
    updateHash: false
  });

  $('.slider').slider();

  $('.slider.range').slider({
    range: true,
    max: 750,
    values: [ 75, 300 ],
    slide: function( event, ui ) {
      $( "#amount-min" ).html("$" + ui.values[0]);
      $( "#amount-max" ).html("$" + ui.values[1]);
    }
  });
  $( "#amount-min" ).html( "$" + $( ".slider.range" ).slider( "values", 0));
  $( "#amount-max" ).html( "$" + $( ".slider.range" ).slider( "values", 1));

  $('.slider.range-min').slider({
    range: "min",
    min:50,
    slide: function( event, ui ) {
      $('.slider.range-min > a.ui-slider-handle').html("<div class='range-tooltip'>" + $(".slider.range-min").slider("value") + "%</div>")
    },
    stop: function( event, ui ) {
            $('.range-tooltip').delay(1000).fadeOut();
          }
  });
  $( "#amount-block" ).html("Min:" + $(".slider.range-min").slider( "option", "min") + "%");
  $('.slider.range-min > a.ui-slider-handle').hover(function(){
    $('.slider.range-min > a.ui-slider-handle').html("<div class='range-tooltip'>" + $(".slider.range-min").slider("value") + "%</div>")
    $('.range-tooltip').delay(1000).fadeOut();
  })

  $( ".progressbar" ).progressbar({
    value: 37
  });

  /*
  $('.todo-item').click(function(){
    $(this).toggleClass('selected');
  })
  */

  $('.icon-btn').click(function(){
    $(this).toggleClass('btn-orange');
  })


  $(window).resize(function() {
    var mainW = $('.main-content').height();
    $('.nav').css({ height : mainW + 50})
  });

}); // Ready
// Line Chart
var lineChartData = {
  labels : ["2007","2008","2009","2010","2011","2012","2013"],
  datasets : [
  {
    fillColor : "rgba(143,182,82,0.12)",
    strokeColor : "#90b753",
    pointColor : "#fff",
    pointStrokeColor : "#90b753",
    data : [40,79,61,70,85,58,76]
  },
  {
    fillColor : "rgba(127,176,190,0.3)",
    strokeColor : "#7fb0be",
    pointColor : "#fff",
    pointStrokeColor : "#72a9bc",
    data : [5,20,55,23,30,16,21]
  }
  ]

}

var myLine = new Chart(document.getElementById("lineChart").getContext("2d")).Line(lineChartData, {
  bezierCurve : false,
    scaleFontSize : 10,
    scaleFontColor: "#929191",
    animation: false,
    scaleOverride : true,
    scaleSteps : 5,
    scaleStepWidth : 20,
    scaleStartValue : 0,
    scaleLineWidth : 1
});


// Doughnut Chart
var doughnutData = [
{
  value: 40,
    color:"#90b753"
},
{
  value : 25,
  color : "#72a9bc"
},
{
  value : 14,
  color : "#ff5764"
},
{
  value : 21,
  color : "transparent"
}
];

var myDoughnut = new Chart(document.getElementById("doughtChart").getContext("2d")).Doughnut(doughnutData, {
  segmentStrokeColor : "rgba(0,0,0,0.1)",
    percentageInnerCutout : 60,
    animation : false
});

