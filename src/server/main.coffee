express = require "express"
http = require "http"
socketio = require "socket.io"

game = require "./game"

app = express()
server = http.Server app
io = socketio server

server.listen 80, "localhost" # 19054, "0.0.0.0"
client = __dirname + "/client"

app.get "/", (req, res) ->
    res.sendFile client + "/index.html"

app.use "/scripts", express.static client + "/scripts"
app.use "/styles", express.static client + "/styles"




game = new game.Game
game_frequency = 1/60
game_loop = setInterval(
    (() -> 
        game.step(game_frequency)
    ), 
    1000*game_frequency)


io.on "connection", (socket) ->
    socket.on "get ping", (id) ->
        socket.emit "ping response", id

    # Update client reliably + quickly
    slow_frequency = 1/3
    slow_loop = setInterval(
        (() -> socket.emit "state", game.get_state()),
        slow_frequency*1000)
    fast_frequency = 1/50
    fast_loop = setInterval(
        (() -> socket.volatile.emit "state", game.get_state()),
        fast_frequency*1000)


    id = null
    socket.on "request join", (name) ->
        if id? and id in game.state.players
            isnew = false
        else 
            id = game.add_player name
            isnew = true
        console.log "new player:", id, name
        socket.emit "join response", {id: id, isnew: isnew, state: game.get_state()}

    socket.on "action", (actions) ->
        game.act_on id, actions
