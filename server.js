const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const mongoose = require('mongoose')
const http = require('http')
const generateWordId = require('faster-word-id')
const WebSocket = require('ws')

const Game = require('./models/Game')
const { getMarkup } = require('./frontend')
const { pick } = require('./util')
const { renderGameJson } = require('./game')
const { makeManager2 } = require('./manager')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => console.log('MongoDB connected'))

const app = express()
const manager = makeManager2()

app.use('/static', express.static('frontend/dist'))
app.use('/', express.static('public'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(function (err, req, res, next) {
  if (!err.code || err.code >= 500) {
    console.error('Unrecognized error!', err.stack)
    res.status(500).json({ error: 'Internal server error' })
  } else {
    res.status(err.code).json({ error: err.message })
  }
})

function makeWebError(status, message) {
  const err = new Error(message)
  err.code = status
  return err
}

app.post('/api/games/:id', async (req, res) => {
  const adminModifiable = pick(req.body, [
    'questions', 'playerRegex', 'playerRegexMessage',
    'openQuestionId',
  ])

  const game = await Game.findOneAndUpdate({
    gameId: req.params.id,
    adminCode: req.query.adminCode,
  }, adminModifiable, { upsert: false, new: true })

  // Could also be adminCode mis-match.
  if (!game) { throw makeWebError(404, 'Not found') }
  res.json(renderGameJson(game))

  if ('openQuestionId' in req.body) {
    // update game state.
  }
})
app.get('/api/games/:id', async (req, res) => {
  const game = await Game.findOne({ gameId: req.params.id })
  if (!game) {
    throw makeWebError(404, 'Not found')
  }
  res.json(renderGameJson(game))
})

app.post('/:id/join', async (req, res) => {
  // console.log('got req', req.params, req.body)
  const gameId = req.params.id
  const game = await Game.findOne({ gameId })
  if (!game) { return res.redirect('/') }

  const player = req.body.player
  const name = req.body.name
  const uriParams = 'player=' + encodeURIComponent(player) + '&name=' + encodeURIComponent(name)

  if (!player) {
    return res.redirect('/' + gameId + '?state=errorPlayer&' + uriParams)
  }
  if (game.playerRegex && !player.match(game.playerRegex)) {
    return res.redirect('/' + gameId + '?state=errorPlayerRegex&' + uriParams)
  }
  if (!name) {
    return res.redirect('/' + gameId + '?state=errorPlayerName&' + uriParams)
  }
  // console.log('got req2', req.params, req.body)

  const newGame = await Game.findOneAndUpdate({ gameId }, {
    $addToSet: { players: player },
  }, { new: true, upsert: false })

  // res.json({
  //   player,
  //   name,
  //   ...renderGameJson(game),
  // })

  res.redirect('/' + gameId + '/play?' + uriParams)
})

app.get('/:id/manage-:adminCode', async (req, res) => {
  const game = await Game.findOne({ gameId: req.params.id, adminCode: req.params.adminCode })
  if (!game) { return res.redirect('/' + req.params.id) }

  const markup = getMarkup({
    gameId: game.gameId,
    adminCode: game.adminCode,
    page: 'manage',
    testInfo: generateWordId(),
  })
  res.end(markup)
})

app.get('/:id/present', (req, res) => {
  const markup = getMarkup({
    page: 'present',
    testInfo: crypto.randomUUID(),
  })
  res.end(markup)
})

app.get('/:id/play', async (req, res) => {
  const player = req.query.player
  const name = req.query.name
  const game = await Game.findOne({ gameId: req.params.id })

  if (!game) { res.redirect('/') }
  const markup = getMarkup({
    page: 'play',
    player,
    name,
    ...renderGameJson(game),
  })
  res.end(markup)
})

app.get('/:id/:adminCode', (req, res) => {
  res.redirect(`/${req.params.id}/manage-${req.params.adminCode}`)
})

app.get('/:id', async (req, res) => {
  const game = await Game.findOne({ gameId: req.params.id })
  if (!game) { return res.redirect('/') }
  const markup = getMarkup({
    page: 'lobby',
    ...renderGameJson(game),
  })
  res.end(markup)
})

app.get('/', (req, res) => {
  const markup = getMarkup({
    page: 'index',
    testInfo: crypto.randomUUID(),
  })
  res.end(markup)
})

const server = http.createServer(app);
const wss = new WebSocket.Server({
  clientTracking: true,
  noServer: true,
});

const fakeGameState = { "gameId": "spend-example", "questions": [ { "_id": "60962f0cf716f1e38a9dd710", "text": "Hot or cold?" }, { "_id": "60963534ef26be0015f13bc2", "text": "Coffee or tea?" } ], "gameState": { "version": 172, "activeQuestionId": "60963534ef26be0015f13bc2", "players": [ "p1 <p1@wepay.com>", "p2 <p2@wepay.com>", "p3 <p3@wepay.com>", "p4 <p4@wepay.com>", "p6 <p6@wepay.com>", "p5 <p5@wepay.com>", "p7 <p7@wepay.com>", "p8 <p8@wepay.com>", "p9 <p9@wepay.com>" ], "offline": [ "p2 <p2@wepay.com>", "p3 <p3@wepay.com>" ], "responses": { "60962f0cf716f1e38a9dd710": { "a": [ "p5 <p5@wepay.com>", "p8 <p8@wepay.com>", "p7 <p7@wepay.com>", "p9 <p9@wepay.com>" ], "b": [ "p1 <p1@wepay.com>", "p2 <p2@wepay.com>" ] }, "60963534ef26be0015f13bc2": { "a": [], "b": [] } } }, "createdAt": "2021-05-08T06:24:10.300Z", "updatedAt": "2021-05-08T07:07:14.507Z" }

wss.on('connection', function connection(ws) {
  ws.on('close', async function(message) {
    console.log(message)
    try {
      manager.removePlayer(ws.gameId, ws.player)
      const game = await Game.findOne({ gameId: ws.gameId })
      const update = {
        event: 'update',
        online: manager.getPlayers(ws.gameId).map((c) => {
          return {
            player: c.player,
            name: c.name,
            lastMessageTime: c.lastMessageTime,
          }
        }),
        ...renderGameJson(game),
      }
      const message = JSON.stringify(update)
      manager.getPlayers(ws.gameId).forEach((c) => c.send(message))
    } catch (err) {
      console.error('Failed to handle close', ws.gameId, ws.player)
    }
  })

  ws.on('message', async function incoming(message) {
    console.log('received: %s', message);
    try {
      const msg = JSON.parse(message)
      if (msg.event === 'join') {
        const { gameId, player, name } = msg
        const game = await Game.findOne({ gameId })
        if (!game) {
          ws.send({ event: 'error', error: 'Game not found' })
          return
        }
        if (manager.hasPlayer(gameId, msg)) {
          // pass
          console.log('Game already has player!', gameId, player, name)
        } else {
          // addPlayer: (gameId, player, name, lastMessageTime, ws) => {
          manager.addPlayer(gameId, player, name, Date.now(), ws)
        }
        const update = {
          event: 'update',
          online: manager.getPlayers(gameId).map((c) => {
            return {
              player: c.player,
              name: c.name,
              lastMessageTime: c.lastMessageTime,
            }
          }),
          ...renderGameJson(game),
        }
        const message = JSON.stringify(update)
        manager.getPlayers(gameId).forEach((c) => c.send(message))
      } else {
        console.warn('Unrecognized event', msg)
      }
      // ws.send(JSON.stringify({
      //   event: 'response',
      //   messageId: msg.messageId,
      //   room: msg.room,
      //   message: msg.message,
      //   gameState: fakeGameState,
      // }));
    } catch (err) {
      console.error('failed to parse message', message);
    }
  });

  setTimeout(() => {
    ws.send(JSON.stringify({
      event: 'ping',
      messageId: Date.now(),
      room: null,
      message: fakeGameState,
    }));
  }, 2000)
});

// setInterval(() => {
//   const messageId = Date.now()
//   console.log('sending ping', messageId)
//   if (!wss.clients) {
//     console.log('skipping ping because clients not avail')
//     return
//   }
//   wss.clients.forEach((c) => {
//     if (c.readyState === WebSocket.OPEN) {
//       c.send(JSON.stringify({
//         event: 'ping',
//         messageId: messageId,
//         room: null,
//         message: 'hello',
//       }));
//     } else {
//       console.log('not sending message because client is not open')
//       console.log(c.readyState)
//     }
//   })
// }, 5000)

server.on('upgrade', function (request, socket, head) {
  console.log('Parsing upgrade request...');
  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit('connection', ws, request);
  });
});

const listener = server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on ${listener.address().port}`)
})
