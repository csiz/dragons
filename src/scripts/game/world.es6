import {Vector} from "./physics"
import {Dragon} from "./dragon"

import _ from "lodash"

/** Get number of seconds since epoch. */
let time = function () {
  return (new Date()).getTime() / 1000
}

/** Physics world. */
class PhysicsWorld {
  constructor ({vectors=[]}) {
    this.vectors = new Map(vectors)
  }

  add_vector (vector) {
    this.vectors.set(vector.id, vector)
  }

  rm_vector (vector) {
    this.vectors.delete(vector.id)
  }

  step (dt) {
    for (let vec of this.vectors.values()) vec.step();
  }

  get state () {
    return {
      vectors: Array.from(this.vectors.entries()),
    }
  }

  set state (state) {
    throw "TODO: set the state for each vector."
    // this.constructor(state)
  }
}

/** Game world. */
class World {
  constructor () {
    this.physics = new PhysicsWorld()

    this.dragons = new Set()

    this.time = time()
  }

  add_dragon (dragon) {
    this.dragons.add(dragon)
    this.physics.add_vector(dragon.vector)
  }


  step () {
    // Update the physics world at a fixed resolution of 1000fps.
    while(true) {
      let dt = 1/1000;
      if (this.time + dt > time()) break;
      this.time += dt
      this.physics.step(dt)
    }
  }
}

export {World, time}