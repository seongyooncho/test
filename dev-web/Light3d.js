"use strict";

export default class {
  constructor(scene) {
    let lights = [];

    for (var i = 0; i < 16; i++) {
      let light = new THREE.SpotLight(256*256*256-1);
      light.position.z = -1000;
      scene.add(light);
      lights.push(light);
    }

    this.scene = scene;
    this.lights_ = lights;
    this.helpers_ = [];

    let loader = new THREE.STLLoader();
    loader.load( './obj/Lights/DMX.stl', ( geometry ) => {
      this.geometryDmx_ = geometry;
    } );
    loader.load( './obj/Lights/Bar.stl', ( geometry ) => {
      this.geometryBar_ = geometry;
    } );
    loader.load( './obj/Lights/Moving.stl', ( geometry ) => {
      this.geometryMoving_ = geometry;
    } );
    loader.load( './obj/Lights/MR16.stl', ( geometry ) => {
      this.geometryMR16_ = geometry;
    } );
    loader.load( './obj/Lights/Square.stl', ( geometry ) => {
      this.geometrySquare_ = geometry;
    } );
    loader.load( './obj/Lights/Street.stl', ( geometry ) => {
      this.geometryStreet_ = geometry;
    } );
  }
  setFloor(offset, lbnFloor) {
    this.enable();

    let scene = this.scene;

    for (let helper of this.helpers_) {
      scene.remove(helper);
    }

    for (var i = 0; i < 16; i++) {
      let light = this.lights_[i];
      let module = lbnFloor.modules[i];

      light.position.x = module.origin.x + offset.x;
      light.position.y = module.origin.y + offset.y;
      light.position.z = 5 + offset.z;
      light.target.position.set(light.position.x, light.position.y, offset.z);
      light.angle = Math.PI/2;
      light.distance = 10;

      setColor(light, module.type, module.control);

      light.target.updateMatrixWorld();

      let helper = new THREE.SpotLightHelper(light);
      helper.cone.geometry = getHelperGeometry(module.type, this);
      helper.cone.material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
      helper.cone.material.color.copy(light.color);
      helper.cone.material.wireframe = true;
      helper.cone.material.wireframeLineWidth = 0.1;
      helper.cone.scale.x = 0.01;
      helper.cone.scale.y = 0.01; 
      helper.cone.scale.z = 0.01;
      helper.cone.rotation.y = Math.PI;
      helper.cone.position.z += -3.79;
      scene.add(helper);

      this.helpers_[i] = helper;
    }
  }
  updateFloor(lbnFloor) {
    let scene = this.scene;

    for (var i = 0; i < 16; i++) {
      let light = this.lights_[i];
      let helper = this.helpers_[i];
      let module = lbnFloor.modules[i];

      setColor(light, module.type, module.control);
      helper.cone.material.color.copy(light.color);
      //helper.cone.material.wireframe=false;
    }
  }
  focusLights(indices) {
    for (let helper of this.helpers_) {
      helper.cone.material.wireframe = true;
    }
    for (let helper of this.helpers_) {
      for (let index of indices) {
        if (helper === this.helpers_[index]) {
          helper.cone.material.wireframe = false;
        }
      }
    }
  }
  enable() {
    if (this.enabled) {
      return;
    }
    let scene = this.scene;
    for (let light of this.lights_) {
      scene.add(light);
    }
    this.enabled = true;
  }

  disable() {
    let scene = this.scene;
    for (let light of this.lights_) {
      light.position.z = -1000;
      light.target.position.z = -2000;
      light.target.updateMatrixWorld();
    }
    for (let helper of this.helpers_) {
      scene.remove(helper);
    }
  }
}

function setColor(light, type, control) {
  // COLOR
  if (type === LBN_ModuleType.SQUARE_COLOR || type === LBN_ModuleType.DMX_COLOR) {
    light.intensity = (control.cwdimming / 100 + control.wwdimming / 100);
    light.color.r = control.red / 255;
    light.color.g = control.green / 255;
    light.color.b = control.blue / 255;
  }
  // CW
  else if (type === LBN_ModuleType.MR16_COOL_WHITE || type === LBN_ModuleType.BAR_COOL_WHITE || type === LBN_ModuleType.MOVING_WHITE) {
    light.intensity = control.cwdimming / 100;
    light.color.r = 0.9;
    light.color.g = 0.9;
    light.color.b = 1;
  }
  // WW
  else if (type === LBN_ModuleType.MR16_WARM_WHITE || type === LBN_ModuleType.STREET_WHITE) {
    light.intensity = control.wwdimming / 100;
    light.color.r = 1;
    light.color.g = 1;
    light.color.b = 0.8;
  }
}

function getHelperGeometry(type, obj) {
  if (type === LBN_ModuleType.SQUARE_COLOR) {
    return obj.geometrySquare_;
  }
  if (type === LBN_ModuleType.MR16_WARM_WHITE || type === LBN_ModuleType.MR16_COOL_WHITE) {
    return obj.geometryMR16_;
  }
  if (type === LBN_ModuleType.STREET_WHITE) {
    return obj.geometryStreet_;
  }
  if (type === LBN_ModuleType.DMX_COLOR) {
    return obj.geometryDmx_;
  }
  if (type === LBN_ModuleType.BAR_COOL_WHITE) {
    return obj.geometryBar_;
  }
  if (type === LBN_ModuleType.MOVING_WHITE) {
    return obj.geometryMoving_;
  }
}
