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
  backgroundColorLeft: {
    type: mongoose.Schema.Types.String,
    default: 'white',
  },
  backgroundColorMiddle: {
    type: mongoose.Schema.Types.String,
    default: 'lightgray',
  },
  backgroundColorRight: {
    type: mongoose.Schema.Types.String,
    default: 'white',
  },
  radius: {
    type: mongoose.Schema.Types.Number,
    default: 40,
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

// GameSchema.index({updatedAt: 1}, {expireAfterSeconds: 14*24*60*60 }) // 14 days

module.exports = mongoose.model('game', GameSchema)
