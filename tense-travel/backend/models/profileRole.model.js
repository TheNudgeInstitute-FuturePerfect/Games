const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProfileRoleSchema = new Schema(
  {
    title: { type: String, unique: true },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

exports.profileRoleModel = mongoose.model("Profile_Role", ProfileRoleSchema);
