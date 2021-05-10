const Game = require('./models/Game')

const UPDATE_RETRIES = 5
// Updates gameState with optimistic locking.
// If modifying activeQuestionId, MAKE SURE TO VALIDATE THE adminCode FIRST!
// Current returned result is the update metadata, NOT the new gameState record!!
async function updateGameState(gameId, gameState, retriesLeft) {
  return Game.findOne({ gameId }).then((game) => {
    if (!game) {
      const err = new Error('Not found')
      err.code = 404
      throw err
    }

    const newGameState = Object.assign({}, game.gameState, gameState, {
      version: game.gameState.version + 1
    })

    return Game.updateOne({ gameId, 'gameState.version': game.gameState.version }, { gameState: newGameState })
      .then((result) => {
        if (result.nModified < 1) {
          if (retriesLeft > 0) {
            return updateGameState(gameId, gameState, retriesLeft-1)
          } else {
            const err = new Error('Failed to update game state with version', game.gameState.version)
            err.code = 500
            throw err
          }
        } else {
          return result
        }
      })
  })
}

// function makeGame() {
//   return {
//     openQuestion: (gameId, questionId) => {

//     },
//     makeChoice: (gameId, player, questionId, id) => {
//       const game = getGame(gameId)
      
//       manager.newGameState(game)
//     },
//   }
// }

function renderGameJson(game) {
  return {
    gameId: game.gameId,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
    questions: game.questions,
    playerRegexMessage: game.playerRegexMessage,
    playerRegex: game.playerRegex,
    openQuestionId: game.openQuestionId,
    players: game.players,
    playerInfo: game.playerInfo,
    responses: game.responses,
  }
}

// function renderGameStateJson(game) {
//   return {
//     gameId: game.gameId,
//     openQuestionId: game.openQuestionId,
//     responses: game.responses,
//   }
// }

module.exports = {
  updateGameState,
  renderGameJson,
}
