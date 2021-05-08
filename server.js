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

const fakeGameState = { "gameId": "spend-example", "questions": [ { "_id": "60962f0cf716f1e38a9dd710", "text": "Hot or cold?" }, { "_id": "60963534ef26be0015f13bc2", "text": "Coffee or tea?" } ], "gameState": { "version": 172, "activeQuestionId": "60963534ef26be0015f13bc2", "players": [ "p1 <p1@wepay.com>", "p2 <p2@wepay.com>", "p3 <p3@wepay.com>", "p4 <p4@wepay.com>", "p6 <p6@wepay.com>", "p5 <p5@wepay.com>", "p7 <p7@wepay.com>", "p8 <p8@wepay.com>", "p9 <p9@wepay.com>" ], "offline": [ "p2 <p2@wepay.com>", "p3 <p3@wepay.com>" ], "responses": { "60962f0cf716f1e38a9dd710": { "a": [ "p5 <p5@wepay.com>", "p8 <p8@wepay.com>", "p7 <p7@wepay.com>", "p9 <p9@wepay.com>" ], "b": [ "p1 <p1@wepay.com>", "p2 <p2@wepay.com>" ] }, "60963534ef26be0015f13bc2": { "a": [], "b": [] } } }, "createdAt": "2021-05-08T06:24:10.300Z", "updatedAt": "2021-05-08T07:07:14.507Z" }

wss.on('connection', function connection(ws) {
  console.log('connected', ws.id);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    try {
      const msg = JSON.parse(message)
      ws.send(JSON.stringify({
        event: 'response',
        messageId: msg.messageId,
        room: msg.room,
        message: msg.message,
        gameState: fakeGameState,
      }));
    } catch (err) {
      console.error('failed to parse message', message);
    }
  });

  ws.send(JSON.stringify({
    event: 'ping',
    messageId: Date.now(),
    room: null,
    message: fakeGameState,
  }));
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
      c.send(JSON.stringify({
        event: 'ping',
        messageId: messageId,
        room: null,
        message: 'hello',
      }));
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
