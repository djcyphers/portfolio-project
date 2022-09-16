/*
    Blog Controller
    Upload, save, etc, to MongoDB and Storage folder(s)
*/
// Validate
const Joi = require("joi");
// Models
//const User = require("../model/User");
const Blog = require("../model/Gallery");
const GalleryItem = require("../model/GalleryItem");
// Utils
const fs = require("fs");
const path = require("path");
// const util = require('util')
// Multiform Upload
const formidable = require("formidable");
const vueAssets = "../../../../assets/galleries";
const uploadUrl = path.join(__dirname, vueAssets);

// Validate Scheme with Joi
const blogSchema = Joi.object().keys({
    blogTitle: Joi.string().required().min(2),
    blogContent: Joi.string().required(),
    blogImages: Joi.string(),
});

// Get blog post by id
exports.getBlogPostById = async (req, res) => {
    try {
        const blogPost = await Blog.findById(req.params.id);
        if (!blogPost) {
            return res.json({
                error: true,
                status: 400,
                message: "Blog post does not exist!",
            });
        }
        return res.json({
            error: false,
            status: 200,
            message: "Blog Post found!",
            blogPost: blogPost,
        });
    } catch (error) {
        return res.json({
            error: true,
            status: 500,
            message: "Internal server error",
        });
    }
}
