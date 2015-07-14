#ifndef CPP_OBJECT_H
#define CPP_OBJECT_H

#include "../thrift/gen-cpp/LBN_Thrift_types.h"

class Module {
  public:
    int32_t id;
    LBN_ModuleType::type type;
    stLBN_ModuleControl control;

    stLBN_Module getTModule () {
      stLBN_Module tModule;
      tModule.id = id;
      tModule.type = type;
      tModule.control = control;

      return tModule;
    }
};

class Floor {
  public:
    int32_t id;
    std::string name;
    std::vector<Module*> modules;

    stLBN_Floor getTFloor () {
      stLBN_Floor tFloor;
      tFloor.id = id;
      tFloor.name = name;
      
      for (int i=0; i<modules.size(); i++)
      {
        tFloor.modules.push_back(modules[i]->getTModule());
      }
      return tFloor;
    }
};

class Area {
  public:
    int32_t id;
    std::string name;
    std::vector<Floor*> floors;

    stLBN_Area getTArea () {
      stLBN_Area tArea;
      tArea.id = id;
      tArea.name = name;

      for (int i=0; i<floors.size(); i++)
      {
        tArea.floors.push_back(floors[i]->getTFloor());
      }
      return tArea;
    }
};

#endif
