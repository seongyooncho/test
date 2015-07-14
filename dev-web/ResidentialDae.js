"use strict";

let dae;

(function(){
  let loader = new THREE.ColladaLoader();

  loader.load( 'obj/residential.dae', function ( collada ) {
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
  constructor(floor) {
    this.dae = dae.clone();
    this.transition = 1;
    this.opacity = 1;

    this.dae.position.x = -10;
    this.dae.position.y = -10;
    this.dae.position.z = floor * 3;
  }
  animate() {
    if (this.transition === this.opacity) {
      return;
    }

    this.transition = this.transition * 0.9 + this.opacity * 0.1;
    if (Math.abs(this.transition - this.opacity) < 0.01) {
      this.transition = this.opacity;
    }

    let transition = this.transition;
    this.dae.traverse( function (node) {
      if (node.material) {
        node.material.opacity = transition * node.material.defaultOpacity;
      }
    });
  }
  getCameraPosition(destX, destY) {
    let vector = new THREE.Vector3();
    
    vector.x = this.dae.position.x + Math.sin(destX/300) * 10;
    vector.y = this.dae.position.y + Math.cos(destX/300) * 10;
    vector.z = this.dae.position.z + 10 + Math.sin(destY/300) * 20;

    return vector;
  }
}

