const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PresentationSchema = new Schema({
  name: { type: String, default: "New Presentation" },
  description: { type: String, default: "New Description" },
  userId: { type: Schema.Types.ObjectId },
  slides: [{ type: Schema.Types.ObjectId }],
  createdAt: { type: Date, default: Date.now },
});

const Presentation = mongoose.model("Presentation", PresentationSchema);
module.exports = Presentation;
