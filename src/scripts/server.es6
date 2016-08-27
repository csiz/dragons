import {version} from "./game"

import express from "express"

let app = express()

app.use("/", express.static("build/client"))

app.listen(3000, () => {
  console.log("Started server!")
})
