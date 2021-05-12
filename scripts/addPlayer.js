const mongoose = require('mongoose')
const Game = require('../models/Game')
const { getKeyFromPlayer, getPlayerFromKey } = require('../util')

console.log(getPlayerFromKey(getKeyFromPlayer('matthewt@wepay..com')))
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(async () => {
  const gameId = 'test-1'
  const player = 'matthewt@wepay.com'
  const name = 'matthew'
  const patch = {
    [`playerInfo.${getKeyFromPlayer(player)}.player`]: player,
    [`playerInfo.${getKeyFromPlayer(player)}.name`]: name,
  }
  console.log(patch)
  const newGame = await Game.findOneAndUpdate({ gameId }, {
    $addToSet: { players: player },
    // [`playerInfo.${player}.player`]: player,
    // [`playerInfo.${player}.name`]: name,
    $set: patch,
  }, { new: true, upsert: false })
  console.log(newGame)
})

  