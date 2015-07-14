"use strict";

import Solar3d from 'Solar3d'; 
import ShellDae from 'ShellDae';
import FloorDae from 'FloorDae';
import ParkingDae from 'ParkingDae';
import Light3d from 'Light3d';

export {start};
export let solar;
export {setLbnFloors};
export {onModuleChange};

let SCALE_I = new THREE.Vector3(1, 1, 1);
let SCALE_UP = new THREE.Vector3(1.05, 1.05, 1.05);
let SCALE_DOWN = new THREE.Vector3(0.95, 0.95, 0.95);

let changeModule;

function onModuleChange(callback) {
  changeModule = callback;
}

var camera, scene, renderer, light;

let ambient, directionalLight;

let container;
let shell;
let floors = [];
let focusedDae;
let oldLookAt = new THREE.Vector3();

let focusedFloorIndex = -1;
let focusedLightIndices = [];
let lbnFloors;

let dragged = false;

var width;
var height = 890;
var destX = 0, destY = 0;

var GuiModule = function() {
  this.Selected_Module = '#01';

  this.Type = "BAR";

  this.control = {};
  this.control.Cool_White = 0;
  this.control.Warm_White = 0;
  this.control.Color = [ 0, 128, 255 ];

  this.sensor = {
    ambient: 0,
    blue: 0,
    cieX: 0,
    cieY: 0,
    green: 0,
    humid: 0,
    red: 0,
    temp: 0,
  };

  this.Message = "Hello";
};

var guiModule = new GuiModule();
var gui = new dat.GUI({ autoPlace: false });

function start() {
  init();
  animate();
}

function setLbnFloors(floors) {
  lbnFloors = floors;
  if (focusedFloorIndex !== -1) {
    light.updateFloor(lbnFloors[focusedFloorIndex]);
  }
}

function init() {
  container = $("#scene");

  width = container.width();
  camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
  camera.position.y = 40;
  camera.position.z = 20;
  camera.up.set( 0, 0, 1 );

  // scene
  scene = new THREE.Scene();

  ambient = new THREE.AmbientLight( 0x444444 );
  scene.add( ambient );

  directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 1000, 1000 );
  scene.add( directionalLight );

  light = new Light3d(scene);

  for (let i = 0; i < 8; i++) {
    let floor;
    if (i === 7) {
      floor = new ParkingDae();
    } else {
      floor = new FloorDae(i);
    }
    scene.add( floor.dae);
    floors.push(floor);
  }

  shell = new ShellDae();
  scene.add( shell.dae );

  solar = new Solar3d(); 
  scene.add(solar.scene);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor( 0x000000, 0.1);
  renderer.setSize( width, height );
  container.append( renderer.domElement );

  focusedDae = shell;
  focusedFloorIndex = -1;

  container[0].addEventListener( 'mousemove', onDocumentMouseMove, false );
  container.click(onContainerClick);
  window.onresize = onWindowResize;

  // gui
  var customContainer = document.getElementById('gui');
  customContainer.appendChild(gui.domElement);

  gui.add(guiModule, 'Selected_Module');
  gui.add(guiModule, 'Type');
  gui.add(guiModule, 'Message');

  
  let guiControl = gui.addFolder('Control');

  let cwController = guiControl.add(guiModule.control, 'Cool_White', 0, 100);
  let wwController = guiControl.add(guiModule.control, 'Warm_White', 0, 100);
  let colorController = guiControl.addColor(guiModule.control, 'Color');

  cwController.onChange(function(value) {
    value = Math.round(value);
    for (let index of focusedLightIndices) {
      let selectedModule = getModuleWithLightIndex(index); 
      let availableControl = getAvailableControls([selectedModule]);
      if (!availableControl.cw) {
        continue;
      }

      let newControl = $.extend(true, {}, selectedModule.control);
      newControl.cwdimming = value;
      changeModule([selectedModule.id], newControl);
    }
  });

  wwController.onChange(function(value) {
    value = Math.round(value);
    for (let index of focusedLightIndices) {
      let selectedModule = getModuleWithLightIndex(index);
      let availableControl = getAvailableControls([selectedModule]);
      if (!availableControl.ww) {
        continue;
      }

      let newControl = $.extend(true, {}, selectedModule.control);
      newControl.wwdimming = value;
      changeModule([selectedModule.id], newControl);
    }
  });

  colorController.onChange(function(value) {
    if (typeof value === "string") {
      value = hexToRgb(value);
    }
    let red = Math.round(value[0]);
    let green = Math.round(value[1]);
    let blue = Math.round(value[2]);

    for (let index of focusedLightIndices) {
      let selectedModule = getModuleWithLightIndex(index);
      let availableControl = getAvailableControls([selectedModule]);
      if (!availableControl.ww) {
        continue;
      }
      let newControl = $.extend(true, {}, selectedModule.control);
      newControl.red = red;
      newControl.green = green;
      newControl.blue = blue;
      changeModule([selectedModule.id], newControl);
    }
  });

  guiControl.open();

  var guiSensor = gui.addFolder('Sensor');

  guiSensor.add(guiModule.sensor, 'ambient').listen();
  guiSensor.add(guiModule.sensor, 'temp').listen();
  guiSensor.add(guiModule.sensor, 'humid').listen();
  guiSensor.add(guiModule.sensor, 'red').listen();
  guiSensor.add(guiModule.sensor, 'green').listen();
  guiSensor.add(guiModule.sensor, 'blue').listen();
  guiSensor.add(guiModule.sensor, 'cieX').listen();
  guiSensor.add(guiModule.sensor, 'cieY').listen();

  guiSensor.open();
}

function onContainerClick(event) {
  if (dragged) {
    dragged = false;
    return;
  }

  // Floor is focused. Select light module
  if (focusedFloorIndex != -1) {
    let detectedLight = detectLight(event);

    if (detectedLight != -1) {
      if (event.shiftKey) {
        if (focusedLightIndices.indexOf(detectedLight) === -1) {
          focusedLightIndices.push(detectedLight);
        }
        setGUI(focusedLightIndices);
      } else {
        focusedLightIndices = [detectedLight];
        setGUI(focusedLightIndices);
      }
    } else {
      if (focusedLightIndices.length === 0) {
        clearFloorSelection();
      } else {
        clearGUI();
        focusedLightIndices = [];
      }
    }

    light.focusLights(focusedLightIndices);
  } 
  // Floor is not focused. Select floor
  else {
    let detectedFloorIndex = detectFloor(event);

    if (detectedFloorIndex >= 0) {
      let detectedFloor = floors[detectedFloorIndex];
      focusedDae = detectedFloor;
      focusedFloorIndex = detectedFloorIndex;

      shell.dae.visible = false;
      solar.scene.visible = false;

      for (let floor of floors) {
        floor.dae.visible = false;
        floor.focused = false;
      }

      detectedFloor.dae.visible = true;
      detectedFloor.focused = true;

      light.setFloor(detectedFloor.dae.position, lbnFloors[focusedFloorIndex]);
    } else {
      clearFloorSelection();
    }
  }
}

function onDocumentMouseMove( event ) {
  if (event.which !== 1) {
    if (detectObject(event, shell)) {
      shell.opacity = 0;
      solar.scene.visible = false;

      if (focusedDae === shell) {
        let detectedFloorIndex = detectFloor(event);
        if (detectedFloorIndex >= 0) {
          let detectedFloor = floors[detectedFloorIndex];

          for (let floor of floors) {
            floor.scale = (floor === detectedFloor)?1.1:1;
          }
        } else {
          for (let floor of floors) {
            floor.scale = 1;
          }
        }
      }

    } else if (focusedFloorIndex === -1) {
      shell.opacity = 1;
      solar.scene.visible = true;
      for (let floor of floors) {
        floor.scale = 1;
      }
    }
  } else {
    dragged = true;
    destX += event.movementX;
    destY += event.movementY;
  }
}

function onWindowResize( event ) {
  width = container.width();

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize( width, height );

  // TODO: buggy, refactor needed
  $(".chart canvas").height(250);
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  let cameraPosition = focusedDae.getCameraPosition(destX, destY);
  camera.position.x = camera.position.x * 0.9 + cameraPosition.x * 0.1;
  camera.position.y = camera.position.y * 0.9 + cameraPosition.y * 0.1;
  camera.position.z = camera.position.z * 0.9 + cameraPosition.z * 0.1;

  let lookAt = oldLookAt;
  let focusedCenter = focusedDae.dae.position.clone();
  if (focusedDae === shell) {
    focusedCenter.z += 5;
  }
  lookAt.multiplyScalar(0.9).add(focusedCenter.multiplyScalar(0.1));
  camera.lookAt(lookAt);
  oldLookAt = lookAt;

  renderer.render( scene, camera );

  shell.animate();
  for(let floor of floors) {
    floor.animate();
  }

  if (focusedDae !== shell) {
    ambient.intensity = 0.2;
    directionalLight.intensity = 0.2;
    //scene.remove(ambient);
    //scene.remove(directionalLight);
  } else {
    ambient.intensity = 1.0;
    directionalLight.intensity = 1.0;
    //scene.add(ambient);
    //scene.add(directionalLight);
  }

  // Iterate over all controllers
  for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }

}

function detectLight(event) {
  var vector = new THREE.Vector3();
  var raycaster = new THREE.Raycaster();
  var dir = new THREE.Vector3();

  vector.set( ( event.offsetX / width ) * 2 - 1, - ( event.offsetY / height ) * 2 + 1, 0.5 ); // z = 0.5 important!

  vector.unproject( camera );
  raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

  let intersect = {index: -1, distance: 1000};
  for (let i = 0; i < light.helpers_.length; i++) {
    let floor = light.helpers_[i];
    var intersects = raycaster.intersectObjects(floor.children, true);
    if (intersects.length > 0 && intersects[0].distance < intersect.distance) {
      intersect.index = i;
    }
  }
  return intersect.index; // -1 if not found
}
function getModuleWithLightIndex(index) {
  for (let i = 0; i < floors.length; i++) {
    if (floors[i] === focusedDae) {
      return lbnFloors[i].modules[index];
    }
  }
}

function detectFloor(event) {
  var vector = new THREE.Vector3();
  var raycaster = new THREE.Raycaster();
  var dir = new THREE.Vector3();

  vector.set( ( event.offsetX / width ) * 2 - 1, - ( event.offsetY / height ) * 2 + 1, 0.5 ); // z = 0.5 important!

  vector.unproject( camera );
  raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

  let intersect = {index: -1, distance: 1000};
  for (let i = 0; i < floors.length; i++) {
    let floor = floors[i];
    if (floor.dae.visible === false) {
      continue;
    }
    var intersects = raycaster.intersectObjects( floor.dae.children, true);
    if (intersects.length > 0 && intersects[0].distance < intersect.distance) {
      intersect.index = i;
    }
  }
  return intersect.index; // -1 if not found
}

function detectObject(event, object) {
  var vector = new THREE.Vector3();
  var raycaster = new THREE.Raycaster();
  var dir = new THREE.Vector3();

  vector.set( ( event.offsetX / width ) * 2 - 1, - ( event.offsetY / height ) * 2 + 1, 0.5 ); // z = 0.5 important!
  vector.unproject( camera );
  raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

  var intersects = raycaster.intersectObjects( object.dae.children, true);
  return intersects.length > 0;
}

function getKeyByValue(object, value) {
  for (let key in object) {
    if (object[key] === value) {
      return key;
    }
  }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [ 
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

function setGUI(indices) {
  let modules = [];
  let cwSlider = $("#gui .folder:eq( 0 ) li:eq( 1 )");
  let wwSlider = $("#gui .folder:eq( 0 ) li:eq( 2 )");
  let colorSlider = $("#gui .folder:eq( 0 ) li:eq( 3 )");
  let messageText = $("#gui li:eq( 2 )");
  let sensorFolder = $("#gui .folder:eq( 1 )");
  for (let index of indices) {
    modules.push(getModuleWithLightIndex(index));
  }

  if (modules.length > 1) {
    hideGUI([messageText, sensorFolder]);
  } else {
    showGUI([messageText, sensorFolder]);
  }

  let module = modules[0];

  guiModule.Selected_Module = getModuleIds(modules);
  guiModule.Type = getModuleTypes(modules); 
  guiModule.Message = module.message;
  guiModule.control.Color = [module.control.red, module.control.green, module.control.blue];
  guiModule.control.Cool_White = module.control.cwdimming;
  guiModule.control.Warm_White = module.control.wwdimming;

  guiModule.sensor.ambient = module.sensor.ambient;
  guiModule.sensor.temp = module.sensor.temp;
  guiModule.sensor.humid = module.sensor.humid;
  guiModule.sensor.red = module.sensor.red;
  guiModule.sensor.green = module.sensor.green;
  guiModule.sensor.blue = module.sensor.blue;
  guiModule.sensor.cieX = module.sensor.cieX;
  guiModule.sensor.cieY = module.sensor.cieY;

  $("#gui").css("visibility", "visible");

  let availableControls = getAvailableControls(modules);
  if (availableControls.cw) {
    cwSlider.removeClass("hidden");
  } else {
    cwSlider.addClass("hidden");
  }
  if (availableControls.ww) {
    wwSlider.removeClass("hidden");
  } else {
    wwSlider.addClass("hidden");
  }
  if (availableControls.color) {
    colorSlider.removeClass("hidden");
  } else {
    colorSlider.addClass("hidden");
  }
}

function clearGUI() {
  $("#gui").css("visibility", "hidden");
}

function clearFloorSelection() {
  focusedDae = shell;
  focusedFloorIndex = -1;

  shell.dae.visible = true;
  solar.scene.visible = true;

  for (let floor of floors) {
    floor.dae.visible = true;
    floor.focused = false;
  }
  light.disable();
}

function getModuleIds(modules) {
  let result;
  for (let module of modules) {
    if (!result) {
      result = "#" + module.id;
    } else {
      result += ", #" + module.id;
    }
  }
  return result;
}

function getModuleTypes(modules) {
  let result;
  let uniqueTypes = [];
  for (let module of modules) {
    if (uniqueTypes.indexOf(module.type) === -1) {
      uniqueTypes.push(module.type);
    }
  }
  for (let uniqueType of uniqueTypes) {
    if (!result) {
      result = getKeyByValue(LBN_ModuleType, uniqueType);
    } else {
      result += ", " + getKeyByValue(LBN_ModuleType, uniqueType);
    }
  }
  return result;
}

function getAvailableControls(modules) {
  let result = {
    'cw': false,
    'ww': false,
    'color': false,
  };
  for (let module of modules) {
    if (module.type === LBN_ModuleType.SQUARE_COLOR) {
      result.cw = true;
      result.ww = true;
      result.color = true;
    } else if (module.type === LBN_ModuleType.MR16_WARM_WHITE) {
      result.ww = true;
    } else if (module.type === LBN_ModuleType.MR16_COOL_WHITE) {
      result.cw = true;
    } else if (module.type === LBN_ModuleType.STREET_WHITE) {
      result.ww = true;
    } else if (module.type === LBN_ModuleType.DMX_COLOR) {
      result.cw = true;
      result.ww = true;
      result.color = true;
    } else if (module.type === LBN_ModuleType.BAR_COOL_WHITE) {
      result.cw = true;
    } else if (module.type === LBN_ModuleType.MOVING_WHITE) {
      result.cw = true;
    }
  }
  return result;
}

function hideGUI(items) {
  for (let item of items) {
    item.addClass("hidden");
  }
}
function showGUI(items) {
  for (let item of items) {
    item.removeClass("hidden");
  }
}
