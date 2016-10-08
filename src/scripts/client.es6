import $ from "jquery"
import PIXI from "pixi.js"
import _ from "lodash"

import {World} from "./game"
import {Graphics} from "./client/graphics"


function main() {
  let renderer = new PIXI.autoDetectRenderer(800, 600)
  $("#game-area").append(renderer.view)

  let world = new World()
  let graphics = new Graphics(renderer, world)


  // Start das loops.
  world.loop()
}

// Run on page load.
$(main)