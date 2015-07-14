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
      let newData = this.client_.LBN_Thrift_GetParkingSensorList();
      if (!this.data_ || !compareObject(this.data_, newData)) {
        this.data_ = newData;
        this.callback_(this.rows);
      }
    }, interval);
  }

  get rows() {
    let rows = [];
    for (let datum of this.data_) {
      let currentRow;

      // find existing row
      for (let row of rows) {
        if (row.floor === datum.floor && row.zone === datum.zone) {
          currentRow = row;
          break;
        }
      }

      // initialize row
      if (!currentRow) {
        currentRow = {
          floor: datum.floor,
          zone: datum.zone,
          available: 0,
          maximum: 0,
        }
        rows.push(currentRow);
      }

      currentRow.maximum++;
      currentRow.available += 1 - datum.value;
    }
    return rows;
  } 

}
