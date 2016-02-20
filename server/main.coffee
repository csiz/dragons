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
    (() -> game.step(game_frequency)), 
    1000*game_frequency)


io.on "connection", (socket) ->
    # Update client reliably + quickly
    slow_frequency = 1/3
    slow_loop = setInterval(
        (() -> socket.emit "state", game.state),
        slow_frequency*1000)
    fast_frequency = 1/50
    fast_loop = setInterval(
        (() -> socket.volatile.emit "state", game.state),
        fast_frequency*1000)

    socket.on "myping", (id) ->
        socket.emit "mypong", id


    socket.on "requestjoin", (name) ->
        game.add_player name
