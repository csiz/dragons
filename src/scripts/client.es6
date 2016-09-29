import $ from "jquery"
import PIXI from "pixi.js"
import _ from "lodash"

import {Dragon, World} from "./game"
import {Graphics} from "./client/graphics"

// On page load:
$(() => {
  let renderer = new PIXI.autoDetectRenderer(800, 600)
  $("#game-area").append(renderer.view)

  let graphics = new Graphics(renderer)
})