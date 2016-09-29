let currentID = 0

let getID = () => {
  currentID += 1
  return currentID
}

export {getID, currentID}