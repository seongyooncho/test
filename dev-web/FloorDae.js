"use strict";

import {FLOOR_DATA, FLOOR_TYPE} from 'LBN_CONST';

let DAE = [];

(function(){
  let loader = new THREE.ColladaLoader();

  loader.load( 'obj/residential.dae', function ( collada ) {
    let dae = collada.scene;
    dae.traverse( function (node) { 
      if (node.material) {
        node.material.side = THREE.DoubleSide; 
        node.material.defaultOpacity = node.material.opacity;
      } 
    });
    dae.updateMatrix();
    DAE[FLOOR_TYPE.RESIDENTIAL] = dae;
  });
})();

(function(){
  let loader = new THREE.ColladaLoader();

  loader.load( 'obj/office.dae', function ( collada ) {
    let dae = collada.scene;
    dae.traverse( function (node) { 
      if (node.material) {
        node.material.side = THREE.DoubleSide; 
        node.material.defaultOpacity = node.material.opacity;
      }
    });
    dae.updateMatrix();
    DAE[FLOOR_TYPE.OFFICE] = dae;
  });
})();

(function(){
  let loader = new THREE.ColladaLoader();

  loader.load( 'obj/commercial.dae', function ( collada ) {
    let dae = collada.scene;
    dae.traverse( function (node) { 
      if (node.material) {
        node.material.side = THREE.DoubleSide; 
        node.material.defaultOpacity = node.material.opacity;
      }
    });
    dae.updateMatrix();
    DAE[FLOOR_TYPE.COMMERCIAL] = dae;
  });
})();
export default class {
  constructor(index) {
    this.dae = new THREE.Scene();

    this.transition = 1;
    this.scale = 1;

    let data = FLOOR_DATA[index];

    this.dae.add(DAE[data.type].clone());
    this.dae.position.x = data.offset.x;
    this.dae.position.y = data.offset.y;
    this.dae.position.z = data.offset.z;
  }
  set focused(value) {
  }
  animate() {
    if (this.transition === this.scale) {
      return;
    }

    this.transition = this.transition * 0.9 + this.scale * 0.1;
    if (Math.abs(this.transition - this.opacity) < 0.01) {
      this.transition = this.opacity;
    }

    let transition = this.transition;
    this.dae.scale.copy(new THREE.Vector3(transition, transition, transition));
  }
  getCameraPosition(destX, destY) {
    let vector = new THREE.Vector3();
    
    vector.x = this.dae.position.x + Math.sin(destX/300) * 10;
    vector.y = this.dae.position.y + Math.cos(destX/300) * 10;
    vector.z = this.dae.position.z + 10 + Math.sin(destY/300) * 20;

    return vector;
  }
}
