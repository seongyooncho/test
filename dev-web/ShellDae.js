"use strict";

let dae;

(function(){
  let loader = new THREE.ColladaLoader();

  loader.load( 'obj/overview.dae', function ( collada ) {
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
    this.dae = dae;
    this.transition = 1;
    this.opacity = 1;
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

    this.dae.visible = (this.transition > 0.1);
  }
  getCameraPosition(destX, destY) {
    let vector = new THREE.Vector3();
    
    vector.x = Math.sin(destX/300) * 50;
    vector.y = Math.cos(destX/300) * 50;
    vector.z = 20 + Math.sin(destY/300) * 20;

    return vector;
  }
}
