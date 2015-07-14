"use strict";

export let SLOT_POSITION = [
  {x: -7, y: -6},
  {x: -5, y: -6},
  {x: -2, y: -6},
  {x:  0, y: -6},
  {x:  3, y: -6},
  {x:  5, y: -6},

  {x: -7, y:  0},
  {x: -5, y:  0},
  {x: -2, y:  0},
  {x:  0, y:  0},

  {x: -7, y:  6},
  {x: -5, y:  6},
  {x: -2, y:  6},
  {x:  0, y:  6},
  {x:  3, y:  6},
  {x:  5, y:  6},
];
export let FLOOR_TYPE = { 
  RESIDENTIAL: 0,
  OFFICE: 1,
  COMMERCIAL: 2,
  FACADE: 3,
  PARKING: 4,
  ROAD: 5,
};


export let FLOOR_DATA = [
  { 
    offset: {x: -10.0, y: -10.0, z: 12.0},
    type: FLOOR_TYPE.RESIDENTIAL, 
  },
  { 
    offset: {x: -10.0, y: -10.0, z: 10.0},
    type: FLOOR_TYPE.RESIDENTIAL, 
  },
  { 
    offset: {x: -10.0, y: -10.0, z: 8.0},
    type: FLOOR_TYPE.RESIDENTIAL, 
  },
  { 
    offset: {x: -10.0, y: -10.0, z: 6.0},
    type: FLOOR_TYPE.OFFICE, 
  },
  { 
    offset: {x: -10.0, y: -10.0, z: 4.0},
    type: FLOOR_TYPE.OFFICE, 
  },
  { 
    offset: {x: -10.0, y: -10.0, z: 2.0},
    type: FLOOR_TYPE.OFFICE, 
  },
  { 
    offset: {x: -10.0, y: -10.0, z: 0.0},
    type: FLOOR_TYPE.COMMERCIAL, 
  },
  { 
    offset: {x: -10.0, y: -10.0, z: 0.0},
    type: FLOOR_TYPE.FACADE, 
  },
  { 
    offset: {x: 10.0, y: -10.0, z: -3.0},
    type: FLOOR_TYPE.PARKING, 
  },
  { 
    offset: {x: 0.0, y: 10.0, z: 0.0},
    type: FLOOR_TYPE.ROAD, 
  },
]

