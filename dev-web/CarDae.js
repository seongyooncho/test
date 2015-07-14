"use strict";

let dae;

(function(){
  let loader = new THREE.ColladaLoader();

  loader.load( 'obj/car.dae', function ( collada ) {
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
  constructor(x, y) {
    this.dae = dae.clone();
    this.dae.position.x = x;
    this.dae.position.y = y;
    this.dae.scale.x = 0.7;
    this.dae.scale.y = 0.7;
    this.dae.scale.z = 0.7;
  }
  /*
  hide() {
    this.dae.visible = false;
  }
  show() {
    this.dae.visible = true;
  }
  */
}

