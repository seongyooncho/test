"use strict";

export default class {
  constructor(client) {
    this.client_ = client;
  }
  on(callback) {
    this.callback_ = callback;
  }
  start(interval) {
    setInterval(() => {
      let newState = this.client_.LBN_Thrift_GetActive();
      if (!this.state_ || this.state_ !== newState) {
        this.state_ = newState;
        this.callback_(this.state_);
      }
    }, interval);
  }

  get state() { return this.state_ }
}

