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
        vx = (@v * Math.cos @r) + (dv * Math.cos r)
        vy = (@v * Math.sin @r) + (dv * Math.sin r)

        @v = Math.sqrt(vx*vx + vy*vy)
        
        if vx > 0 
            @r = Math.atan(vy/vx)
        else if vx < 0
            @r = Math.atan(vy/vx) + Math.PI
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
    constructor: (@name, x, y, v, direction) ->
        @physical = new Physical(x, y, v, direction)

        @actions = {
            faster: false,
            slower: false,
            right: false,
            left: false
        }

    step: (delta) =>
        @physical.step delta

        switch
            when @actions.faster
                @physical.push delta, +50
            when @actions.slower
                @physical.push delta, -50
            when @actions.left
                @physical.rotate delta, -Math.PI
            when @actions.right
                @physical.rotate delta, +Math.PI

    get_state: () =>
        {
            name: @name
            x: @physical.x
            y: @physical.y
            v: @physical.v
            r: @physical.r
        }

    set_state: (state) =>
        @name = state.name
        @physical.x = state.x
        @physical.y = state.y
        @physical.v = state.v
        @physical.r = state.r


class Game
    constructor: () ->
        @state = {
            time: 0,
            players: {}
        }

    get_state: () =>
        player_states = {}
        for id, player of @state.players
            player_states[id] = player.get_state()

        {
            time: @state.time,
            players: player_states
        }

    set_state: (state) =>
        @state.time = state.time
        for id, player_state of state.players
            if id in @state.players
                @state.players[id].set_state player_state
            else
                new_player = new Player("")
                new_player.set_state player_state
                @state.players[id] = new_player

    add_player: (name) =>
        id = Math.random().toString()
        player = new Player(
            name,
            0, 0,
            1, 
            Math.random() * Math.PI*2
        )

        @state.players[id] = player

        return id

    step: (delta) =>
        @state.time += delta
        for id, player of @state.players
            player.step(delta)

    act_on: (id, actions) ->
        @state.players[id].actions = actions

exports = {
    Game
    Player
}
