class Physical
    constructor: (@x, @y, @v, @r) ->

    place: (@x, @y) =>
        @

    motion: (@v, @r) =>
        @

    push: (delta, a, r=@r) =>
        @impact(delta * a, r)
        @

    impact: (dv, r) =>
        dvx = dv * Math.cos r
        dvy = dv * Math.sin r
        vx = (@v * Math.cos @r) + dvx
        vy = (@v * Math.sin @r) + dvy
        @v = Math.sqrt(vx*vx + vy*vy)
        
        if vx != 0 
            @r = Math.atan(vy/vx)
            if vx < 0
                @r += Math.PI
                if vy < 0
                    @r += Math.PI
        else 
            if vy > 0
                @r = Math.PI/2
            else if vy < 0
                @r = Math.PI*3/2
            else
                @r = 0

        @


    rotate: (delta, dr) =>
        @r += delta * dr
        @

    step: (delta) =>
        @x += delta * @v * Math.cos @r
        @y += delta * @v * Math.sin @r
        @

class Player
    constructor: (x, y, v, direction) ->
        @physical = new Physical(x, y, v, direction)

    step: (delta) =>
        @physical.step delta

class Game
    constructor: () ->
        @state = {
            time: 0,
            players: {}
        }

    add_player: (name) =>
        if name in @state.players
            return {success: false, reason: "Player #{name} is already in the game."}

        player = new Player(
            0, 0,
            1, 
            Math.random() * Math.PI*2
        )

        @state.players[name] = player

        return {success: true, player: player}

    step: (delta) =>
        @state.time += delta
        for name, player of @state.players
            player.step(delta)

exports.Game = Game
exports.Player = Player