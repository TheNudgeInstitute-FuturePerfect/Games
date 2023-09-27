const mongoose = require("mongoose");
const {
  heartLives,
} = require("../utils/constants/payloadInterface/payload.interface");
const { Schema } = mongoose;

const TenseStageSchema = new Schema({
  stageId: {
    type: Schema.Types.ObjectId,
    ref: "Tense_Era.stage",
    required: true,
  },
  tenseEraId: {
    type: Schema.Types.ObjectId,
    ref: "Tense_Era",
    required: true,
  },
  stageTitle: {
    type: String,
    default: "",
  },
  earnStars: {
    type: Number,
    default: 0,
  },
  earnGerms: {
    type: Number,
    default: 0,
  },
  defaultGerms: {
    type: Number,
    default: 0,
  },
  isLivePurchased: {
    type: Boolean,
    default: false,
  },
  livePurchasedCount: {
    type: Number,
    default: 0,
  },
  livePurchasedSpendingCoin: {
    type: Number,
    default: 0,
  },
  stageStatus: {
    type: Boolean,
    default: false,
  },
  completedStage: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  numberOfCorrect: {
    type: Number,
    default: 0,
  },
  numberOfInCorrect: {
    type: Number,
    default: 0,
  },
  retryCount: {
    type: Number,
    default: 0,
  },
  sequence: {
    type: Number,
    default: null,
  },
  attemptQuestions: {
    type: Number,
    default: 0,
  },
  lives: {
    type: Number,
    default: heartLives.live,
  },
  isLocked: {
    type: Boolean,
    default: true,
  }
});

const questionSchema = new Schema({
  questionBankId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "Question_Bank",
  },
  question: {
    type: String,
    default: null,
  },
  answer: {
    type: String,
    default: null,
  },
  userAnswer: {
    type: String,
    default: null,
  },
  isCorrect: { type: Boolean, default: null },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
});

const UserAnswerEraHistorySchema = new Schema(
  {
    userAnswerEraId: {
      type: Schema.Types.ObjectId,
      ref: "User_Answer_Era",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: {
      type: String,
      default: null,
    },
    tenseEraId: {
      type: String,
      require: true,
      ref: "Tense_Era",
    },
    tenseEraTitle: {
      type: Schema.Types.Boolean,
      default: false,
    },
    stageId: {
      type: String,
      ref: "Tense_Era.stage",
      required: true,
    },
    earnStars: {
      type: Number,
      default: 0,
    },
    earnGerms: {
      type: Number,
      default: 0,
    },
    stage: TenseStageSchema,
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

exports.userAnswerEraHistoryModel = mongoose.model(
  "User_Answer_Era_History",
  UserAnswerEraHistorySchema
);
