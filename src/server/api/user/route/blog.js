const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const cleanBody = require("../../middleware/cleanbody");
/* 

Route localhost/blog/route 
All routes are prepended with blog *Reminder lol*

*/

// Get gallery name by id
router.get("/id/:id", blogController.getBlogPostById);

module.exports = router;