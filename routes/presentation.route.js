const express = require("express");
const router = express.Router();
const PresentationController = require("../controllers/presentation.controller");

router.get("/", PresentationController.getAllPresentations);

router.get("/slides", PresentationController.getAllSlides);

router.get("/:presentationId", PresentationController.getPresentationById);

router.post("/", PresentationController.createPresentation);

router.put("/:presentationId", PresentationController.updatePresentation);

router.delete("/:presentationId", PresentationController.deletePresentation);

router.get("/slides/first", PresentationController.getFirstSlide);

router.get("/slides/:slideId", PresentationController.getSlideById);

router.post("/slides", PresentationController.createSlide);

router.post("/slides/:slideId/answer", PresentationController.answerSlide);

router.put("/slides/:slideId", PresentationController.updateSlide);

router.delete("/slides/:slideId", PresentationController.deleteSlide);

module.exports = router;
