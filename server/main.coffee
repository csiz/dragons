express = require "express"
http = require "http"
socketio = require "socket.io"

app = express()
server = http.Server app
io = socketio server

server.listen 80, "localhost" # 19054, "0.0.0.0"
client = __dirname + "/client"

app.get "/", (req, res) ->
    res.sendFile client + "/index.html"

app.use "/scripts", express.static client + "/scripts"
app.use "/styles", express.static client + "/styles"

io.on "connection", (socket) ->

    socket.on "myping", (id) ->
        socket.emit "mypong", id

