import {Vector} from "./physics"

describe("Vector", () => {
    let v = new Vector({x: 0, y: 0, r: 0})

    it("state should have the required properties", () => {
        v.state.should.have.properties({x: 0, y: 0, r: 0, v: 0, m: 1})
    })

    it("can be pushed to the left", () => {
        v.push({dv: 1, r: Math.PI})
        v.state.should.have.properties({v: 1, r: Math.PI})
    })

    it("can be pushed back to the right", () => {
        v.push({dv: 2, r: 0.0})

        v.state.v.should.be.approximately(1, 0.01)
        v.state.r.should.be.approximately(0, 0.01)
    })

    it("can be rotated clockwise", () => {
        v.rotate({dr: Math.PI})

        v.state.r.should.be.approximately(Math.PI, 0.01)
    })
})