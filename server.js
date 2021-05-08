const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')

const { getMarkup } = require('./frontend')

const app = express()

app.use('/static', express.static('frontend/dist'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const markup = getMarkup({testInfo: crypto.randomUUID()})
  res.end(markup)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on ${listener.address().port}`)
})
