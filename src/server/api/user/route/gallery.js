const express = require("express");
const router = express.Router();
const galleryController = require("../controller/galleryController");
const cleanBody = require("../../middleware/cleanbody");
/* 

Route localhost/gallery/route 
All routes are prepended with gallery *Reminder lol*

*/
// Get gallery by name
router.get("/name/:name", galleryController.getGalleryByName);
// Create new gallery
router.post("/create", cleanBody, galleryController.createGallery);
// Get all galleries
router.get("/all", galleryController.getAllGalleries);
// Update gallery by id
router.patch("/update/:id", cleanBody, galleryController.updateGallery);
// Get image location in public folder for gallery cover art
router.get("/coverart/:name", galleryController.getGalleryCoverImage);

module.exports = router;
