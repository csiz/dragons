$ = require "jquery"
io = require "socket.io-client"

$("body").append "<p>hi alice</p>" 

console.log "stuff"

socket = io.connect()
socket.on "news", (data) ->
    console.log data
    socket.emit "someevent", {other: "other data"}