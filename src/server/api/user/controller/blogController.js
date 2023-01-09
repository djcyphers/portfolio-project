/*
    Blog Controller
    Upload, save, etc, to MongoDB and Storage folder(s)
*/
// Load the core build.
var _ = require('lodash');
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
const { errorMonitor } = require("events");
const { response } = require("express");
const vueAssets = "../../../../assets/blog";
const uploadUrl = path.join(__dirname, vueAssets);

// Validate Scheme with Joi
const blogSchema = Joi.object().keys({
    blogTitle: Joi.string().required().min(2),
    blogContent: Joi.string().required(),
    blogCategory: Joi.string().required(),
});

// This should work in node.js and other ES5 compliant implementations.
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

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

// Get all blog posts
exports.getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await Blog.find({});
        if (!blogPosts) {
            return res.json({
                error: true,
                status: 404,
                message: "Blog post not found!",
            });
        }
        res.send(blogPosts);
    } catch (error) {
        return res.json({
            error: true,
            status: 404,
            message: "Get all blog posts failed!",
        });
    }
}

// Get all blog categories
exports.getBlogCategories = async (req, res) => {
    try {
        const blogCategories = await Blog.find({}, 'blogCategory');
        if (!blogCategories) {
            return res.json({
                error: true,
                status: 404,
                message: "Blog categories not found!",
            });
        }
        // Return categories
        res.send(blogCategories);
    } catch (error) {
        return res.json({ 
            error: true,
            status: 500,
            message: "Categories error: " + error,
        });
    };
}

// Delete blog post by ID
exports.deleteBlogPost = async (req, res) => {
    try {
        const blogPost = await Blog.findById({
            // find by name
            _id: req.params._id,
        });
        if (!blogPost) {
            return res.json({
                error: true,
                status: 400,
                message: "Blog post does not exist!",
            });
        }
        // Delete folder recursively
        const blogFolderName = blogPost.blogTitle.replace(/\s+/g, "-").toLowerCase().trim();
        const blogFolder = `${uploadUrl}\\${blogFolderName}`;
        if (fs.existsSync(blogFolder)) {
            fs.rmSync(blogFolder, { recursive: true, force: true });
            console.log('Blog Post Deleted!'); 
        }
        await Blog.findByIdAndDelete(req.params._id);

    } catch (error) {
        return res.json({ 
            error: true,
            status: 500,
            message: "Delete Blog Post Error => " + error,
        });
    }
}

// Update blog post
exports.updateBlogPost = async (req, res) => {
    let responseSent = false;
    try {
    // Have to do this the hard way, no default for multi files :(
    const form = new formidable.IncomingForm();
    const fields = [];
    const files = [];
    // Each post can have multiple images
    form.multiples = true;
    // Push fields and files to the array arrgh I had to re-study [] properties :`(
    form.on('field', (fieldName, fieldValue) => {
      // Note how you push the object fields bleh
      fields.push({ field: fieldName, value: fieldValue });
    });
    // Parse each file because parsing files doesn't work smh
    form.on('file', (fieldName, file) => {
      files.push({ field: fieldName, value: file });
    });
    form.on('error', console.error);
    // All the logic goes here instead of form.parse
    form.once('end', async () => {
        // Check if undefined or missing fields
        if (!fields[0].value || !fields[1].value || !fields[2].value) {
            return res.json({
            error: true,
            status: 400,
            message: 'Please fill all the fields!',
            });
        }
        const fieldValues = {
            blogTitle: [fields[0].value].toString(),
            blogCategory: [fields[1].value].toString(),
            blogContent: [fields[2].value].toString(),
        };
        
        // Validate fields
        const result = blogSchema.validate(fieldValues);
        console.log("Field Values: " + JSON.stringify(result));
        console.log("Files: " + JSON.stringify(files));
        if (result.error) {
            return res.json({
            error: true,
            status: 400,
            message: `Schema Error: ${result.error.details[0].message}`,
            });
        }
        // Find the blog post
        const blogPost = await Blog.findById(req.params._id);
        if (!blogPost) {
            return res.json({
            error: true,
            status: 400,
            message: 'Blog post not found',
            });
        }
        // Update the field values
        await Blog.findOneAndUpdate(
            { _id: req.params._id },
            {
                $set: {
                    blogTitle: fieldValues.blogTitle,
                    blogCategory: fieldValues.blogCategory,
                    blogContent: fieldValues.blogContent,
                },
            },
            { new: true }
        );

        // Update the folder name to match the new blog title
        const oldBlogTitle = blogPost.blogTitle;
        const newBlogTitle = fieldValues.blogTitle;
        const oldFolderName = oldBlogTitle.replace(/\s+/g, '-').toLowerCase();
        const newFolderName = newBlogTitle.replace(/\s+/g, '-').toLowerCase();
        if (oldFolderName !== newFolderName) {
            fs.renameSync(`${uploadUrl}\\${oldFolderName}`, `${uploadUrl}\\${newFolderName}`);
        }

        // Get the list of filenames from the database and file system
        const dataBaseFilenames = blogPost.blogImagesUrls.map(url => path.basename(url));
        const modifiedFilenames = [fields[3].value].toString().split(",");
        const deletedFilenames = _.difference(dataBaseFilenames, modifiedFilenames);
        console.log(`Deleted Filenames: ${deletedFilenames} || URL: ${req.url}`);
        // Delete the deleted filenames from the folder and DB
        if (deletedFilenames.length > 0) {
            for (const filename of deletedFilenames) {
                const fileUrl = `${uploadUrl}\\${newFolderName}\\${filename}`;
                if (fs.existsSync(fileUrl)) {
                fs.unlinkSync(fileUrl, (err) => {
                    if (err) console.log(`fs.unlink Error: ${ err }`);
                    console.log(`${ fileUrl } was deleted`);
                });
                await Blog.findOneAndUpdate({ _id: req.params._id }, { $pull: { blogImagesUrls: fileUrl } }, { new: true });
                }
            }
        }
        if (files.length > 0) {
            // Save the new uploaded filenames to the folder and DB
            for (const file of files) {
                const date = new Date();
                const fileName = `${date.getTime()}-${file.value.originalFilename}`;
                const filepath = `${uploadUrl}\\${newFolderName}\\${fileName}`;
                const rawData = fs.readFileSync(file.value.filepath);
                fs.writeFileSync(filepath, rawData, (err) => {
                    if (err) {
                        return res.json({
                            error: true,
                            status: 400,
                            message: "Failed to save file!",
                        });
                    }
                });
                await Blog.findOneAndUpdate({ _id: req.params._id }, { $addToSet: { blogImagesUrls: filepath } }, { new: true });
            }
        }
        // An extra check to make sure a response isn't sent twice. form.once solves this tho.
        responseSent = true;
        return res.json({
            error: false,
            status: 200,
            message: 'Blog post updated!',
        });
    });
    form.parse(req);
    } catch (error) {
        if (!responseSent) {
            return res.json({
                error: true,
                status: 500,
                message: "Internal server error => " + error,
            })
        } else { console.log(`Error Caught in Update Blog Post: ${ error }`) };
    }
};

// Create blog post
exports.createBlogPost = async (req, res) => {
    try {
        // Have to do this the hard way, no default for multi files :(
        const form = new formidable.IncomingForm();
        const fields = [];
        const files = [];
        // Each post can have multiple images
        form.multiples = true;
        // Push fields and files to the array arrgh I had to re-study [] properties :`(
        form.on('field', (fieldName, fieldValue) => {
            // Note how you push the object fields bleh
            fields.push( { field: fieldName, value: fieldValue } );
        });
        // Parse each file because parsing files doesn't work smh
        form.on('file', (fieldName, file) => {
            files.push({ field: fieldName, value: file })
        });
        form.on('error', console.error);
        // All the logic goes here instead of form.parse
        form.on('end', async () => {
            // Check if undefined or missing fields
            if (!fields[0].value || !fields[1].value || !fields[2].value) {
                return res.json({
                    error: true,
                    status: 400,
                    message: "Please fill all the fields!",
                });
            }
            const fieldValues = {
                "blogTitle": [fields[0].value].toString(),
                "blogCategory": [fields[1].value].toString(),
                "blogContent": [fields[2].value].toString(),
            }
            // Check files
            if (!files) {
                return res.json({
                    error: true,
                    status: 400,
                    message: "Please include an image. So lazy!",
                });
            }
            // Validate fields
            const result = blogSchema.validate(fieldValues);
            if (result.error) {
                return res.json({
                    error: true,
                    status: 400,
                    message: "Schema Error: " + result.error.details[0].message,
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
            // Create new blog and save result data we validated earlier to database
            const newBlogPost = new Blog({
                blogTitle: fieldValues.blogTitle,
                blogCategory: fieldValues.blogCategory,
                blogContent: fieldValues.blogContent,
            });
            await newBlogPost.save();
            // Create a blog folder if not exists (it should)
            const formatName = fieldValues.blogTitle.replace(/\s+/g, "-").toLowerCase();
            const blogFolder = `${uploadUrl}\\${formatName}`;
            if (!fs.existsSync(blogFolder)) {
                fs.mkdirSync(blogFolder, { recursive: true });
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
            // Iterate through files and convert to file
            for (let i = 0; i < Object.keys(files).length; i++) { // can't get the length on files?
                const file = files[i].value;
                // Iterate through and skip undefined
                if (file != undefined) {
                    if (allowedMimeTypes.includes(file.mimetype)) {
                        const formatName = fieldValues.blogTitle.replace(/\s+/g, "-").toLowerCase();
                        const blogFolder = `${uploadUrl}\\${formatName}`;
                        // Save image to storage
                        const date = new Date();
                        const fileName = `${date.getTime()}-${file.originalFilename}`;
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
                            { blogTitle: fieldValues.blogTitle },
                            { $addToSet: { blogImagesUrls: filepath } },
                            function (err, result) {
                                if (err) {
                                    console.log(err);
                                    return res.json({
                                        error: true,
                                        status: 400,
                                        message: "DB Failed on Update => " + err
                                    })
                                } else {
                                    console.log("Blog Update => " + result);
                                }
                            }
                        )
                    }
                }
            }
            console.log( files[0].value );
            return res.json({
                error: false,
                status: 200,
                message: "Blog post created successfully!",
            });
        });
        form.parse(req);
        // Return success
            
    } catch (error) {
        return res.json({
            error: true,
            status: 500,
            message: "Internal server error => " + error,
        })
    }
}
