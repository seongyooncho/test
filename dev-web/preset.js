"use strict";

export {start, onSet};

let presetBtnGroup = $("#presetBtnGroup");
let setCallback;

function start(list) {
  let spans = presetBtnGroup.find("span");

  for (let preset of list) {
    spans.eq(preset.id + 1).html(preset.title);
  }
}

function onSet(callback) {
  setCallback = callback;
}

$(document).on('change', 'input:radio[id^="presetBtnInput"]', function (event) {
  setCallback(event.target.value - 1);
});

