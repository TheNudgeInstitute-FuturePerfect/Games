const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserResumeHistorySchema = new Schema(
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
    userResumeInProgressId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User_Resume_InProgress",
    },
    payload: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

exports.userResumeHistoryModel = mongoose.model(
  "User_Resume_History",
  UserResumeHistorySchema
);
