const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");
const {
  earningCoinsRule,
} = require("../utils/constants/payloadInterface/payload.interface");

const qualificationSchema = new Schema({
  education: { type: String, default: null },
  passingYear: { type: String, default: null },
  boardUniversity: { type: String, default: null },
  stream: { type: String, default: null },
  Percentage: { type: String, default: null },
});

const userSchema = new Schema(
  {
    uuid: {
      type: String, // Use a string type for UUID
      default: uuidv4, // Generate a UUID using uuidv4 as the default value
    },
    firstName: { type: String, required: true },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, default: null },
    earnGerms: {
      type: Number,
      default: 0,
    },
    bonusGerms: {
      type: Number,
      default: earningCoinsRule?.signupBonusCoins?.coin, //signup bonus germs
    },
    password: { type: String },
    educationQualification: [qualificationSchema],
  },
  { timestamps: true }
);

exports.userModel = mongoose.model("User", userSchema);
