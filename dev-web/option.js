"use strict";

export {set, onActiveChange, onAutoChange, onSimulateChange};

let activeOption = $("#activeOption");
let autoOption = $("#autoOption");
let simulateOption = $("#simulateOption");
let activeCallback; 
let autoCallback; 
let simulateCallback; 

function set(options) {
  setActive.call(activeOption, options[0]);
  setActive.call(autoOption, options[1]);
  setActive.call(simulateOption, options[2]);
}

function onActiveChange(callback) {
  activeCallback = callback;
}
function onAutoChange(callback) {
  autoCallback = callback;
}
function onSimulateChange(callback) {
  simulateCallback = callback;
}

activeOption.click(function() {
  let value = getActive.call(this);
  activeCallback(value);
});
autoOption.click(function() {
  let value = getActive.call(this);
  autoCallback(value);
});
simulateOption.click(function() {
  let value = getActive.call(this);
  simulateCallback(value);
});

function setActive(value) {
  let title;
  if (this === activeOption) title = 'Online';
  else if (this === autoOption) title = 'Schedule';
  else title = 'Simulate';


  if (value) {
    this.addClass("active");
    this.html(getHtml('toggle-on', title));
  } else {
    if (this === activeOption) title = 'Offline';
    this.removeClass("active");
    this.html(getHtml('toggle-off', 'Simulate'));
  }
}

function getActive() {
  return !$(this).hasClass("active");
}

function getHtml(fa, title) {
  return '<i class="fa fa-'+fa+'"></i> ' + title;
}
