// Gallery Model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema(
  {
    galleryName: {
      type: String,
      required: true,
    },
    galleryDescription: {
      type: String,
      required: true,
    },
    galleryCoverArtUrl: {
      type: String,
      required: true,
    },
    galleryCoverArtFileName: {
      type: String,
      required: true,
    },
    // reference gallery instances with gallery items
    galleryItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "GalleryItem",
      },
    ],
    // reference gallery instances with user
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

const Gallery = mongoose.model("Gallery", gallerySchema, "galleries");
module.exports = Gallery;
