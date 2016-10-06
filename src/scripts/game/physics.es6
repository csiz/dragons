import _ from "lodash"

let pi = Math.PI

/** Vector that holds physics information. */
class Vector {
  constructor ({x, y, r, v=0, m=1}) {
    this.state = {x, y, r, v, m}
  }

  /** Place the object in the world. */
  place ({x, y, r}) {
    _.assign(this.state, {x, y, r})
    return this
  }

  /** Push this object by speed `dv` in direction `r`. */
  push ({dv, r=this.state.r}) {
    let dvx = dv * Math.cos(r)
    let dvy = dv * Math.sin(r)
    let vx = this.state.v * Math.cos(this.state.r)
    let vy = this.state.v * Math.sin(this.state.r)
    vx += dvx
    vy += dvy
    this.state.v = Math.sqrt(vx*vx + vy*vy)
    this.state.r = Math.atan2(vy, vx)
    return this
  }

  /** Rotate the object by `dr`. */
  rotate ({dr}) {
    this.state.r += dr
    return this
  }
}

export {Vector, pi}
