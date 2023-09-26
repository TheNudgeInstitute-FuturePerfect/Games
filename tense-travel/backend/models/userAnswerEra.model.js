const mongoose = require("mongoose");
const {
  heartLives,
} = require("../utils/constants/payloadInterface/payload.interface");
const { Schema } = mongoose;

const TenseEraSchema = new Schema({
  tenseEraId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Tense_Era",
  },
  tenseEraTitle: {
    type: String,
    default: "",
  },
  completedEra: {
    type: Boolean,
    default: false,
  },
  attempt: {
    type: Number,
    default: 0,
  },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  earnGerms: {
    type: Number,
    default: 0,
  },
  stage: {
    type: [
      {
        stageId: {
          type: Schema.Types.ObjectId,
          ref: "Tense_Era.stage",
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
        },
        question: {
          type: [
            {
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
            },
          ],
        },
        histories: { type: Array, default: [] },
      },
    ],
  },
  description: { type: String, default: null },
  sequence: { type: Number, default: 1 },
});

const UserAnswerEraSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tenseEra: [TenseEraSchema],
    sessionId: {
      type: String,
      default: null,
    },
    earnGerms: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

exports.userAnswerEraModel = mongoose.model(
  "User_Answer_Era",
  UserAnswerEraSchema
);
