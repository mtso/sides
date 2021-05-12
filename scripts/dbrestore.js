// env $(cat .env | xargs) node scripts/dbrestore.js [filepath]
// Loads data into the database specified in MONGODB_URI!!!

const mongoose = require('mongoose')
const fs = require('fs')
const readline = require('readline')
const Game = require('../models/Game')

const datafile = process.argv[2]
console.log('restoring data from', datafile)

;(async function() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // useFindAndModify: false,
    // autoReconnect: true,
  })

  const rl = readline.createInterface({
    input: fs.createReadStream(datafile),
    crlfDelay: Infinity,
  })

  let count = 0
  for await (const line of rl) {
    if (!line) { continue }
    try {
      const record = JSON.parse(line)
      const game = await Game.create(record)
      count++
      console.log('loaded doc', game._id)
    } catch(err) {
      console.error('failed to write record', err)
    }
  }

  console.log('finished', count)
  process.exit(0)
})().catch((err) => console.error(err));
