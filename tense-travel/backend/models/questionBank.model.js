const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionBankSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    word: { type: String, required: true },
    tenseEraTitle: { type: String, default: null },
    tenseEraId: {
      type: Schema.Types.ObjectId,
      ref: "Tense_Era",
      required: true,
    },
    stageTitle: { type: String, default: null },
    stageId: {
      type: Schema.Types.ObjectId,
      ref: "Tense_Era.stage",
      required: true,
    },
    level: { type: String, default: null },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    explanation: { type: String, default: null },
    isCorrect: { type: Boolean, default: null },
  },
  {
    timestamps: true,
  }
);

exports.questoinBankModel = mongoose.model("Question_Bank", QuestionBankSchema);
