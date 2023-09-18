const mongoose = require("mongoose");
const { Schema } = mongoose;

const BuildResumeRuleSchema = new Schema(
  {
    welcome: { type: String, default: null },
    description: { type: String, default: null },
    steps: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

exports.buildResumeRuleModel = mongoose.model('Build_Resume_Rule', BuildResumeRuleSchema)
