/** Vector that holds physics information. */
class Vector {
  constructor ({id, x, y, m=1, dx=0, dy=0, rm=1}) {
    this.id = id
    this.x = x
    this.y = y
    this.m = m
    this.dx = dx
    this.dy = dy
    this.rm = rm
  }

  place ({x, y, dx=this.dx, dy=this.dy}) {
    this.x = x
    this.y = y
    this.dx = dx
    thid.dy = dy
  }

  push ({dx, dy}) {
    this.dx += dx
    this.dy += dy
  }

  impulse ({ix, iy}) {
    this.dx += ix/m
    this.dy += iy/m
  }

  accelerate ({ax, ay}, dt) {
    this.dx += ax*dt
    this.dy += ay*dt
  }

  step (dt) {
    this.x += this.dx*dt
    this.y += this.dy*dt
  }

  get state () {
    return {
      id: this.id,
      x: this.x,
      m: this.m,
      dx: this.dx,
      dy: this.dy,
      rm: this.rm,
    }
  }

  set state (state) {
    this.constructor(state)
  }
}

export {Vector}
