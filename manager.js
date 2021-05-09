function parseMessage(msg) {
  try {
    return JSON.parse(msg)
  } catch (err) {
    console.error('Received invalid message')
  }
}

// manager.getPlayers().forEach((ws) => ws.send(JSON.stringify({
//   event: 'update',
//   game: game,
// })))

function makeManager2() {
  const store = {}

  return {
    hasPlayer: (gameId, player) => {
      if (!gameId || !player) { return false }
      const clients = store[gameId] || []
      return clients.some((c) => c.player===player)
    },
    addPlayer: (gameId, player, name, lastMessageTime, ws) => {
      const clients = store[gameId] || []
      ws.gameId = gameId
      ws.player = player
      ws.name = name
      ws.lastMessageTime = lastMessageTime
      store[gameId] = clients.filter((c) => c.player!==player).concat([ ws ])
      return ws
    },
    presentPlayer: (gameId, player, lastMessageTime) => {
      (clients[gameId] || []).forEach((c) => {
        if (c.player === player) {
          c.lastMessageTime = lastMessageTime
        }
      })
    },
    removePlayer: (gameId, player) => {
      if (!store[gameId]) { return }
      let removed = null
      store[gameId] = (store[gameId] || []).filter((c) => {
        if (c.player === player) {
          removed = c
        }
        return c.player !== player
      })
      return removed
    },
    getPlayers: (gameId) => {
      return store[gameId] || null
    },
  }
}

function makeManager(wss) {
  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      const m = parseMessage()
    })
  })

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

  return {

  }
}

module.exports = {
  makeManager2,
}
