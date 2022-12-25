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
// Get all blog posts
router.get("/posts/all", blogController.getAllBlogPosts);
// Create a blog post
router.post("/create", cleanBody, blogController.createBlogPost);
// Get blog categores
router.get("/categories/all", blogController.getBlogCategories);
// Delete blog post
router.delete("/delete/:_id", blogController.deleteBlogPost);
module.exports = router;