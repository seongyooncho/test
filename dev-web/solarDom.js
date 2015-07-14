"use strict";

import {getHHMM} from 'lbnUtils';

export {setText};

let azimuthText = $("#solarAzimuth");
let elevationText = $("#solarElevation");
let riseText = $("#solarRise");
let transitText = $("#solarTransit");
let solarSetText = $("#solarSet");

function setText(azimuth, elevation, rise, transit, solarSet) {
  azimuthText.html(azimuth.toFixed(2)+"&deg;");
  elevationText.html(elevation.toFixed(2)+"&deg;");
  riseText.html("<i class='fa fa-clock-o'></i> "+getHHMM(rise));
  transitText.html("<i class='fa fa-clock-o'></i> "+getHHMM(transit));
  solarSetText.html("<i class='fa fa-clock-o'></i> "+getHHMM(solarSet));
}


