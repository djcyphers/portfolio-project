const express = require("express");
const router = express.Router();
const galleryController = require("../controller/galleryController");
/* 

Route localhost/uploads/galleries/
All routes are prepended with gallery *Reminder lol*

*/

// Get gallery image by title and name
router.get("/:galleryTitle/:fileName", galleryController.getGalleryImage);

module.exports = router;