import PIXI from "pixi.js"

class Graphics {
  constructor (renderer) {
    this.renderer = renderer
    this.resources = null
    this.animationLoop = null
    this.stage = new PIXI.Container()

    this.load()
  }

  load () {
    let loader = new PIXI.loaders.Loader()
    loader.add("dragon", "data/dragon.png")
    

    loader.once("complete", (loader, resources) => {
      this.resources = resources
      this.start()
    })

    loader.load()
  }

  start () {
    let dragon = new PIXI.Sprite(this.resources.dragon.texture)

    dragon.anchor.x = 0.5
    dragon.anchor.y = 0.5

    dragon.position.x = 200
    dragon.position.y = 150

    this.stage.addChild(dragon)

    this.dragon = dragon
  }

  animate () {
    this.renderer.render(this.stage)
    this.dragon.rotation += 0.01
  }

  loop(fps=60) {
    return setInterval(() => this.animate(), 1/60)
  }
}

export {Graphics}