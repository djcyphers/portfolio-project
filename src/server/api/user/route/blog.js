const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const cleanBody = require("../../middleware/cleanbody");
/* 

Route localhost/blog/route 
All routes are prepended with blog *Reminder lol*

*/

// Get blog post by id
router.get("/id/:id", blogController.getBlogPostById);
// Make a blog post by id
router.post("/post/:id", blogController.createBlogPost);
// Get blog categores
router.get("/categories/all", blogController.getBlogCategories);

module.exports = router;