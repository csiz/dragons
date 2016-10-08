import _ from "lodash"

let pi = Math.PI

/** Vector that holds physics information. */
class Vector {
  constructor ({x, y, r, v=0, m=1}) {
    _.assign(this, {x, y, r, v, m})
  }

  get state () {
    return _.pick(this, ["x", "y", "r", "v", "m"])
  }

  set state (state) {
    _.assign(this, state)
  }

  /** Place the object in the world. */
  place ({x, y, r}) {
    _.assign(this, {x, y, r})
  }

  /** Push this object by speed `dv` in direction `r`. */
  push ({dv, r=this.r}) {
    let dvx = dv * Math.cos(r)
    let dvy = dv * Math.sin(r)
    let vx = this.v * Math.cos(this.r)
    let vy = this.v * Math.sin(this.r)

    vx += dvx
    vy += dvy

    this.v = Math.sqrt(vx*vx + vy*vy)
    this.r = Math.atan2(vy, vx)
  }

  /** Rotate the object by `dr`. */
  rotate ({dr}) {
    this.r += dr
  }

  /** Step through dt time. */
  step (dt) {
    let vx = this.v * Math.cos(this.r)
    let vy = this.v * Math.sin(this.r)

    this.x += vx * dt
    this.y += vy * dt
  }
}

export {Vector, pi}
