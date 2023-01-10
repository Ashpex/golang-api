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
  type: { type: String, default: "" },
  answer: { type: String, default: "" },
  heading: { type: String, default: "" },
  subHeading: { type: String, default: "" },
  paragraph: { type: String, default: "" },
  presentationId: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
});

const Slide = mongoose.model("Slide", SlideSchema);
module.exports = Slide;
