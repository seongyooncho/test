"use strict";

export default class {
  constructor(client) {
    this.client_ = client;
    this.list = client.LBN_Thrift_GetSchedulePresetList();
  }
}

