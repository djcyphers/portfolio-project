// Gallery Model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
    {
        blogTitle: {
            type: String,
            required: true,
        },
        blogContent: {
            type: String,
            required: true,
        },
        // reference image instances to their folder path
        blogImages: [{
            type: String,
        }],
        // reference blog instances with author
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

const Blog = mongoose.model("Blog", blogSchema, "blogs");
module.exports = Blog;
