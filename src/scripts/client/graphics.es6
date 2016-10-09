import PIXI from "pixi.js"
import _ from "lodash"

/** Load graphics resources. */
function load_resources (oncomplete) {
  let loader = new PIXI.loaders.Loader()
  loader.add("dragon", "data/dragon.png")
  
  loader.once("complete", (loader, resources) => {
    oncomplete(resources)
  })

  loader.load()
}

/** Get number of seconds since epoch. */
function time () {
  return (new Date()).getTime() / 1000
}

/** Draw the world on screen. */
class Graphics {
  constructor ({renderer, resources, world}) {
    this.renderer = renderer
    this.resources = resources
    this.world = world
    this.stage = new PIXI.Container()
    this.fps = 0.0
  }

  draw () {
    // TODO: make the stage agree with the world.

    this.renderer.render(this.stage)
  }

  loop({fps=60}) {
    // Let's do an exponential average to find out actual fps.
    let last = time()
    let sum_dt = 0.0
    let count_dt = 0.0

    function update () {
      this.draw()

      // Compute exp average fps.
      let dt = time() - last
      last += dt
      let decay = Math.exp(dt/60)
      sum_dt = sum_dt/decay + dt
      count_dt = count_dt/decay + 1.0
      this.fps = 1.0 / (sum_dt/count_dt)
    }

    return setInterval(update, 1.0/fps)
  }
}

export {Graphics, load_resources}