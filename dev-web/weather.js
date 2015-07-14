"use strict";

let weatherModal = $("#weatherModal");

(function() {
  weatherModal.on('show.bs.modal', function (e) {
    $.simpleWeather({
      location: '',
      woeid: '1132467',
      unit: 'c',
      success: function(weather) {
        $("#weatherHigh").html(weather.high);
        $("#weatherCity").html(weather.city);
        $("#weatherCountry").html(weather.country);
        $("#weatherLow").html(weather.low);
        $("#weatherImage").attr('src', weather.image);
        $("#weatherTemp").html(weather.temp);

        let days = $(".weatherForecastDay");
        let images = $(".weatherForecastImage");
        let highs = $(".weatherForecastHigh");
        let lows = $(".weatherForecastLow");
        for (let i = 0; i < weather.forecast.length; i++) {
          let forecast = weather.forecast[i];
          let day = days.eq(i);
          let image = images.eq(i);
          let high = highs.eq(i);
          let low = lows.eq(i);
          day.html(forecast.day);
          image.attr('src', forecast.image);
          high.html(forecast.high);
          low.html(forecast.low);
        }
      },
      error: function(error) {
               $("#weather").html('<p>'+error+'</p>');
             }
    });
  })
})();

