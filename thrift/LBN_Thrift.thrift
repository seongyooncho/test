/*===========================================================================
 *
 *	(C) COPYRIGHT 2013 LED Communication Research Section, ETRI
 *
 *	Project		: LuBi-Net SDK
 *	Date			: September 16, 2013
 *	Author		: Hyunseok Kim (e-mail: hertzkim@etri.re.kr)
 *	Description : LuBi-Net Remote Procedure Call
 *===========================================================================
 */

/**
 * The first thing to know about are types. The available types in Thrift are:
 *
 *  bool        Boolean, one byte
 *  byte        Signed byte
 *  i16         Signed 16-bit integer
 *  i32         Signed 32-bit integer
 *  i64         Signed 64-bit integer
 *  double      64-bit floating point value
 *  string      String
 *  binary      Blob (byte array)
 *  map<t1,t2>  Map from one type to another
 *  list<t1>    Ordered list of one type
 *  set<t1>     Set of unique elements of one type
 *
 * Did you also notice that Thrift supports C style comments?
 */

namespace cpp LBN_Thrift

struct stLBN_Thrift
{
}

enum LBN_SwitchType 
{
  TYPE_1,
  TYPE_2,
  TYPE_3,
  TYPE_4,
}

enum LBN_ModuleType 
{
  SQUARE_COLOR,	/* 1, 2, 3, 4, 5 */
  MR16_WARM_WHITE,/* 2 */
  MR16_COOL_WHITE,/* 1 */
  STREET_WHITE,	/* 2 */
  DMX_COLOR,		/* 1, 2, 3, 4, 5, 6, 7, 8 */
  BAR_COOL_WHITE,	/* 1 */
  MOVING_WHITE, /* 1, 9, 10, 11, 12, 13 */
}

struct point
{
  1: double x,
  2: double y,
}

struct stLBN_ModuleControl
{
  1: optional i32	cwdimming,
  2: optional i32 wwdimming,
  3: optional i32	red,
  4: optional i32	green,
  5: optional i32	blue,
  6: optional i32 pan,
  7: optional i32 tilt,
  8: optional i32 zoom,
  9: optional i32 up,
  10: optional i32 down,
  11: optional i32 left,
  12: optional i32 right,
  13: optional i32 stop,
}

struct stLBN_ModuleSensor
{
  1: optional i32 ambient,	/* 0~65535 */
  2: optional i32 red,		/* 0~65535 */
  3: optional i32 green		/* 0~65535 */
  4: optional i32 blue,		/* 0~65535 */
  5: optional double cieX,	/* 0.0~2.0 */
  6: optional double cieY,	/* 0.0~2.0 */
  7: optional double temp,	/* -20.0~80.0 */
  8: optional double humid,	/* 0.0~100.0 % */
}

struct stLBN_Group
{
  1: i32 id,
}

struct stLBN_Scene
{
  1: i32		id,
  2: string 	title,
}

struct stLBN_Module
{
  1: i32 id,
  2: LBN_ModuleType type,
  3: stLBN_ModuleControl control,
  4: list<stLBN_Group> groups,
  5: stLBN_ModuleSensor sensor,
  6: string message,
  7: point origin,
}

struct stLBN_Switch
{
  1: i32 id,
  2: string name,
  3: list<stLBN_Module> modules,
  4: list<stLBN_Scene> scenes,
  5: list<stLBN_Group> groups,
  6: string message,
}


struct stLBN_Floor
{
  1: i32 id,
  2: string name,
  3: list<stLBN_Module> modules,
}

struct stLBN_Area
{
  1: i32 id,
  2: string name,
  3: list<stLBN_Floor> floors,
}

struct stLBN_DisasterInfo
{
  1: string date,
  2: string description,
}

struct stLBN_PowerMeter
{
  1: i32			hour,
  2: i32			minute,
  3: i32			second,	
  4: double dVoltage,
  5: double dCurrent,
  6: double dPower,
}

struct stLBN_PowerMeterOneDay
{
  1: i32			year,
  2: i32			month,
  3: i32			day,
  4: list<stLBN_PowerMeter> powermeters,
}

struct stLBN_Schedule
{
  1: i32 id,
  2: i64 time,
  3: stLBN_Scene scene,
  4: bool repeatAll,
  5: list<bool> repeatDays,
}

struct stLBN_ContextRule
{
  1: i32 id,
  2: string title,
  3: string description,
  4: stLBN_Scene scene,
  5: bool hasScene,
  6: bool enabled,
}

struct stLBN_SolarInfo
{
  1: i64	currentTime,
  2: double	latitude,
  3: double longitude,
  4: double azimuth,
  5: double elevation,
  6: i64	sunriseTime,
  7: i64	suntransitTime,
  8: i64	sunsetTime,
}

struct stLBN_GraphData
{
  1: string title, // 데이터의 타이틀 (legend에 표시)
  2: list<double> values,
}

struct stLBN_Chart
{
	1: string title, // 차트의 타이틀 (차트의 위에 표시)
	2: list<stLBN_GraphData> data, // 차트 
	3: list<string> xLabels, // x 축에 표시될 label
}
struct stLBN_ParkingSensor
{
  1: byte floor,	/* -7 ~ + 7; 지하 7층 ~ 지상 7층 */
  2: byte zone,		/* 0~15; 구역 */
  3: byte slot,		/* 0~255; 주차라인번호; 고유ID = floor + zone + slot 결합된 형태임 */
  4: byte value,	/* 0: 비어있는것, 1: 차가있는것 */
}

struct stLBN_SchedulePreset
{
  1: i32 id,
  2: string title,
}

service LBN_Thrift_Service
{
  bool LBN_Thrift_Service_Init(); //depricated

  list<stLBN_Area> LBN_Thrift_GetAreaList();
  stLBN_Module LBN_Thrift_GetModule(1: i32 id); //depricated

  stLBN_ModuleControl LBN_Thrift_GetModuleControlMax();


  void LBN_Thrift_SetModule(1: i32 moduleId, 2: stLBN_ModuleControl control);
  void LBN_Thrift_SetModules(1: list<i32> moduleIdList, 2: stLBN_ModuleControl control);
  void LBN_Thrift_SetModuleMessage(1: i32 moduleId, 2: string message);

  void LBN_Thrift_SetSwitch(1: i32 switchId, 2: list<stLBN_Module> modules);
  list<stLBN_Switch> LBN_Thrift_GetSwitches(); 

  stLBN_PowerMeter LBN_Thrift_GetPowerMeter();	
  stLBN_PowerMeterOneDay LBN_Thrift_GetPowerMeterOneDay();
  stLBN_DisasterInfo LBN_Thrift_GetDisasterInfo();

  string LBN_Thrift_GetAdminPassword();
  void LBN_Thrift_SetActive(1: bool active);
  bool LBN_Thrift_GetActive();
  void LBN_Thrift_SetAuto(1: bool automatic);
  bool LBN_Thrift_GetAuto();
  void LBN_Thrift_SetSimulate(1: bool simulate);

  list<stLBN_Scene> LBN_Thrift_GetSceneList();
  i32 LBN_Thrift_AddScene(1: string title);
  void LBN_Thrift_ModifyScene(1: stLBN_Scene scene);
  void LBN_Thrift_DeleteScene(1: i32 sceneId);
  void LBN_Thrift_PreviewScene(1: i32 sceneId);

  list<stLBN_Schedule> LBN_Thrift_GetScheduleList();
  i32 LBN_Thrift_AddSchedule(1: stLBN_Scene scene, 2: i64 time, 3: bool repeatAll, 4: list<bool> repeatDays);
  void LBN_Thrift_ModifySchedule(1: stLBN_Schedule schedule);
  void LBN_Thrift_DeleteSchedule(1: i32 scheduleId);

  list<stLBN_ContextRule> LBN_Thrift_GetContextRuleList();
  void LBN_Thrift_ModifyContextRule(1: stLBN_ContextRule rule);
  void LBN_Thrift_SetEnableContextRule(1: i32 contextId, 2: bool enable);

  void LBN_Thrift_Simulate(1: i64 time); //depricated

  stLBN_SolarInfo LBN_Thrift_GetSolarInfo();

  list<stLBN_Chart> LBN_Thrift_GetCharts();

  list<stLBN_ParkingSensor> LBN_Thrift_GetParkingSensorList();

  list<stLBN_SchedulePreset> LBN_Thrift_GetSchedulePresetList();
  void LBN_Thrift_SetSchedulePreset(1: i32 presetId);
} 
