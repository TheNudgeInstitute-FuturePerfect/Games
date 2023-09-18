const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserResumeInProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    buildResumeRuleId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Build_Resume_Rule",
    },
    profileRoleId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Profile_Role",
    },
    profileRoleTitle: {
      type: String,
      default: null,
    },
    status: { type: String, enum: ["inProgress", "completed"] },
    steps: { type: Array, require: true },
    description: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

exports.userResumeInProgressModel = mongoose.model(
  "User_Resume_InProgress",
  UserResumeInProgressSchema
);
