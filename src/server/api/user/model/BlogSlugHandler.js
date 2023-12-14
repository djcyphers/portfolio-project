// Blog URL Model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Handle Blog URLS from sharing for SPA
const blogURLSchema = new Schema(
    {
        blogTitleURL: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

const BlogURL = mongoose.model("BlogURL", blogURLSchema, "blogURLS");
module.exports = BlogURL;
