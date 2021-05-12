// env $(cat .env | xargs) node scripts/dbdump.js [filepath]

const mongoose = require('mongoose')
const fs = require('fs')
const Game = require('../models/Game')
const { getKeyFromPlayer, getPlayerFromKey } = require('../util')

const datafile = process.argv[2]

async function appendFile(filename, data, encoding) {
  encoding = encoding || 'utf8'
  return new Promise((resolve, reject) => {
    fs.appendFile(filename, data, encoding, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

;(async function() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // useFindAndModify: false,
    // autoReconnect: true,
  })

  let count = 0
  const cursor = Game.find().cursor()
  await cursor.eachAsync(async (doc) => {
    await appendFile(datafile, JSON.stringify(doc.toObject()) + '\n', 'utf8')
    count++
    console.log('appended doc', doc._id)
  })
  console.log('finished', count)
  process.exit(0)
})().catch((err) => console.error(err));
