/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

#include <thrift/protocol/TJSONProtocol.h>
#include <thrift/server/TSimpleServer.h>
#include <thrift/server/TThreadedServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/THttpServer.h>

#include <iostream>
#include <stdexcept>
#include <sstream>

#include "../thrift/gen-cpp/LBN_Thrift_Service.h"

using namespace std;
using namespace apache::thrift;
using namespace apache::thrift::protocol;
using namespace apache::thrift::transport;
using namespace apache::thrift::server;
using namespace LBN_Thrift;

#include "CppObject.h"


class LBN_Thrift_ServiceHandler : public LBN_Thrift_ServiceIf {
 public:
  LBN_Thrift_ServiceHandler() {
    vector<string> areaNameList;
    areaNameList.push_back("Office");
    areaNameList.push_back("Residential");
    areaNameList.push_back("Commercial");
    areaNameList.push_back("Facade");
    areaNameList.push_back("Parking");
    areaNameList.push_back("Road");

    int ii;
    for (ii=0; ii < areaNameList.size(); ii++)
    {
      Area *area = new Area;
      area->id = ii;
      area->name = areaNameList[ii];
      areaList.push_back(area);
    }

    for (ii=0; ii < 10; ii++) 
    {
      Floor *floor = new Floor;
      floor->id = ii;

      stringstream sstm;
      sstm << "Floor #0" << ii;
      floor->name = sstm.str();

      floorList.push_back(floor);

      if (ii < 3) 
      {
        areaList[0]->floors.push_back(floor);
      }
      else if (ii < 6)
      {
        areaList[1]->floors.push_back(floor);
      }
      else
      {
        areaList[ii-4]->floors.push_back(floor);
      }
    }

    for (ii=0; ii < 16 * floorList.size(); ii++)
    {
      Module *module = new Module;
      module->id = ii;
      module->type = LBN_ModuleType::SQUARE_COLOR;

      module->control.__set_red(100);
      module->control.__set_green(100);
      module->control.__set_blue(100);
      module->control.__set_dimming(100);

      moduleList.push_back(module);

      floorList[ii/16]->modules.push_back(module);

    }

    
  }
  
  bool LBN_Thrift_Service_Init()
  {
	  return true;
  }

  void LBN_Thrift_GetAreaList(vector<stLBN_Area>&ret)
  {
    for(int i=0; i<areaList.size(); i++)
    {
      ret.push_back(areaList[i]->getTArea());
    }
  }

  void LBN_Thrift_GetModule(stLBN_Module& ret, const int32_t id)
  {
    ret = moduleList[id]->getTModule();
  }

  void LBN_Thrift_SetModule(const int32_t id, const stLBN_ModuleControl& control)
  {
    applyControl(moduleList[id], control);
  }
  
  void LBN_Thrift_SetModules(const vector<int32_t>& moduleIdList, const stLBN_ModuleControl& control)
  {
    int i;
    for (i=0; i < moduleIdList.size(); i++)
    {
      applyControl(moduleList[moduleIdList[i]], control);
    }
  }

  void LBN_Thrift_GetScheduleList(std::vector<stLBN_Schedule> & _return)
  {
    _return = scheduleList;
  }

  int32_t LBN_Thrift_CreateSchedule(const int64_t time, const std::vector<stLBN_Module> & moduleList)
  {
    int32_t id = 0;
    if (scheduleList.size() > 0) {
      id = scheduleList.back().id + 1;
    }

    stLBN_Schedule schedule;
    schedule.id = id;
    schedule.time = time;
    schedule.modules = moduleList;

    scheduleList.push_back(schedule);

    return id;
  }

  void LBN_Thrift_ModifySchedule(const stLBN_Schedule& schedule)
  {
    for (int i=0; i<scheduleList.size(); ++i)
    {
      if (scheduleList[i].id == schedule.id) {
        scheduleList[i] = schedule;
        break;
      }
    }
  }

  void LBN_Thrift_DeleteSchedule(const int32_t scheduleId)
  {
    vector<stLBN_Schedule>::iterator d = scheduleList.end();

    for (vector<stLBN_Schedule>::iterator i = scheduleList.begin();
        i != scheduleList.end(); ++i)
    {
      if (i->id == scheduleId) {
        d = i;
        break;
      }
    }
    if (d != scheduleList.end()) {
      scheduleList.erase(d);
    }
  }

  void LBN_Thrift_SetScheduleModules(const int32_t scheduleId, const std::vector<int32_t> & moduleIdList, const stLBN_ModuleControl& control) {

    int scheduleIndex = -1;
    int i;

    for (i=0; i<scheduleList.size(); ++i)
    {
      if (scheduleList[i].id == scheduleId) {
        scheduleIndex = i;
        break;
      }
    }

    if (scheduleIndex < 0)
      return;

    vector<stLBN_Module> &scheduleModules = scheduleList[scheduleIndex].modules;

    for (i=0; i < moduleIdList.size(); i++)
    {
      applyControl(scheduleModules[moduleIdList[i]], control);
    }
  }

protected:
  vector<Area*> areaList;
  vector<Floor*> floorList;
  vector<Module*> moduleList;
  vector<stLBN_Schedule> scheduleList;

  void applyControl(Module* module, const stLBN_ModuleControl& control)
  {
    if (control.__isset.red)
      module->control.__set_red(control.red);
    if (control.__isset.blue)
      module->control.__set_blue(control.blue);
    if (control.__isset.green)
      module->control.__set_green(control.green);
    if (control.__isset.dimming)
      module->control.__set_dimming(control.dimming);
  }
  void applyControl(stLBN_Module& module, const stLBN_ModuleControl& control)
  {
    if (control.__isset.red)
      module.control.__set_red(control.red);
    if (control.__isset.blue)
      module.control.__set_blue(control.blue);
    if (control.__isset.green)
      module.control.__set_green(control.green);
    if (control.__isset.dimming)
      module.control.__set_dimming(control.dimming);
  }
};

int main(int argc, char **argv) {

  boost::shared_ptr<TProtocolFactory> protocolFactory(new TJSONProtocolFactory());
  boost::shared_ptr<LBN_Thrift_ServiceHandler> handler(new LBN_Thrift_ServiceHandler());
  boost::shared_ptr<TProcessor> processor(new LBN_Thrift_ServiceProcessor(handler));
  boost::shared_ptr<TServerTransport> serverTransport(new TServerSocket(9090));
  boost::shared_ptr<TTransportFactory> transportFactory(new THttpServerTransportFactory());

  TThreadedServer server(processor,
                         serverTransport,
                         transportFactory,
                         protocolFactory);

  printf("Starting the server...\n");
  server.serve();
  printf("done.\n");
  return 0;
}
