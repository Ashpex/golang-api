const Presentation = require("../models/presentation.model");
const User = require("../models/user.model");
const Slide = require("../models/slide.model");

exports.findAllPresentationsByUserId = async (userId) => {
  const presentations = await Presentation.find({ userId: userId });
  return presentations;
};

exports.findPresentationById = async (presentationId, userId) => {
  if (userId) {
    const presentation = await Presentation.findOne({
      _id: presentationId,
      userId: userId,
    });
    return presentation;
  } else {
    const presentation = await Presentation.findOne({
      _id: presentationId,
    });
    return presentation;
  }
};

exports.createPresentation = async (presentation) => {
  const newPresentation = new Presentation({
    name: presentation.name,
    description: presentation.description,
    userId: presentation.userId,
    createdAt: Date.now(),
  });
  const result = await newPresentation.save();
  await User.findOneAndUpdate(
    { _id: presentation.userId },
    { $push: { presentations: result._id } }
  );
  return result;
};

exports.updatePresentation = async (presentation) => {
  const updatedPresentation = await Presentation.findOneAndUpdate(
    { _id: presentation._id },
    presentation,
    { new: true }
  );
  return updatedPresentation;
};

exports.deletePresentation = async (presentationId) => {
  const deletedPresentation = await Presentation.findOneAndDelete({
    _id: presentationId,
  });
  await User.findOneAndUpdate(
    { _id: deletedPresentation.userId },
    { $pull: { presentations: deletedPresentation._id } }
  );
  return deletedPresentation;
};

exports.createSlide = async (slide) => {
  const newSlide = new Slide({
    question: slide?.question || "",
    presentationId: slide.presentationId,
    options: slide?.options || [],
  });
  const result = await newSlide.save();
  await Presentation.findOneAndUpdate(
    { _id: slide.presentationId },
    { $push: { slides: result._id } }
  );
  return result;
};

exports.findAllSlidesBySlideIds = async (slideIds) => {
  const slides = await Slide.find({ _id: { $in: slideIds } });
  return slides;
};

exports.findSlideById = async (slideId) => {
  const slide = await Slide.findOne({ _id: slideId });
  return slide;
};

exports.updateSlide = async (slide) => {
  const updatedSlide = await Slide.findOneAndUpdate({ _id: slide.id }, slide, {
    new: true,
  });

  return updatedSlide;
};

exports.deleteSlide = async (slideId, presentationId) => {
  const deletedSlide = await Slide.findOneAndDelete({ _id: slideId });
  await Presentation.findOneAndUpdate(
    { _id: presentationId },
    { $pull: { slides: deletedSlide._id } }
  );
  return deletedSlide;
};
