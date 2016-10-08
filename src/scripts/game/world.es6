import {Dragon} from "./dragon"

import _ from "lodash"

/** Get number of seconds since epoch. */
let time = function () {
  return (new Date()).getTime() / 1000
}

/** Game world. */
class World {
  constructor () {
    this.time = 0.0

    this.dragon = new Dragon({x: 0. y: 0, r: 0})
  }

  step (dt) {
    this.dragon.step(dt)

    this.time += dt
    // Update the physics world at a fixed resolution of 1000fps.
    while(true) {
      let dt = 1/1000;
      if (this.time + dt > time()) break;
      this.time += dt
      this.physics.step(dt)
    }
  }

  /** Run the world loop at a fixed resolution. */
  loop (resolution=100) {
    let dt = 1.0/resolution
    // Run the interval faster than the game loop, so skips aren't obvious.
    let interval_dt = dt/10
    let start = time()
    let update = function(){
      while (start+world.time < time()) world.step(dt)
    }
    return setInterval(update, interval_dt*1000)
  }
  
}



export {World}