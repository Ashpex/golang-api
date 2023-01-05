const PresentationService = require("../services/presentation.service");

exports.getAllPresentations = async (req, res) => {
  try {
    const presentations =
      await PresentationService.findAllPresentationsByUserId(req.query.userId);
    if (presentations) {
      res.status(200).json(presentations);
    } else {
      res.status(404).json({ message: "Presentations not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPresentationById = async (req, res) => {
  try {
    const presentation = await PresentationService.findPresentationById(
      req.params.presentationId,
      req.query.userId
    );
    if (presentation) {
      res.status(200).json(presentation);
    } else {
      res.status(404).json({ message: "Presentation not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPresentation = async (req, res) => {
  try {
    const presentation = await PresentationService.createPresentation(req.body);
    res.status(201).json(presentation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePresentation = async (req, res) => {
  try {
    const presentation = await PresentationService.updatePresentation(req.body);
    res.status(200).json(presentation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePresentation = async (req, res) => {
  try {
    const presentation = await PresentationService.deletePresentation(
      req.params.presentationId
    );
    res.status(200).json(presentation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSlides = async (req, res) => {
  try {
    const presentation = await PresentationService.findPresentationById(
      req.params.presentationId,
      req.query.userId
    );

    if (presentation) {
      const slides = await PresentationService.findAllSlidesBySlideIds(
        presentation.slides
      );

      res.status(200).json(slides);
    } else {
      res.status(404).json({ message: "Presentation not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSlide = async (req, res) => {
  try {
    const slide = await PresentationService.createSlide(req.body);
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSlide = async (req, res) => {
  try {
    const slide = await PresentationService.findSlideById(req.params.slideId);
    if (!slide) {
      res.status(404).json({ message: "Slide not found" });
    } else {
      const updatedSlide = await PresentationService.updateSlide({
        id: req.params.slideId,
        ...req.body,
      });
      res.status(200).json(updatedSlide);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSlide = async (req, res) => {
  try {
    const slide = await PresentationService.findSlideById(req.params.slideId);
    if (!slide) {
      res.status(404).json({ message: "Slide not found" });
    } else {
      const deletedSlide = await PresentationService.deleteSlide(
        req.params.slideId,
        req.body.presentationId
      );
      res.status(200).json(deletedSlide);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
