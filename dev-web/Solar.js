"use strict";

import {compareObject} from 'lbnUtils';

export default class {
  constructor(client) {
    this.client_ = client;
  }

  on(callback) {
    this.callback_ = callback;
  }

  start(interval) {
    setInterval(() => {
      let newData = this.client_.LBN_Thrift_GetSolarInfo();
      if (!this.data_ || !compareObject(this.data_, newData)) {
        this.data_ = newData;
        this.callback_(this.data_);
      }
    }, interval);
  }

  get data() {return this.data_ }
  
}
