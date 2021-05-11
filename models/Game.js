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
    unique: true,
  },
  // The passcode for admin.
  // Guards questions, playerRegex, playerRegexMessage
  adminCode: {
    type: mongoose.Schema.Types.String,
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
  buttonLeftTitle: {
    type: mongoose.Schema.Types.String,
    default: 'Left',
  },
  buttonMiddleTitle: {
    type: mongoose.Schema.Types.String,
    default: '🏖',
  },
  buttonRightTitle: {
    type: mongoose.Schema.Types.String,
    default: 'Right',
  },
  // All the players that have ever joined.
  // Use `$addToSet` to avoid duplicates and overwriting!!
  players: {
    type: [mongoose.Schema.Types.String],
  },
  /*
  playerInfo: {
    <player>: {
      name: 'asdf',
      lastPingTs: 92108210,
    }
  }
  */
  playerInfo: {
    type: mongoose.Schema.Types.Object,
    default: {},
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
  openQuestionId: {
    type: mongoose.Schema.Types.String,
    default: null,
  },
  // Key questionId to value response arrays {"a":[...],"b":[...]},
  // use `$addToSet` and `$pull` to avoid duplicates and overwriting!!
  responses: {
    type: mongoose.Schema.Types.Object,
    default: {},
  },
}, {
  timestamps: true, // createdAt, updatedAt
})

module.exports = mongoose.model('game', GameSchema)
