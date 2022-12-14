const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PresentationSchema = new Schema({
  name: { type: String, default: "New Presentation" },
  description: { type: String, default: "New Description" },
  collaborators: [{ type: Schema.Types.ObjectId }],
  slides: { type: Schema.Types.ObjectId },
  userCreated: { type: Schema.Types.ObjectId },
  userUpdated: { type: Schema.Types.ObjectId },
});

const Presentation = mongoose.model("Presentation", PresentationSchema);
module.exports = Presentation;
