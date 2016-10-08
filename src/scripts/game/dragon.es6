import {Vector} from "./physics"

import _ from "lodash"

class Dragon {
  constructor ({x, y, r}) {
    this.vector = new Vector({x, y, r}),
    this.direction = "forward"

    this._turn_speed = Math.PI / 2
  }

  get state () {
    return {
      vector: this.vector.state,
      direction: this.direction,
    }
  }

  set state ({vector, direction}) {
    this.vector.state = vector
    this.direction = direction
  }

  command (what, details={}) {
    switch (what) {
      case "turn": {
        let {direction} = details
        switch (direction) {
          case "forward":
          case "right":
          case "left":
            this.direction = direction
          default:
            throw `Turn direction ${direction} is invalid.`
        }
        break
      }
      default:
        throw `Can't interpret ${what} command.`
    }
  }

  step (dt) {
    switch (this.direction) {
      case "right":
        this.vector.rotate({dr: +this._turn_speed * dt})
        break
      case "left":
        this.vector.rotate({dr: -this._turn_speed * dt})
        break
    }

    this.vector.step(dt)
  }
}