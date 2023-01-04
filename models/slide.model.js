const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SlideSchema = new Schema({
  question: { type: String, default: "New Slide" },
  options: [
    {
      value: String,
      quantity: Number,
    },
  ],
  answer: [String],
  presentationId: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
});

const Slide = mongoose.model("Slide", SlideSchema);
module.exports = Slide;
