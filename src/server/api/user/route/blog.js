const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const cleanBody = require("../../middleware/cleanbody");
/* 

Route localhost/blog/route 
All routes are prepended with blog *Reminder lol*

*/

// Get all blog posts
router.get("/posts/all", blogController.getAllBlogPosts);
// Create a blog post
router.post("/create", cleanBody, blogController.createBlogPost);
// Get blog categores
router.get("/categories/all", blogController.getBlogCategories);
// Delete blog post
router.delete("/delete/:_id", blogController.deleteBlogPost);
// Update blog post
router.put("/update/:_id", cleanBody, blogController.updateBlogPost);
// Get blog years
router.get("/posts/years/all", blogController.getBlogYears);
// Get previous blog post years
router.get("/posts/years/:year", blogController.getPreviousBlogYears);
// Get blog post by id
router.get("/id/:id", blogController.getBlogPostById);
// Get blog title from fetched URL
router.get("/getBlogPostURL", blogController.getBlogPostURL);
// Dekete blog post URL
router.delete("/url/:_id", blogController.deleteBlogPostURL);
// Redirect blog post url to catch for Vue redirect
router.get("/:url", blogController.handleBlogPostSlug);

module.exports = router;