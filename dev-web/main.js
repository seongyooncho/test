"use strict";

import {getParameter} from 'lbnUtils';
import * as lbn from 'lbn';
import * as ui from 'ui';
import * as chart from 'chart';
import * as disaster from 'disaster';
import * as context from 'context';
import * as schedule from 'schedule';
import * as scene from 'scene';
import * as weather from 'weather';
import * as preset from 'preset';
import * as option from 'option';
import * as gl from 'gl';
import * as solarDom from 'solarDom';
import * as parkingDom from 'parkingDom';

$(function() {
  lbn.on(lbn.ON_MODULE_UPDATE, function(floors) {
    gl.setLbnFloors(floors);
  });

  lbn.on(lbn.ON_SOLAR_UPDATE, function(solarData) {
    solarDom.setText(
      solarData.azimuth,
      solarData.elevation,
      solarData.sunriseTime,
      solarData.suntransitTime,
      solarData.sunsetTime
      );
    gl.solar.coordinate = {azimuth: solarData.azimuth, elevation: solarData.elevation};
  });

  lbn.on(lbn.ON_PARKING_UPDATE, function(parkingData) {
    parkingDom.setRows(parkingData);
  });

  gl.onModuleChange(function(idList, newControl) {
    lbn.setModule(idList, newControl);
  });

  $("#loginForm").submit(function(event) {
    var success = lbn.login(ui.getPassword());
    ui.login(success);

    event.preventDefault();
  });

  preset.onSet(function(id) {
    lbn.setPreset(id);
  });
  option.onActiveChange(function(value){
    lbn.setActive(value);
  });
  option.onAutoChange(function(value){
    lbn.setAuto(value);
  });
  option.onSimulateChange(function(value){
    lbn.setSimulate(value);
  });

  ui.onSubmitConnect(function(serverUrl) {
    if (lbn.start(serverUrl)){
      ui.start();
      gl.start();
      chart.start(lbn.getCharts());
      preset.start(lbn.presetModel.list);
      option.set(lbn.getOptions());
    }
  });

  disaster.setModal(lbn.getDisaster);

  context.setModal(lbn.getRule, lbn.getScene);
  context.onRuleChange(function(rule){
    lbn.setRule(rule);
  });
  context.onRuleEnable(function(id, enable){
    lbn.setRuleEnable(id, enable);
  });

  schedule.setModal(lbn.getSchedule, lbn.getScene);
  schedule.onAddSchedule(lbn.addSchedule);
  schedule.onModifySchedule(lbn.modifySchedule);
  schedule.onDeleteSchedule(lbn.deleteSchedule);

  scene.setDropdown(lbn.getScene);
  scene.onPreviewScene(lbn.previewScene);
  scene.onAddScene(lbn.addScene);
  scene.onModifyScene(lbn.modifyScene);
  scene.onDeleteScene(lbn.deleteScene);

  setTimeout(function() {
    let serverUrl = getParameter("thrift");   
    if (lbn.start(serverUrl)){
      ui.start();
      gl.start();
      chart.start(lbn.getCharts());
      preset.start(lbn.presetModel.list);
      option.set(lbn.getOptions());
    }
  }, 1000);

});
