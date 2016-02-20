$ = require "jquery"
io = require "socket.io-client"

$("body").append "<p>hi alice</p>" 
socket = io.connect()

pings_pending = {}
socket.on "mypong", (id) ->
    duration = (Date.now() - pings_pending[id])/2
    delete pings_pending[id]
    $("#latency").text(duration.toFixed(0))

socket = io.connect()
socket.on "news", (data) ->
    console.log data
    socket.emit "someevent", {other: "other data"}ping_frequency = 1/5
ping_loop = setInterval(
    (() -> 
        id = Math.random().toString()
        pings_pending[id] = Date.now()
        socket.emit "myping", id
    ),
    ping_frequency*1000)