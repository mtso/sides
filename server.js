const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const mongoose = require('mongoose')
const http = require('http')
const generateWordId = require('faster-word-id')
const WebSocket = require('ws')

const Game = require('./models/Game')
const { getMarkup } = require('./frontend')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express()

app.use('/static', express.static('frontend/dist'))
app.use('/', express.static('public'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const markup = getMarkup({testInfo: crypto.randomUUID()})
  res.end(markup)
})

const server = http.createServer(app);
const wss = new WebSocket.Server({
  clientTracking: true,
  // server,
  noServer: true,
});

wss.on('connection', function connection(ws) {
  console.log('connected', ws.id);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    ws.send('thanks for:' + message);

  });

  ws.send('something');
});

setInterval(() => {
  const messageId = Date.now()
  console.log('sending ping', messageId)
  if (!wss.clients) {
    console.log('skipping ping because clients not avail')
    return
  }
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN) {
      c.send(JSON.stringify({messageId, message: 'hello', event: 'ping'}))
    } else {
      console.log('not sending message because client is not open')
      console.log(c.readyState)
    }
  })
}, 5000)

server.on('upgrade', function (request, socket, head) {
  console.log('Parsing upgrade request...');
  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit('connection', ws, request);
  });
});

const listener = server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on ${listener.address().port}`)
})
