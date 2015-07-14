"use strict";

import getParameter from 'getParameter';

export default class {
  constructor() {
    let serverUrl =  getParameter("thrift"); 
    if (serverUrl === "") {
      serverUrl = "http://localhost:9090";
    }
    let transport = new Thrift.Transport(serverUrl);
    let protocol  = new Thrift.Protocol(transport);
    this.client_ = new LBN_Thrift_ServiceClient(protocol);
  }

  set updateCallback(callback) {
    this.updateCallback_ = callback;
  }

  start(interval = 100) {
    setInterval(() => {
      this.updateCallback_("helloo");
    }, interval);
  }
}
