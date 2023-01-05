const express = require("express");
const router = express.Router();
const PresentationController = require("../controllers/presentation.controller");

router.get("/", PresentationController.getAllPresentations);

router.get("/:presentationId", PresentationController.getPresentationById);

router.post("/", PresentationController.createPresentation);

router.put("/:presentationId", PresentationController.updatePresentation);

router.delete("/:presentationId", PresentationController.deletePresentation);

router.get("/slides/:presentationId", PresentationController.getAllSlides);

router.post("/slides", PresentationController.createSlide);

router.put("/slides/:slideId", PresentationController.updateSlide);

router.delete("/slides/:slideId", PresentationController.deleteSlide);

module.exports = router;
