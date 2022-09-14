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
// Get gallery name by id
router.get("/id/:id", galleryController.getGalleryNameById);
// Get gallery items by the gallery name they come from
router.get("/items/:name", galleryController.getGalleryItemsByGalleryName);
// Get all gallery items
router.get("/items/all", galleryController.getAllGalleryItems);
// Create new gallery
router.post("/create", cleanBody, galleryController.createGallery);
// Get all galleries
router.get("/all", galleryController.getAllGalleries);
// Update gallery by name
router.put("/update/:name", cleanBody, galleryController.updateGallery);
// Get image location in public folder for gallery cover art
router.get("/coverart/:name", galleryController.getGalleryCoverImage);
// Post gallery item to gallery
// eslint-disable-next-line prettier/prettier
router.post("/item/create/:id", cleanBody, galleryController.addItemToGallery);
// Delete gallery item by title
router.delete("/item/delete/:_id", cleanBody, galleryController.deleteItemFromGallery);
// Delete gallery by name
router.delete("/delete/:name", cleanBody, galleryController.deleteGallery);

module.exports = router;
