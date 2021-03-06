/**
 * Autogenerated by Thrift Compiler (0.9.1)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
#ifndef LBN_Thrift_TYPES_H
#define LBN_Thrift_TYPES_H

#include <thrift/Thrift.h>
#include <thrift/TApplicationException.h>
#include <thrift/protocol/TProtocol.h>
#include <thrift/transport/TTransport.h>

#include <thrift/cxxfunctional.h>


namespace LBN_Thrift {

struct LBN_SwitchType {
  enum type {
    TYPE_1 = 0,
    TYPE_2 = 1,
    TYPE_3 = 2,
    TYPE_4 = 3
  };
};

extern const std::map<int, const char*> _LBN_SwitchType_VALUES_TO_NAMES;

struct LBN_ModuleType {
  enum type {
    SQUARE_COLOR = 0,
    MR16_WARM_WHITE = 1,
    MR16_COOL_WHITE = 2,
    STREET_WHITE = 3,
    DMX_COLOR = 4,
    BAR_COOL_WHITE = 5,
    MOVING_WHITE = 6
  };
};

extern const std::map<int, const char*> _LBN_ModuleType_VALUES_TO_NAMES;


class stLBN_Thrift {
 public:

  static const char* ascii_fingerprint; // = "99914B932BD37A50B983C5E7C90AE93B";
  static const uint8_t binary_fingerprint[16]; // = {0x99,0x91,0x4B,0x93,0x2B,0xD3,0x7A,0x50,0xB9,0x83,0xC5,0xE7,0xC9,0x0A,0xE9,0x3B};

  stLBN_Thrift() {
  }

  virtual ~stLBN_Thrift() throw() {}


  bool operator == (const stLBN_Thrift & /* rhs */) const
  {
    return true;
  }
  bool operator != (const stLBN_Thrift &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_Thrift & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_Thrift &a, stLBN_Thrift &b);

typedef struct _point__isset {
  _point__isset() : x(false), y(false) {}
  bool x;
  bool y;
} _point__isset;

class point {
 public:

  static const char* ascii_fingerprint; // = "EA2086D2BB14222991D7B0497DE7B58B";
  static const uint8_t binary_fingerprint[16]; // = {0xEA,0x20,0x86,0xD2,0xBB,0x14,0x22,0x29,0x91,0xD7,0xB0,0x49,0x7D,0xE7,0xB5,0x8B};

  point() : x(0), y(0) {
  }

  virtual ~point() throw() {}

  double x;
  double y;

  _point__isset __isset;

  void __set_x(const double val) {
    x = val;
  }

  void __set_y(const double val) {
    y = val;
  }

  bool operator == (const point & rhs) const
  {
    if (!(x == rhs.x))
      return false;
    if (!(y == rhs.y))
      return false;
    return true;
  }
  bool operator != (const point &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const point & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(point &a, point &b);

typedef struct _stLBN_ModuleControl__isset {
  _stLBN_ModuleControl__isset() : cwdimming(false), wwdimming(false), red(false), green(false), blue(false), pan(false), tilt(false), zoom(false), up(false), down(false), left(false), right(false), stop(false) {}
  bool cwdimming;
  bool wwdimming;
  bool red;
  bool green;
  bool blue;
  bool pan;
  bool tilt;
  bool zoom;
  bool up;
  bool down;
  bool left;
  bool right;
  bool stop;
} _stLBN_ModuleControl__isset;

class stLBN_ModuleControl {
 public:

  static const char* ascii_fingerprint; // = "77876CBE061C94D254BC9DC7348A409C";
  static const uint8_t binary_fingerprint[16]; // = {0x77,0x87,0x6C,0xBE,0x06,0x1C,0x94,0xD2,0x54,0xBC,0x9D,0xC7,0x34,0x8A,0x40,0x9C};

  stLBN_ModuleControl() : cwdimming(0), wwdimming(0), red(0), green(0), blue(0), pan(0), tilt(0), zoom(0), up(0), down(0), left(0), right(0), stop(0) {
  }

  virtual ~stLBN_ModuleControl() throw() {}

  int32_t cwdimming;
  int32_t wwdimming;
  int32_t red;
  int32_t green;
  int32_t blue;
  int32_t pan;
  int32_t tilt;
  int32_t zoom;
  int32_t up;
  int32_t down;
  int32_t left;
  int32_t right;
  int32_t stop;

  _stLBN_ModuleControl__isset __isset;

  void __set_cwdimming(const int32_t val) {
    cwdimming = val;
    __isset.cwdimming = true;
  }

  void __set_wwdimming(const int32_t val) {
    wwdimming = val;
    __isset.wwdimming = true;
  }

  void __set_red(const int32_t val) {
    red = val;
    __isset.red = true;
  }

  void __set_green(const int32_t val) {
    green = val;
    __isset.green = true;
  }

  void __set_blue(const int32_t val) {
    blue = val;
    __isset.blue = true;
  }

  void __set_pan(const int32_t val) {
    pan = val;
    __isset.pan = true;
  }

  void __set_tilt(const int32_t val) {
    tilt = val;
    __isset.tilt = true;
  }

  void __set_zoom(const int32_t val) {
    zoom = val;
    __isset.zoom = true;
  }

  void __set_up(const int32_t val) {
    up = val;
    __isset.up = true;
  }

  void __set_down(const int32_t val) {
    down = val;
    __isset.down = true;
  }

  void __set_left(const int32_t val) {
    left = val;
    __isset.left = true;
  }

  void __set_right(const int32_t val) {
    right = val;
    __isset.right = true;
  }

  void __set_stop(const int32_t val) {
    stop = val;
    __isset.stop = true;
  }

  bool operator == (const stLBN_ModuleControl & rhs) const
  {
    if (__isset.cwdimming != rhs.__isset.cwdimming)
      return false;
    else if (__isset.cwdimming && !(cwdimming == rhs.cwdimming))
      return false;
    if (__isset.wwdimming != rhs.__isset.wwdimming)
      return false;
    else if (__isset.wwdimming && !(wwdimming == rhs.wwdimming))
      return false;
    if (__isset.red != rhs.__isset.red)
      return false;
    else if (__isset.red && !(red == rhs.red))
      return false;
    if (__isset.green != rhs.__isset.green)
      return false;
    else if (__isset.green && !(green == rhs.green))
      return false;
    if (__isset.blue != rhs.__isset.blue)
      return false;
    else if (__isset.blue && !(blue == rhs.blue))
      return false;
    if (__isset.pan != rhs.__isset.pan)
      return false;
    else if (__isset.pan && !(pan == rhs.pan))
      return false;
    if (__isset.tilt != rhs.__isset.tilt)
      return false;
    else if (__isset.tilt && !(tilt == rhs.tilt))
      return false;
    if (__isset.zoom != rhs.__isset.zoom)
      return false;
    else if (__isset.zoom && !(zoom == rhs.zoom))
      return false;
    if (__isset.up != rhs.__isset.up)
      return false;
    else if (__isset.up && !(up == rhs.up))
      return false;
    if (__isset.down != rhs.__isset.down)
      return false;
    else if (__isset.down && !(down == rhs.down))
      return false;
    if (__isset.left != rhs.__isset.left)
      return false;
    else if (__isset.left && !(left == rhs.left))
      return false;
    if (__isset.right != rhs.__isset.right)
      return false;
    else if (__isset.right && !(right == rhs.right))
      return false;
    if (__isset.stop != rhs.__isset.stop)
      return false;
    else if (__isset.stop && !(stop == rhs.stop))
      return false;
    return true;
  }
  bool operator != (const stLBN_ModuleControl &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_ModuleControl & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_ModuleControl &a, stLBN_ModuleControl &b);

typedef struct _stLBN_ModuleSensor__isset {
  _stLBN_ModuleSensor__isset() : ambient(false), red(false), green(false), blue(false), cieX(false), cieY(false), temp(false), humid(false) {}
  bool ambient;
  bool red;
  bool green;
  bool blue;
  bool cieX;
  bool cieY;
  bool temp;
  bool humid;
} _stLBN_ModuleSensor__isset;

class stLBN_ModuleSensor {
 public:

  static const char* ascii_fingerprint; // = "372D6E15B9002FF6ABAF09435C5C61E0";
  static const uint8_t binary_fingerprint[16]; // = {0x37,0x2D,0x6E,0x15,0xB9,0x00,0x2F,0xF6,0xAB,0xAF,0x09,0x43,0x5C,0x5C,0x61,0xE0};

  stLBN_ModuleSensor() : ambient(0), red(0), green(0), blue(0), cieX(0), cieY(0), temp(0), humid(0) {
  }

  virtual ~stLBN_ModuleSensor() throw() {}

  int32_t ambient;
  int32_t red;
  int32_t green;
  int32_t blue;
  double cieX;
  double cieY;
  double temp;
  double humid;

  _stLBN_ModuleSensor__isset __isset;

  void __set_ambient(const int32_t val) {
    ambient = val;
    __isset.ambient = true;
  }

  void __set_red(const int32_t val) {
    red = val;
    __isset.red = true;
  }

  void __set_green(const int32_t val) {
    green = val;
    __isset.green = true;
  }

  void __set_blue(const int32_t val) {
    blue = val;
    __isset.blue = true;
  }

  void __set_cieX(const double val) {
    cieX = val;
    __isset.cieX = true;
  }

  void __set_cieY(const double val) {
    cieY = val;
    __isset.cieY = true;
  }

  void __set_temp(const double val) {
    temp = val;
    __isset.temp = true;
  }

  void __set_humid(const double val) {
    humid = val;
    __isset.humid = true;
  }

  bool operator == (const stLBN_ModuleSensor & rhs) const
  {
    if (__isset.ambient != rhs.__isset.ambient)
      return false;
    else if (__isset.ambient && !(ambient == rhs.ambient))
      return false;
    if (__isset.red != rhs.__isset.red)
      return false;
    else if (__isset.red && !(red == rhs.red))
      return false;
    if (__isset.green != rhs.__isset.green)
      return false;
    else if (__isset.green && !(green == rhs.green))
      return false;
    if (__isset.blue != rhs.__isset.blue)
      return false;
    else if (__isset.blue && !(blue == rhs.blue))
      return false;
    if (__isset.cieX != rhs.__isset.cieX)
      return false;
    else if (__isset.cieX && !(cieX == rhs.cieX))
      return false;
    if (__isset.cieY != rhs.__isset.cieY)
      return false;
    else if (__isset.cieY && !(cieY == rhs.cieY))
      return false;
    if (__isset.temp != rhs.__isset.temp)
      return false;
    else if (__isset.temp && !(temp == rhs.temp))
      return false;
    if (__isset.humid != rhs.__isset.humid)
      return false;
    else if (__isset.humid && !(humid == rhs.humid))
      return false;
    return true;
  }
  bool operator != (const stLBN_ModuleSensor &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_ModuleSensor & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_ModuleSensor &a, stLBN_ModuleSensor &b);

typedef struct _stLBN_Group__isset {
  _stLBN_Group__isset() : id(false) {}
  bool id;
} _stLBN_Group__isset;

class stLBN_Group {
 public:

  static const char* ascii_fingerprint; // = "E86CACEB22240450EDCBEFC3A83970E4";
  static const uint8_t binary_fingerprint[16]; // = {0xE8,0x6C,0xAC,0xEB,0x22,0x24,0x04,0x50,0xED,0xCB,0xEF,0xC3,0xA8,0x39,0x70,0xE4};

  stLBN_Group() : id(0) {
  }

  virtual ~stLBN_Group() throw() {}

  int32_t id;

  _stLBN_Group__isset __isset;

  void __set_id(const int32_t val) {
    id = val;
  }

  bool operator == (const stLBN_Group & rhs) const
  {
    if (!(id == rhs.id))
      return false;
    return true;
  }
  bool operator != (const stLBN_Group &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_Group & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_Group &a, stLBN_Group &b);

typedef struct _stLBN_Scene__isset {
  _stLBN_Scene__isset() : id(false), title(false) {}
  bool id;
  bool title;
} _stLBN_Scene__isset;

class stLBN_Scene {
 public:

  static const char* ascii_fingerprint; // = "3F5FC93B338687BC7235B1AB103F47B3";
  static const uint8_t binary_fingerprint[16]; // = {0x3F,0x5F,0xC9,0x3B,0x33,0x86,0x87,0xBC,0x72,0x35,0xB1,0xAB,0x10,0x3F,0x47,0xB3};

  stLBN_Scene() : id(0), title() {
  }

  virtual ~stLBN_Scene() throw() {}

  int32_t id;
  std::string title;

  _stLBN_Scene__isset __isset;

  void __set_id(const int32_t val) {
    id = val;
  }

  void __set_title(const std::string& val) {
    title = val;
  }

  bool operator == (const stLBN_Scene & rhs) const
  {
    if (!(id == rhs.id))
      return false;
    if (!(title == rhs.title))
      return false;
    return true;
  }
  bool operator != (const stLBN_Scene &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_Scene & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_Scene &a, stLBN_Scene &b);

typedef struct _stLBN_Module__isset {
  _stLBN_Module__isset() : id(false), type(false), control(false), groups(false), sensor(false), message(false), origin(false) {}
  bool id;
  bool type;
  bool control;
  bool groups;
  bool sensor;
  bool message;
  bool origin;
} _stLBN_Module__isset;

class stLBN_Module {
 public:

  static const char* ascii_fingerprint; // = "ED82D1B1877EBD9349BA1CD0C8A007ED";
  static const uint8_t binary_fingerprint[16]; // = {0xED,0x82,0xD1,0xB1,0x87,0x7E,0xBD,0x93,0x49,0xBA,0x1C,0xD0,0xC8,0xA0,0x07,0xED};

  stLBN_Module() : id(0), type((LBN_ModuleType::type)0), message() {
  }

  virtual ~stLBN_Module() throw() {}

  int32_t id;
  LBN_ModuleType::type type;
  stLBN_ModuleControl control;
  std::vector<stLBN_Group>  groups;
  stLBN_ModuleSensor sensor;
  std::string message;
  point origin;

  _stLBN_Module__isset __isset;

  void __set_id(const int32_t val) {
    id = val;
  }

  void __set_type(const LBN_ModuleType::type val) {
    type = val;
  }

  void __set_control(const stLBN_ModuleControl& val) {
    control = val;
  }

  void __set_groups(const std::vector<stLBN_Group> & val) {
    groups = val;
  }

  void __set_sensor(const stLBN_ModuleSensor& val) {
    sensor = val;
  }

  void __set_message(const std::string& val) {
    message = val;
  }

  void __set_origin(const point& val) {
    origin = val;
  }

  bool operator == (const stLBN_Module & rhs) const
  {
    if (!(id == rhs.id))
      return false;
    if (!(type == rhs.type))
      return false;
    if (!(control == rhs.control))
      return false;
    if (!(groups == rhs.groups))
      return false;
    if (!(sensor == rhs.sensor))
      return false;
    if (!(message == rhs.message))
      return false;
    if (!(origin == rhs.origin))
      return false;
    return true;
  }
  bool operator != (const stLBN_Module &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_Module & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_Module &a, stLBN_Module &b);

typedef struct _stLBN_Switch__isset {
  _stLBN_Switch__isset() : id(false), name(false), modules(false), scenes(false), groups(false), message(false) {}
  bool id;
  bool name;
  bool modules;
  bool scenes;
  bool groups;
  bool message;
} _stLBN_Switch__isset;

class stLBN_Switch {
 public:

  static const char* ascii_fingerprint; // = "F75461B670D113237FD7F831089F2760";
  static const uint8_t binary_fingerprint[16]; // = {0xF7,0x54,0x61,0xB6,0x70,0xD1,0x13,0x23,0x7F,0xD7,0xF8,0x31,0x08,0x9F,0x27,0x60};

  stLBN_Switch() : id(0), name(), message() {
  }

  virtual ~stLBN_Switch() throw() {}

  int32_t id;
  std::string name;
  std::vector<stLBN_Module>  modules;
  std::vector<stLBN_Scene>  scenes;
  std::vector<stLBN_Group>  groups;
  std::string message;

  _stLBN_Switch__isset __isset;

  void __set_id(const int32_t val) {
    id = val;
  }

  void __set_name(const std::string& val) {
    name = val;
  }

  void __set_modules(const std::vector<stLBN_Module> & val) {
    modules = val;
  }

  void __set_scenes(const std::vector<stLBN_Scene> & val) {
    scenes = val;
  }

  void __set_groups(const std::vector<stLBN_Group> & val) {
    groups = val;
  }

  void __set_message(const std::string& val) {
    message = val;
  }

  bool operator == (const stLBN_Switch & rhs) const
  {
    if (!(id == rhs.id))
      return false;
    if (!(name == rhs.name))
      return false;
    if (!(modules == rhs.modules))
      return false;
    if (!(scenes == rhs.scenes))
      return false;
    if (!(groups == rhs.groups))
      return false;
    if (!(message == rhs.message))
      return false;
    return true;
  }
  bool operator != (const stLBN_Switch &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_Switch & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_Switch &a, stLBN_Switch &b);

typedef struct _stLBN_Floor__isset {
  _stLBN_Floor__isset() : id(false), name(false), modules(false) {}
  bool id;
  bool name;
  bool modules;
} _stLBN_Floor__isset;

class stLBN_Floor {
 public:

  static const char* ascii_fingerprint; // = "12CD1476FCB8C28501629F5B9E2C101B";
  static const uint8_t binary_fingerprint[16]; // = {0x12,0xCD,0x14,0x76,0xFC,0xB8,0xC2,0x85,0x01,0x62,0x9F,0x5B,0x9E,0x2C,0x10,0x1B};

  stLBN_Floor() : id(0), name() {
  }

  virtual ~stLBN_Floor() throw() {}

  int32_t id;
  std::string name;
  std::vector<stLBN_Module>  modules;

  _stLBN_Floor__isset __isset;

  void __set_id(const int32_t val) {
    id = val;
  }

  void __set_name(const std::string& val) {
    name = val;
  }

  void __set_modules(const std::vector<stLBN_Module> & val) {
    modules = val;
  }

  bool operator == (const stLBN_Floor & rhs) const
  {
    if (!(id == rhs.id))
      return false;
    if (!(name == rhs.name))
      return false;
    if (!(modules == rhs.modules))
      return false;
    return true;
  }
  bool operator != (const stLBN_Floor &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_Floor & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_Floor &a, stLBN_Floor &b);

typedef struct _stLBN_Area__isset {
  _stLBN_Area__isset() : id(false), name(false), floors(false) {}
  bool id;
  bool name;
  bool floors;
} _stLBN_Area__isset;

class stLBN_Area {
 public:

  static const char* ascii_fingerprint; // = "73190249BC210E892C1196109887A55F";
  static const uint8_t binary_fingerprint[16]; // = {0x73,0x19,0x02,0x49,0xBC,0x21,0x0E,0x89,0x2C,0x11,0x96,0x10,0x98,0x87,0xA5,0x5F};

  stLBN_Area() : id(0), name() {
  }

  virtual ~stLBN_Area() throw() {}

  int32_t id;
  std::string name;
  std::vector<stLBN_Floor>  floors;

  _stLBN_Area__isset __isset;

  void __set_id(const int32_t val) {
    id = val;
  }

  void __set_name(const std::string& val) {
    name = val;
  }

  void __set_floors(const std::vector<stLBN_Floor> & val) {
    floors = val;
  }

  bool operator == (const stLBN_Area & rhs) const
  {
    if (!(id == rhs.id))
      return false;
    if (!(name == rhs.name))
      return false;
    if (!(floors == rhs.floors))
      return false;
    return true;
  }
  bool operator != (const stLBN_Area &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_Area & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_Area &a, stLBN_Area &b);

typedef struct _stLBN_DisasterInfo__isset {
  _stLBN_DisasterInfo__isset() : date(false), description(false) {}
  bool date;
  bool description;
} _stLBN_DisasterInfo__isset;

class stLBN_DisasterInfo {
 public:

  static const char* ascii_fingerprint; // = "07A9615F837F7D0A952B595DD3020972";
  static const uint8_t binary_fingerprint[16]; // = {0x07,0xA9,0x61,0x5F,0x83,0x7F,0x7D,0x0A,0x95,0x2B,0x59,0x5D,0xD3,0x02,0x09,0x72};

  stLBN_DisasterInfo() : date(), description() {
  }

  virtual ~stLBN_DisasterInfo() throw() {}

  std::string date;
  std::string description;

  _stLBN_DisasterInfo__isset __isset;

  void __set_date(const std::string& val) {
    date = val;
  }

  void __set_description(const std::string& val) {
    description = val;
  }

  bool operator == (const stLBN_DisasterInfo & rhs) const
  {
    if (!(date == rhs.date))
      return false;
    if (!(description == rhs.description))
      return false;
    return true;
  }
  bool operator != (const stLBN_DisasterInfo &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_DisasterInfo & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_DisasterInfo &a, stLBN_DisasterInfo &b);

typedef struct _stLBN_PowerMeter__isset {
  _stLBN_PowerMeter__isset() : hour(false), minute(false), second(false), dVoltage(false), dCurrent(false), dPower(false) {}
  bool hour;
  bool minute;
  bool second;
  bool dVoltage;
  bool dCurrent;
  bool dPower;
} _stLBN_PowerMeter__isset;

class stLBN_PowerMeter {
 public:

  static const char* ascii_fingerprint; // = "9837094CC99FC796C8484D72416C8459";
  static const uint8_t binary_fingerprint[16]; // = {0x98,0x37,0x09,0x4C,0xC9,0x9F,0xC7,0x96,0xC8,0x48,0x4D,0x72,0x41,0x6C,0x84,0x59};

  stLBN_PowerMeter() : hour(0), minute(0), second(0), dVoltage(0), dCurrent(0), dPower(0) {
  }

  virtual ~stLBN_PowerMeter() throw() {}

  int32_t hour;
  int32_t minute;
  int32_t second;
  double dVoltage;
  double dCurrent;
  double dPower;

  _stLBN_PowerMeter__isset __isset;

  void __set_hour(const int32_t val) {
    hour = val;
  }

  void __set_minute(const int32_t val) {
    minute = val;
  }

  void __set_second(const int32_t val) {
    second = val;
  }

  void __set_dVoltage(const double val) {
    dVoltage = val;
  }

  void __set_dCurrent(const double val) {
    dCurrent = val;
  }

  void __set_dPower(const double val) {
    dPower = val;
  }

  bool operator == (const stLBN_PowerMeter & rhs) const
  {
    if (!(hour == rhs.hour))
      return false;
    if (!(minute == rhs.minute))
      return false;
    if (!(second == rhs.second))
      return false;
    if (!(dVoltage == rhs.dVoltage))
      return false;
    if (!(dCurrent == rhs.dCurrent))
      return false;
    if (!(dPower == rhs.dPower))
      return false;
    return true;
  }
  bool operator != (const stLBN_PowerMeter &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_PowerMeter & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_PowerMeter &a, stLBN_PowerMeter &b);

typedef struct _stLBN_PowerMeterOneDay__isset {
  _stLBN_PowerMeterOneDay__isset() : year(false), month(false), day(false), powermeters(false) {}
  bool year;
  bool month;
  bool day;
  bool powermeters;
} _stLBN_PowerMeterOneDay__isset;

class stLBN_PowerMeterOneDay {
 public:

  static const char* ascii_fingerprint; // = "242DDE879BE97AB9996EE5E57F45E6B7";
  static const uint8_t binary_fingerprint[16]; // = {0x24,0x2D,0xDE,0x87,0x9B,0xE9,0x7A,0xB9,0x99,0x6E,0xE5,0xE5,0x7F,0x45,0xE6,0xB7};

  stLBN_PowerMeterOneDay() : year(0), month(0), day(0) {
  }

  virtual ~stLBN_PowerMeterOneDay() throw() {}

  int32_t year;
  int32_t month;
  int32_t day;
  std::vector<stLBN_PowerMeter>  powermeters;

  _stLBN_PowerMeterOneDay__isset __isset;

  void __set_year(const int32_t val) {
    year = val;
  }

  void __set_month(const int32_t val) {
    month = val;
  }

  void __set_day(const int32_t val) {
    day = val;
  }

  void __set_powermeters(const std::vector<stLBN_PowerMeter> & val) {
    powermeters = val;
  }

  bool operator == (const stLBN_PowerMeterOneDay & rhs) const
  {
    if (!(year == rhs.year))
      return false;
    if (!(month == rhs.month))
      return false;
    if (!(day == rhs.day))
      return false;
    if (!(powermeters == rhs.powermeters))
      return false;
    return true;
  }
  bool operator != (const stLBN_PowerMeterOneDay &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_PowerMeterOneDay & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_PowerMeterOneDay &a, stLBN_PowerMeterOneDay &b);

typedef struct _stLBN_Schedule__isset {
  _stLBN_Schedule__isset() : id(false), time(false), scene(false), repeatAll(false), repeatDays(false) {}
  bool id;
  bool time;
  bool scene;
  bool repeatAll;
  bool repeatDays;
} _stLBN_Schedule__isset;

class stLBN_Schedule {
 public:

  static const char* ascii_fingerprint; // = "AD8F557835D91E74B851CA7CCA4947D2";
  static const uint8_t binary_fingerprint[16]; // = {0xAD,0x8F,0x55,0x78,0x35,0xD9,0x1E,0x74,0xB8,0x51,0xCA,0x7C,0xCA,0x49,0x47,0xD2};

  stLBN_Schedule() : id(0), time(0), repeatAll(0) {
  }

  virtual ~stLBN_Schedule() throw() {}

  int32_t id;
  int64_t time;
  stLBN_Scene scene;
  bool repeatAll;
  std::vector<bool>  repeatDays;

  _stLBN_Schedule__isset __isset;

  void __set_id(const int32_t val) {
    id = val;
  }

  void __set_time(const int64_t val) {
    time = val;
  }

  void __set_scene(const stLBN_Scene& val) {
    scene = val;
  }

  void __set_repeatAll(const bool val) {
    repeatAll = val;
  }

  void __set_repeatDays(const std::vector<bool> & val) {
    repeatDays = val;
  }

  bool operator == (const stLBN_Schedule & rhs) const
  {
    if (!(id == rhs.id))
      return false;
    if (!(time == rhs.time))
      return false;
    if (!(scene == rhs.scene))
      return false;
    if (!(repeatAll == rhs.repeatAll))
      return false;
    if (!(repeatDays == rhs.repeatDays))
      return false;
    return true;
  }
  bool operator != (const stLBN_Schedule &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_Schedule & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_Schedule &a, stLBN_Schedule &b);

typedef struct _stLBN_ContextRule__isset {
  _stLBN_ContextRule__isset() : id(false), title(false), description(false), scene(false), hasScene(false), enabled(false) {}
  bool id;
  bool title;
  bool description;
  bool scene;
  bool hasScene;
  bool enabled;
} _stLBN_ContextRule__isset;

class stLBN_ContextRule {
 public:

  static const char* ascii_fingerprint; // = "95EFC9A0E6FDA683BED0F9180FDC66B8";
  static const uint8_t binary_fingerprint[16]; // = {0x95,0xEF,0xC9,0xA0,0xE6,0xFD,0xA6,0x83,0xBE,0xD0,0xF9,0x18,0x0F,0xDC,0x66,0xB8};

  stLBN_ContextRule() : id(0), title(), description(), hasScene(0), enabled(0) {
  }

  virtual ~stLBN_ContextRule() throw() {}

  int32_t id;
  std::string title;
  std::string description;
  stLBN_Scene scene;
  bool hasScene;
  bool enabled;

  _stLBN_ContextRule__isset __isset;

  void __set_id(const int32_t val) {
    id = val;
  }

  void __set_title(const std::string& val) {
    title = val;
  }

  void __set_description(const std::string& val) {
    description = val;
  }

  void __set_scene(const stLBN_Scene& val) {
    scene = val;
  }

  void __set_hasScene(const bool val) {
    hasScene = val;
  }

  void __set_enabled(const bool val) {
    enabled = val;
  }

  bool operator == (const stLBN_ContextRule & rhs) const
  {
    if (!(id == rhs.id))
      return false;
    if (!(title == rhs.title))
      return false;
    if (!(description == rhs.description))
      return false;
    if (!(scene == rhs.scene))
      return false;
    if (!(hasScene == rhs.hasScene))
      return false;
    if (!(enabled == rhs.enabled))
      return false;
    return true;
  }
  bool operator != (const stLBN_ContextRule &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_ContextRule & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_ContextRule &a, stLBN_ContextRule &b);

typedef struct _stLBN_SolarInfo__isset {
  _stLBN_SolarInfo__isset() : currentTime(false), latitude(false), longitude(false), azimuth(false), elevation(false), sunriseTime(false), suntransitTime(false), sunsetTime(false) {}
  bool currentTime;
  bool latitude;
  bool longitude;
  bool azimuth;
  bool elevation;
  bool sunriseTime;
  bool suntransitTime;
  bool sunsetTime;
} _stLBN_SolarInfo__isset;

class stLBN_SolarInfo {
 public:

  static const char* ascii_fingerprint; // = "364EBD69B251B3387D4979EC4E66F0F1";
  static const uint8_t binary_fingerprint[16]; // = {0x36,0x4E,0xBD,0x69,0xB2,0x51,0xB3,0x38,0x7D,0x49,0x79,0xEC,0x4E,0x66,0xF0,0xF1};

  stLBN_SolarInfo() : currentTime(0), latitude(0), longitude(0), azimuth(0), elevation(0), sunriseTime(0), suntransitTime(0), sunsetTime(0) {
  }

  virtual ~stLBN_SolarInfo() throw() {}

  int64_t currentTime;
  double latitude;
  double longitude;
  double azimuth;
  double elevation;
  int64_t sunriseTime;
  int64_t suntransitTime;
  int64_t sunsetTime;

  _stLBN_SolarInfo__isset __isset;

  void __set_currentTime(const int64_t val) {
    currentTime = val;
  }

  void __set_latitude(const double val) {
    latitude = val;
  }

  void __set_longitude(const double val) {
    longitude = val;
  }

  void __set_azimuth(const double val) {
    azimuth = val;
  }

  void __set_elevation(const double val) {
    elevation = val;
  }

  void __set_sunriseTime(const int64_t val) {
    sunriseTime = val;
  }

  void __set_suntransitTime(const int64_t val) {
    suntransitTime = val;
  }

  void __set_sunsetTime(const int64_t val) {
    sunsetTime = val;
  }

  bool operator == (const stLBN_SolarInfo & rhs) const
  {
    if (!(currentTime == rhs.currentTime))
      return false;
    if (!(latitude == rhs.latitude))
      return false;
    if (!(longitude == rhs.longitude))
      return false;
    if (!(azimuth == rhs.azimuth))
      return false;
    if (!(elevation == rhs.elevation))
      return false;
    if (!(sunriseTime == rhs.sunriseTime))
      return false;
    if (!(suntransitTime == rhs.suntransitTime))
      return false;
    if (!(sunsetTime == rhs.sunsetTime))
      return false;
    return true;
  }
  bool operator != (const stLBN_SolarInfo &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_SolarInfo & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_SolarInfo &a, stLBN_SolarInfo &b);

typedef struct _stLBN_GraphData__isset {
  _stLBN_GraphData__isset() : title(false), values(false) {}
  bool title;
  bool values;
} _stLBN_GraphData__isset;

class stLBN_GraphData {
 public:

  static const char* ascii_fingerprint; // = "061F1470A5BFC7F82E73CA7B179FFF41";
  static const uint8_t binary_fingerprint[16]; // = {0x06,0x1F,0x14,0x70,0xA5,0xBF,0xC7,0xF8,0x2E,0x73,0xCA,0x7B,0x17,0x9F,0xFF,0x41};

  stLBN_GraphData() : title() {
  }

  virtual ~stLBN_GraphData() throw() {}

  std::string title;
  std::vector<double>  values;

  _stLBN_GraphData__isset __isset;

  void __set_title(const std::string& val) {
    title = val;
  }

  void __set_values(const std::vector<double> & val) {
    values = val;
  }

  bool operator == (const stLBN_GraphData & rhs) const
  {
    if (!(title == rhs.title))
      return false;
    if (!(values == rhs.values))
      return false;
    return true;
  }
  bool operator != (const stLBN_GraphData &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_GraphData & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_GraphData &a, stLBN_GraphData &b);

typedef struct _stLBN_Chart__isset {
  _stLBN_Chart__isset() : title(false), data(false), xLabels(false) {}
  bool title;
  bool data;
  bool xLabels;
} _stLBN_Chart__isset;

class stLBN_Chart {
 public:

  static const char* ascii_fingerprint; // = "609BF462F28E3F9C7FB28CB30E08D802";
  static const uint8_t binary_fingerprint[16]; // = {0x60,0x9B,0xF4,0x62,0xF2,0x8E,0x3F,0x9C,0x7F,0xB2,0x8C,0xB3,0x0E,0x08,0xD8,0x02};

  stLBN_Chart() : title() {
  }

  virtual ~stLBN_Chart() throw() {}

  std::string title;
  std::vector<stLBN_GraphData>  data;
  std::vector<std::string>  xLabels;

  _stLBN_Chart__isset __isset;

  void __set_title(const std::string& val) {
    title = val;
  }

  void __set_data(const std::vector<stLBN_GraphData> & val) {
    data = val;
  }

  void __set_xLabels(const std::vector<std::string> & val) {
    xLabels = val;
  }

  bool operator == (const stLBN_Chart & rhs) const
  {
    if (!(title == rhs.title))
      return false;
    if (!(data == rhs.data))
      return false;
    if (!(xLabels == rhs.xLabels))
      return false;
    return true;
  }
  bool operator != (const stLBN_Chart &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_Chart & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_Chart &a, stLBN_Chart &b);

typedef struct _stLBN_ParkingSensor__isset {
  _stLBN_ParkingSensor__isset() : floor(false), zone(false), slot(false), value(false) {}
  bool floor;
  bool zone;
  bool slot;
  bool value;
} _stLBN_ParkingSensor__isset;

class stLBN_ParkingSensor {
 public:

  static const char* ascii_fingerprint; // = "FE6EEA0EE646C9880F01CB7CB8D8504D";
  static const uint8_t binary_fingerprint[16]; // = {0xFE,0x6E,0xEA,0x0E,0xE6,0x46,0xC9,0x88,0x0F,0x01,0xCB,0x7C,0xB8,0xD8,0x50,0x4D};

  stLBN_ParkingSensor() : floor(0), zone(0), slot(0), value(0) {
  }

  virtual ~stLBN_ParkingSensor() throw() {}

  int8_t floor;
  int8_t zone;
  int8_t slot;
  int8_t value;

  _stLBN_ParkingSensor__isset __isset;

  void __set_floor(const int8_t val) {
    floor = val;
  }

  void __set_zone(const int8_t val) {
    zone = val;
  }

  void __set_slot(const int8_t val) {
    slot = val;
  }

  void __set_value(const int8_t val) {
    value = val;
  }

  bool operator == (const stLBN_ParkingSensor & rhs) const
  {
    if (!(floor == rhs.floor))
      return false;
    if (!(zone == rhs.zone))
      return false;
    if (!(slot == rhs.slot))
      return false;
    if (!(value == rhs.value))
      return false;
    return true;
  }
  bool operator != (const stLBN_ParkingSensor &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_ParkingSensor & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_ParkingSensor &a, stLBN_ParkingSensor &b);

typedef struct _stLBN_SchedulePreset__isset {
  _stLBN_SchedulePreset__isset() : id(false), title(false) {}
  bool id;
  bool title;
} _stLBN_SchedulePreset__isset;

class stLBN_SchedulePreset {
 public:

  static const char* ascii_fingerprint; // = "3F5FC93B338687BC7235B1AB103F47B3";
  static const uint8_t binary_fingerprint[16]; // = {0x3F,0x5F,0xC9,0x3B,0x33,0x86,0x87,0xBC,0x72,0x35,0xB1,0xAB,0x10,0x3F,0x47,0xB3};

  stLBN_SchedulePreset() : id(0), title() {
  }

  virtual ~stLBN_SchedulePreset() throw() {}

  int32_t id;
  std::string title;

  _stLBN_SchedulePreset__isset __isset;

  void __set_id(const int32_t val) {
    id = val;
  }

  void __set_title(const std::string& val) {
    title = val;
  }

  bool operator == (const stLBN_SchedulePreset & rhs) const
  {
    if (!(id == rhs.id))
      return false;
    if (!(title == rhs.title))
      return false;
    return true;
  }
  bool operator != (const stLBN_SchedulePreset &rhs) const {
    return !(*this == rhs);
  }

  bool operator < (const stLBN_SchedulePreset & ) const;

  uint32_t read(::apache::thrift::protocol::TProtocol* iprot);
  uint32_t write(::apache::thrift::protocol::TProtocol* oprot) const;

};

void swap(stLBN_SchedulePreset &a, stLBN_SchedulePreset &b);

} // namespace

#endif
