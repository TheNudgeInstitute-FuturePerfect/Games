const mongoose = require("mongoose");
const { Schema } = mongoose;

const EraTenseTypesSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, default: null },
  title: { type: String, required: true },
  description: { type: String, default: null },
  sequence: { type: Number, default: 1 },
});

const TesnseSchema = new Schema(
  {
    title: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    sequence: { type: Number, default: null },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    type: { type: String, default: "", required: true },
    stage: [EraTenseTypesSchema],
  },
  {
    timestamps: true,
  }
);

exports.eraTenseModel = mongoose.model("Tense_Era", TesnseSchema);
