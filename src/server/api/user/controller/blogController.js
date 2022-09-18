/*
    Blog Controller
    Upload, save, etc, to MongoDB and Storage folder(s)
*/
// Validate
const Joi = require("joi");
// Models
const User = require("../model/User");
const Blog = require("../model/Blog");
// Utils
const fs = require("fs");
const path = require("path");
// const util = require('util')
// Multiform Upload
const formidable = require("formidable");
const vueAssets = "../../../../assets/blog";
const uploadUrl = path.join(__dirname, vueAssets);

// Validate Scheme with Joi
const blogSchema = Joi.object().keys({
    blogTitle: Joi.string().required().min(2),
    blogContent: Joi.string().required(),
    blogImages: Joi.string(),
    blogCategory: Joi.string().required().min(2)
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

// Create blog post
exports.createBlogPost = async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        // Each post can have multiple images
        form.multiples = true;
        // Parse form data
        form.parse(req, async (err, fields, files) => {
            try {
                if (err) {
                    return res.json({
                        error: true,
                        status: 400,
                        message: "Failed to create blog post!",
                    });
                }
                // Check if undefined or missing fields
                const { blogTitle, blogContent, blogCategory } = fields;
                if (!blogTitle || !blogContent || !blogCategory) {
                    return res.json({
                        error: true,
                        status: 400,
                        message: "Please fill all the fields!",
                    });
                }
                // Check files
                if (!files) {
                    return res.json({
                        error: true,
                        status: 400,
                        message: "Please upload an image. So lazy!",
                    });
                }
                // Validate fields
                const result = blogSchema.validate(fields);
                if (result.error) {
                    return res.json({
                        error: true,
                        status: 400,
                        message: result.error.message,
                    });
                }
                // Check if post already exists
                const blogPost = await Blog.findOne({
                    blogTitle: fields.blogTitle,
                });
                if (blogPost) {
                    return res.json({
                        error: true,
                        status: 400,
                        message: "Blog post already exists!",
                    });
                }
                // Create new blog and save data to database
                const newBlogPost = new Blog(fields);
                await newBlogPost.save();
                // Create a blog folder if not exists (it should)
                const formatName = fields.blogTitle.replace(/\s+/g, "-").toLowerCase();
                const blogFolder = `${uploadUrl}\\${formatName}`;
                if (!fs.existsSync(blogFolder)) {
                    fs.mkdirSync(blogFolder);
                }
                // if file is mime type jpeg, png, gif, svg, webp, mp3 or mp4
                const allowedMimeTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "image/svg+xml",
                    "image/webp",
                    "audio/mp3",
                    "video/mp4",
                ];
                for (let file in files.files) {
                    if (allowedMimeTypes.includes(file.mimetype)) {
                        // Save image to storage
                        const date = new Date();
                        const originalFileName = file.originalFilename;
                        const fileName = `${date.getTime()}-${originalFileName}`;
                        const filepath = `${blogFolder}\\${fileName}`;
                        const rawData = fs.readFileSync(file.filepath);
                        // Save file to storage
                        fs.writeFileSync(filepath, rawData, (err) => {
                            if (err) {
                                return res.json({
                                    error: true,
                                    status: 400,
                                    message: "Failed to save file!",
                                });
                            }
                        });
                        // Push image to new blog post
                        Blog.updateOne(
                            { _id: req.param._id },
                            { $addToSet: { blogImagesUrls: filepath } },
                            function (err, result) {
                                if (err) {
                                    console.log(err);
                                    return res.json({
                                        error: true,
                                        status: 400,
                                        message: "DB Update Failed on Update => " + err
                                    })
                                } else {
                                    console.log("Blog Update => " + result);
                                }
                            }
                        )
                        // Return success
                        return res.json({
                            error: false,
                            status: 200,
                            message: "Blog post created successfully!",
                        });
                    }
                }
            } catch (error) {
                return res.json({
                    error: true,
                    status: 500,
                    message: "Formidable error! => " + error,
                })
            }
        })
    } catch (error) {
        return res.json({
            error: true,
            status: 500,
            message: "Internal server error => " + error,
        })
    }
}
