const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
// const cleanBody = require("../../middleware/cleanbody");
/* 

Route localhost/uploads/blogs/
All routes are prepended with uploads/blogs *Reminder lol*

*/

// Get gallery image by title and name
router.get("/:blogTitle/:fileName", blogController.getBlogImage);

module.exports = router;