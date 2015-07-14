"use strict";

import {retrieveModule, compareObject} from 'lbnUtils';
import Active from 'Active';
import LbnChart from 'LbnChart';
import PresetModel from 'PresetModel';
import Solar from 'Solar';
import Parking from 'Parking';

export {start, on, 
  setModule, getModule, 
  login, getCharts, getDisaster, setPreset, getOptions, 
  setActive, setAuto, setSimulate,
  getRule,  setRule, setRuleEnable, 
  getScene, previewScene, addScene, modifyScene, deleteScene, 
  getSchedule, addSchedule, modifySchedule, deleteSchedule};

export const ON_MODULE_UPDATE = "onModuleUpdate";
export const ON_SOLAR_UPDATE = "onSolarUpdate";
export const ON_PARKING_UPDATE = "onParkingUpdate";
export let active;
export let solar;
export let parking;
export let presetModel;

let client;
let onModuleUpdate;
let onSolarUpdate;
let onParkingUpdate;
let areaList;

(function(){
})();

// Exported methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function start(serverUrl, interval = 100) {
  let transport = new Thrift.Transport(serverUrl);
  let protocol  = new Thrift.Protocol(transport);
  client = new LBN_Thrift_ServiceClient(protocol);
  active = new Active(client);
  solar = new Solar(client);
  parking = new Parking(client);
  presetModel = new PresetModel(client);

  // TODO: Handle error
  client.LBN_Thrift_GetAreaList();

  setInterval(() => {
    let isUpdated = updateAreaList();
    if (isUpdated) {
      let floors = [];
      for (let area of areaList) {
        for (let floor of area.floors) {
          floors.push(floor);
        }
      }
      // remove Facade
      floors.splice(7, 1);
      onModuleUpdate(floors);
    }
  }, interval);

  active.on(function(){});
  active.start(interval);

  solar.on(onSolarUpdate);
  solar.start(interval * 10);
  
  parking.on(onParkingUpdate);
  parking.start(interval * 10);

  return true;
};

function on(event, callback) {
  if (event === ON_MODULE_UPDATE) {
    onModuleUpdate = callback;
  }
  if (event === ON_SOLAR_UPDATE) {
    onSolarUpdate = callback;
  }
  if (event === ON_PARKING_UPDATE) {
    onParkingUpdate = callback;
  }
}

function login(password) {
  let result = client.LBN_Thrift_GetAdminPassword();
  if (!result) {
    result = "0000";
  }
  return (result===password);
}

function setModule(idList, newControl) {
  // TODO: control value conflicts when multiple modules are selected 
  let module = retrieveModule(idList[0], areaList);
  let control = $.extend(true, {}, module.control);

  replaceValues.call(control, newControl);

  setClientModules(idList, control);
}

function getModule(id) {
  return retrieveModule(id, areaList);
}

function getCharts() {
  let lbnCharts = client.LBN_Thrift_GetCharts();
  let lbnChart = new LbnChart(lbnCharts);
  return lbnChart.data;
}

function getDisaster() {
  let result;
  let disaster = client.LBN_Thrift_GetDisasterInfo();
  result = disaster.description;
  result = result.replace(/\n/g, "<br>");

  return result;
}

function getRule() {
	return client.LBN_Thrift_GetContextRuleList();
}

function getScene() {
  return client.LBN_Thrift_GetSceneList();
}

function previewScene(id) {
  return client.LBN_Thrift_PreviewScene(id);
}

function modifyScene(scene) {
  return client.LBN_Thrift_ModifyScene(scene);
}

function deleteScene(id) {
  return client.LBN_Thrift_DeleteScene(id);
}

function addScene(title) {
  return client.LBN_Thrift_AddScene(title);
}

/* Schedule */
function getSchedule() {
  return client.LBN_Thrift_GetScheduleList();
}
function addSchedule(scene, time, repeatAll, repeatDays) {
  return client.LBN_Thrift_AddSchedule(scene, time, repeatAll, repeatDays);
}
function modifySchedule(schedule) {
  return client.LBN_Thrift_ModifySchedule(schedule);
}
function deleteSchedule(scheduleId) {
  return client.LBN_Thrift_DeleteSchedule(scheduleId);
}

/* Rule */
function setRule(rule) {
  client.LBN_Thrift_ModifyContextRule(rule);
}

function setRuleEnable(id, enable) {
  client.LBN_Thrift_SetEnableContextRule(id, enable);
}

function setPreset(id) {
  client.LBN_Thrift_SetSchedulePreset(id);
}

function getOptions() {
  let options = [];
  options.push(client.LBN_Thrift_GetActive());
  options.push(client.LBN_Thrift_GetAuto());
  options.push(false);
  return options;
}

function setActive(value) {
  client.LBN_Thrift_SetActive(value);
}
function setAuto(value) {
  client.LBN_Thrift_SetAuto(value);
}
function setSimulate(value) {
  client.LBN_Thrift_SetSimulate(value);
}


// Internal methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function updateAreaList() {
  let newAreaList = client.LBN_Thrift_GetAreaList();
  if (areaList && compareObject(areaList, newAreaList)) {
    return false;
  }  
  areaList = newAreaList;
  return true;
}


function replaceValues(values) {
  for (let key in values) {
    this[key] = values[key];
  }
}

function setClientModules(idList, control) {
  if (idList.length === 1) {
    client.LBN_Thrift_SetModule(idList[0], control);
  } else {
    client.LBN_Thrift_SetModules(idList, control);
  }
}
