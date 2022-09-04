// Model for each single gallery item
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const galleryItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    galleryItemUrl: {
      type: String,
      required: true,
    },
    galleryItemFileName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // reference gallery by ID
    galleryId: {
      type: Schema.Types.ObjectId,
      ref: "Gallery",
    },
    // Helpful for getting path names for images
    galleryName: {
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

const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
module.exports = GalleryItem;
