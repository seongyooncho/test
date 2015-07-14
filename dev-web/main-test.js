"use strict";

var GuiModule = function() {
  this.Selected_Module = '#01';

  this.Type = 0.1;

  this.control = {};
  this.control.Cool_White = 0;
  this.control.Warm_White = 0;
  this.control.Color = [ 0, 128, 255 ];

  this.sensor = {
    ambient: 0,
    blue: 0,
    cieX: 0,
    cieY: 0,
    green: 0,
    humid: 0,
    red: 0,
    temp: 0,
  };

  this.Message = "Hello";
};

var guiModule = new GuiModule();
var gui = new dat.GUI({ });

gui.add(guiModule, 'Selected_Module').listen();
gui.add(guiModule, 'Type').listen();
gui.add(guiModule, 'Message').listen();


let guiControl = gui.addFolder('Control');

let cwController = guiControl.add(guiModule.control, 'Cool_White', 0, 100).listen();
let wwController = guiControl.add(guiModule.control, 'Warm_White', 0, 100).listen();
let colorController = guiControl.addColor(guiModule.control, 'Color').listen();
