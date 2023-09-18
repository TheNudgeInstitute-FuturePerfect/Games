const mongoose = require("mongoose");
const { Schema } = mongoose;

const qualificationSchema = new Schema({
  education: { type: String, default: null },
  passingYear: { type: String, default: null },
  boardUniversity: { type: String, default: null },
  stream: { type: String, default: null },
  Percentage: { type: String, default: null },
});

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, default: null },
    password: { type: String },
    educationQualification: [qualificationSchema],
  },
  { timestamps: true }
);

exports.userModel = mongoose.model("User", userSchema);
