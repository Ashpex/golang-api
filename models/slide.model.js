const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SlideSchema = new Schema({
  title: { type: String, default: "New Slide" },
  slideType: { type: String, default: "MULTIPLE_CHOICE" },
  options: [
    {
      value: String,
      image: String,
      quantity: Number,
    },
  ],
  answer: [String],
  presentationId: { type: Schema.Types.ObjectId },
  userCreated: { type: Schema.Types.ObjectId },
  userUpdated: { type: Schema.Types.ObjectId },
});

const Slide = mongoose.model("Slide", SlideSchema);
module.exports = Slide;
