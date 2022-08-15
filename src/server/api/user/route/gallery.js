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
// Get gallery items by gallery name
router.get("/items/:name", galleryController.getGalleryItemsByGalleryName);
// Create new gallery
router.post("/create", cleanBody, galleryController.createGallery);
// Get all galleries
router.get("/all", galleryController.getAllGalleries);
// Update gallery by id
router.patch("/update/:name", cleanBody, galleryController.updateGallery);
// Get image location in public folder for gallery cover art
router.get("/coverart/:name", galleryController.getGalleryCoverImage);
// Post gallery item to gallery
// eslint-disable-next-line prettier/prettier
router.post("/item/create/:name", cleanBody, galleryController.addItemToGallery);

module.exports = router;
