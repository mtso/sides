const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
  text: {
    type: mongoose.Schema.Types.String
  },
})

const GameSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.String,
    indexed: true,
  },
  questions: {
    type: [QuestionSchema]
  },
  // The regex to validate the ID by.
  playerRegex: {
    type: mongoose.Schema.Types.String,
    default: null,
  },
  playerRegexMessage: {
    type: mongoose.Schema.Types.String,
    default: null,
  },
  // All the players that have ever joined.
  players: {
    type: [mongoose.Schema.Types.String],
  },
  /*
  gameState: {
    version: 0 // used for optimistic locking.
    activeQuestionId: <id>,
    players: ["matthew <matthewt@wepay.com>", ...],
    responses: {
      <id>: {
        a: ["matthew <matthewt@wepay.com>", ...]
        b: [...]
      }
    }
  }
  */
  gameState: {
    version: {
      type: mongoose.Schema.Types.Number,
      default: 0,
    },
    openQuestionId: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
    // players: { type: [mongoose.Schema.Types.String] },
    // offline: { type: [mongoose.Schema.Types.String] },
    responses: {
      type: mongoose.Schema.Types.Object,
      default: {},
    },
  },
  adminCode: {
    type: mongoose.Schema.Types.String,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('game', GameSchema)
