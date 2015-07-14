"use strict";

const HEIGHT = 25;
const RADIUS = 2;

export default class {
  constructor() {
    let scene = new THREE.Scene();
    this.sphere_ = createSphere();
    //this.cylinder_ = createCylinder();

    scene.add( this.sphere_ );
    //scene.add( this.cylinder_ );

    this.scene = scene;
  }

  set coordinate(coordinate) {
    let {azimuth, elevation} = coordinate;
    azimuth = azimuth / 180 * Math.PI;
    elevation = elevation / 180 * Math.PI;

    this.scene.rotation.set(-elevation, 0, -azimuth, 'ZXY');
  }
}

function createSphere() {
  let geometry = new THREE.SphereGeometry( RADIUS, 8, 8 );
  let material = new THREE.MeshBasicMaterial( { 
    color: 0xff0000, 
      opacity: 0.5, 
      transparent: true
  });
  let sphere = new THREE.Mesh( geometry, material );
  sphere.position.y = -HEIGHT;

  return sphere;
}

function createCylinder() {
  var geometry = new THREE.CylinderGeometry( 0.05, 0.05, HEIGHT - RADIUS, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.y = - (HEIGHT - RADIUS) / 2;

  return cylinder;
}
