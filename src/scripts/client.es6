import $ from "jquery"
import PIXI from "pixi.js"
import _ from "lodash"

import {World} from "./game"
import {Graphics, load_resources} from "./client/graphics"

// Start playing the game.
function play({graphics, world}) {
  // Start das loops.
  world.loop()
  graphics.loop({fps: 60})
}

// TODO: use promises instead? gotta figure out how those work

// Setup the message bus.
let messages = new Messages()

// We can start the main loop once we setup the world.
messages.onall(["graphics", "world"], play)

// Create the game world, but wait after the page loads so don't freeze.
$(()=>messages.fire("world", new World()))

// Create graphics when loading is complete.
messages.onall(["resources", "renderer", "world"], (data)=>{
  messages.fire("graphics", new Graphics(data))
})

// Start loading resources as soon as possible.
load_resources((resources)=>messages.fire("resources", resources))

// Create renderer after the page loads.
$(()=>{
  let renderer = new PIXI.autoDetectRenderer(800, 600)
  $("#game-area").append(renderer.view)
  messages.fire("renderer", renderer)
})

