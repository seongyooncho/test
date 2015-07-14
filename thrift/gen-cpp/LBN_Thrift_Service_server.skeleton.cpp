// This autogenerated skeleton file illustrates how to build a server.
// You should copy it to another filename to avoid overwriting it.

#include "LBN_Thrift_Service.h"
#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/server/TSimpleServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/TBufferTransports.h>

using namespace ::apache::thrift;
using namespace ::apache::thrift::protocol;
using namespace ::apache::thrift::transport;
using namespace ::apache::thrift::server;

using boost::shared_ptr;

using namespace  ::LBN_Thrift;

class LBN_Thrift_ServiceHandler : virtual public LBN_Thrift_ServiceIf {
 public:
  LBN_Thrift_ServiceHandler() {
    // Your initialization goes here
  }

  bool LBN_Thrift_Service_Init() {
    // Your implementation goes here
    printf("LBN_Thrift_Service_Init\n");
  }

  void LBN_Thrift_GetAreaList(std::vector<stLBN_Area> & _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetAreaList\n");
  }

  void LBN_Thrift_GetModule(stLBN_Module& _return, const int32_t id) {
    // Your implementation goes here
    printf("LBN_Thrift_GetModule\n");
  }

  void LBN_Thrift_GetModuleControlMax(stLBN_ModuleControl& _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetModuleControlMax\n");
  }

  void LBN_Thrift_SetModule(const int32_t moduleId, const stLBN_ModuleControl& control) {
    // Your implementation goes here
    printf("LBN_Thrift_SetModule\n");
  }

  void LBN_Thrift_SetModules(const std::vector<int32_t> & moduleIdList, const stLBN_ModuleControl& control) {
    // Your implementation goes here
    printf("LBN_Thrift_SetModules\n");
  }

  void LBN_Thrift_SetModuleMessage(const int32_t moduleId, const std::string& message) {
    // Your implementation goes here
    printf("LBN_Thrift_SetModuleMessage\n");
  }

  void LBN_Thrift_SetSwitch(const int32_t switchId, const std::vector<stLBN_Module> & modules) {
    // Your implementation goes here
    printf("LBN_Thrift_SetSwitch\n");
  }

  void LBN_Thrift_GetSwitches(std::vector<stLBN_Switch> & _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetSwitches\n");
  }

  void LBN_Thrift_GetPowerMeter(stLBN_PowerMeter& _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetPowerMeter\n");
  }

  void LBN_Thrift_GetPowerMeterOneDay(stLBN_PowerMeterOneDay& _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetPowerMeterOneDay\n");
  }

  void LBN_Thrift_GetDisasterInfo(stLBN_DisasterInfo& _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetDisasterInfo\n");
  }

  void LBN_Thrift_GetAdminPassword(std::string& _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetAdminPassword\n");
  }

  void LBN_Thrift_SetActive(const bool active) {
    // Your implementation goes here
    printf("LBN_Thrift_SetActive\n");
  }

  bool LBN_Thrift_GetActive() {
    // Your implementation goes here
    printf("LBN_Thrift_GetActive\n");
  }

  void LBN_Thrift_SetAuto(const bool automatic) {
    // Your implementation goes here
    printf("LBN_Thrift_SetAuto\n");
  }

  bool LBN_Thrift_GetAuto() {
    // Your implementation goes here
    printf("LBN_Thrift_GetAuto\n");
  }

  void LBN_Thrift_SetSimulate(const bool simulate) {
    // Your implementation goes here
    printf("LBN_Thrift_SetSimulate\n");
  }

  void LBN_Thrift_GetSceneList(std::vector<stLBN_Scene> & _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetSceneList\n");
  }

  int32_t LBN_Thrift_AddScene(const std::string& title) {
    // Your implementation goes here
    printf("LBN_Thrift_AddScene\n");
  }

  void LBN_Thrift_ModifyScene(const stLBN_Scene& scene) {
    // Your implementation goes here
    printf("LBN_Thrift_ModifyScene\n");
  }

  void LBN_Thrift_DeleteScene(const int32_t sceneId) {
    // Your implementation goes here
    printf("LBN_Thrift_DeleteScene\n");
  }

  void LBN_Thrift_PreviewScene(const int32_t sceneId) {
    // Your implementation goes here
    printf("LBN_Thrift_PreviewScene\n");
  }

  void LBN_Thrift_GetScheduleList(std::vector<stLBN_Schedule> & _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetScheduleList\n");
  }

  int32_t LBN_Thrift_AddSchedule(const stLBN_Scene& scene, const int64_t time, const bool repeatAll, const std::vector<bool> & repeatDays) {
    // Your implementation goes here
    printf("LBN_Thrift_AddSchedule\n");
  }

  void LBN_Thrift_ModifySchedule(const stLBN_Schedule& schedule) {
    // Your implementation goes here
    printf("LBN_Thrift_ModifySchedule\n");
  }

  void LBN_Thrift_DeleteSchedule(const int32_t scheduleId) {
    // Your implementation goes here
    printf("LBN_Thrift_DeleteSchedule\n");
  }

  void LBN_Thrift_GetContextRuleList(std::vector<stLBN_ContextRule> & _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetContextRuleList\n");
  }

  void LBN_Thrift_ModifyContextRule(const stLBN_ContextRule& rule) {
    // Your implementation goes here
    printf("LBN_Thrift_ModifyContextRule\n");
  }

  void LBN_Thrift_SetEnableContextRule(const int32_t contextId, const bool enable) {
    // Your implementation goes here
    printf("LBN_Thrift_SetEnableContextRule\n");
  }

  void LBN_Thrift_Simulate(const int64_t time) {
    // Your implementation goes here
    printf("LBN_Thrift_Simulate\n");
  }

  void LBN_Thrift_GetSolarInfo(stLBN_SolarInfo& _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetSolarInfo\n");
  }

  void LBN_Thrift_GetCharts(std::vector<stLBN_Chart> & _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetCharts\n");
  }

  void LBN_Thrift_GetParkingSensorList(std::vector<stLBN_ParkingSensor> & _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetParkingSensorList\n");
  }

  void LBN_Thrift_GetSchedulePresetList(std::vector<stLBN_SchedulePreset> & _return) {
    // Your implementation goes here
    printf("LBN_Thrift_GetSchedulePresetList\n");
  }

  void LBN_Thrift_SetSchedulePreset(const int32_t presetId) {
    // Your implementation goes here
    printf("LBN_Thrift_SetSchedulePreset\n");
  }

};

int main(int argc, char **argv) {
  int port = 9090;
  shared_ptr<LBN_Thrift_ServiceHandler> handler(new LBN_Thrift_ServiceHandler());
  shared_ptr<TProcessor> processor(new LBN_Thrift_ServiceProcessor(handler));
  shared_ptr<TServerTransport> serverTransport(new TServerSocket(port));
  shared_ptr<TTransportFactory> transportFactory(new TBufferedTransportFactory());
  shared_ptr<TProtocolFactory> protocolFactory(new TBinaryProtocolFactory());

  TSimpleServer server(processor, serverTransport, transportFactory, protocolFactory);
  server.serve();
  return 0;
}
