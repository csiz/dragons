import {version} from "./game"

import express from "express"

let port = 3000
let app = express()

app.use("/", express.static("build/client"))

app.listen(port, () => {
  console.log(`Started server on port ${port}.`)
})
