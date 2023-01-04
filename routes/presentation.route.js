const express = require("express");
const router = express.Router();
const PresentationController = require("../controllers/presentation.controller");

// get all presentations
router.get("/", PresentationController.getAllPresentations);

// get presentation by id
router.get("/:presentationId", PresentationController.getPresentationById);

// create presentation
router.post("/", PresentationController.createPresentation);

// update presentation
router.put("/:presentationId", PresentationController.updatePresentation);

// delete presentation
router.delete("/:presentationId", PresentationController.deletePresentation);

// get all slides
router.get("/slides/:presentationId", PresentationController.getAllSlides);

// // create slide
router.post("/slides", PresentationController.createSlide);

// update slide
router.put("/slides/:slideId", PresentationController.updateSlide);

// // update slide
// router.put(
//   "/:userId/:presentationId/slides/:slideId",
//   PresentationController.updateSlide
// );

// // delete slide
// router.delete(
//   "/:userId/:presentationId/slides/:slideId",
//   PresentationController.deleteSlide
// );

module.exports = router;
