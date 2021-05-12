const crypto = require('crypto')
const { pick } = require('./util')

function makeManager() {
  const store = {}

  return {
    hasPlayer: (gameId, player) => {
      if (!gameId || !player) { return false }
      const clients = store[gameId] || []
      return clients.some((c) => c.player === player)
    },
    addPlayer: (gameId, player, name, lastMessageTime, ws) => {
      const clients = store[gameId] || []
      ws.clientId = crypto.randomUUID()
      ws.gameId = gameId
      ws.player = player
      ws.name = name
      ws.lastMessageTime = lastMessageTime
      store[gameId] = clients.concat([ ws ])
      return ws
    },
    removePlayer: (gameId, clientId) => {
      if (!store[gameId]) { return }
      let removed = null
      store[gameId] = (store[gameId] || []).filter((c) => {
        if (c.clientId === clientId) {
          removed = c
        }
        return c.clientId !== clientId
      })
      return removed
    },
    getPlayers: (gameId) => {
      return store[gameId] || []
    },
    broadcastUpdate: (gameId, gameJson) => {
      console.log('broadcastUpdate', gameId)
      if (!(gameId in store)) { return }
      const players = (store[gameId] || [])
      const update = {
        event: 'update',
        online: players
          .filter((c) => !['admin', 'present'].includes(c.player))
          .map((c) => pick(c, ['player', 'name', 'lastMessageTime', 'clientId'])),
        ...gameJson,
      }
      const message = JSON.stringify(update)
      players.forEach((c) => c.send(message))
    }
  }
}

module.exports = {
  makeManager,
}
