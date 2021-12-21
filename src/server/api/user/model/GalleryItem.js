// Model for each single gallery item
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const galleryItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // reference to gallery it belongs to
  gallery: {
    name: {
      type: String,
      required: true,
    },
    type: Schema.Types.ObjectId,
    ref: "Gallery",
    required: true,
  },
});

const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
module.exports = GalleryItem;
