$ = require "jquery"
io = require "socket.io-client"
game = require "../common/game"
d3 = require "d3"

socket = io.connect()

pings_pending = {}
socket.on "mypong", (id) ->
    duration = (Date.now() - pings_pending[id])/2
    delete pings_pending[id]
    $("#latency").text(duration.toFixed(0))

ping_frequency = 1/5
ping_loop = setInterval(
    (() -> 
        id = Math.random().toString()
        pings_pending[id] = Date.now()
        socket.emit "myping", id
    ),
    ping_frequency*1000)



game = new game.Game


draw_area = d3.select("#game")
height = 400
width = 600
res = 2
draw_area
    .attr "width", "#{width}px"
    .attr "height", "#{height}px"
x = d3.scale.linear()
    .range([0, width])
    .domain([-width*res/2, width*res/2])
y = d3.scale.linear()
    .range([0, height])
    .domain([-height*res/2, height*res/2])


draw = (delta) ->
    data = ({name: name, player: player} for name, player of game.state.players)
    players = draw_area.selectAll(".player")
        .data(data, (entry, index) -> entry.name)
    players.enter()
        .append("circle")
            .attr "class", "player"
            .attr "r", 10
    players.exit()
        .remove()
    players
        .attr "cx", (d, i) -> x(d.player.physical.x)
        .attr "cy", (d, i) -> y(d.player.physical.y)

last_draw = Date.now()/1000
draw_frequency = 1/60
draw_loop = setInterval(
    (() -> 
        new_draw = Date.now()/1000
        draw(new_draw - last_draw)
        last_draw = new_draw),
    draw_frequency*1000)






control = {
    left: false,
    right: false,
    up: false,
    down: false
}
$(document).keydown (event) ->
    event.preventDefault()
    switch event.which
        when 87 then control.up = true
        when 83 then control.down = true
        when 68 then control.right = true
        when 65 then control.left = true

$(document).keyup (event) ->
    event.preventDefault()
    switch event.which
        when 87 then control.up = false
        when 83 then control.down = false
        when 68 then control.right = false
        when 65 then control.left = false

{success, player} = game.add_player "csiz"

player.physical.motion 50, Math.PI/4

last_game = Date.now()/1000
game_frequency = 1/60
game_loop = setInterval(
    (() -> 
        new_game = Date.now()/1000
        delta = last_game - new_game

        switch
            when control.up then player.physical.push delta, +10
            when control.down then player.physical.push delta, -10
            when control.left then player.physical.rotate delta, +Math.PI*2
            when control.right then player.physical.rotate delta, -Math.PI*2
        
        game.step(last_game - new_game)
        last_game = new_game
    ), 
    1000*game_frequency)