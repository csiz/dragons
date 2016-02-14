express = require "express"
http = require "http"
socket = require "socket.io"

app = express()
server = http.Server(app)
io = socket(server)

server.listen(80)
client = __dirname + "/client"

app.get "/", (req, res) ->
    res.sendFile client + "/index.html"

app.use "/scripts", express.static client + "/scripts"
app.use "/styles", express.static client + "/styles"