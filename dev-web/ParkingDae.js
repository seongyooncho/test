"use strict";

import CarDae from 'CarDae';
import {SLOT_POSITION} from 'LBN_CONST';

let dae;
let cars = [];

(function(){
  let loader = new THREE.ColladaLoader();

  loader.load( 'obj/parking.dae', function ( collada ) {
    dae = collada.scene;
    dae.traverse( function (node) { 
      if (node.material) {
        node.material.side = THREE.DoubleSide; 
        node.material.defaultOpacity = node.material.opacity;
      }
    });
    dae.updateMatrix();
  });
})();

export default class {
  constructor() {
    this.dae = new THREE.Scene();

    this.transition = 1;
    this.scale = 1;

    for (let i = 0; i < SLOT_POSITION.length; i++) {
      let pos = SLOT_POSITION[i];
      let car = new CarDae(pos.x, pos.y);
      this.dae.add(car.dae);

      cars.push(car);
    }
    this.focused = false;

    this.dae.add(dae.clone());
    this.dae.position.z = -3;

  }
  set focused(value) {
    for (let car of cars) {
      car.dae.visible = value;
    }
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
    
    vector.x = this.dae.position.x + Math.sin(destX/300) * 20;
    vector.y = this.dae.position.y + Math.cos(destX/300) * 20;
    vector.z = this.dae.position.z + 20 + Math.sin(destY/300) * 30;

    return vector;
  }
}
