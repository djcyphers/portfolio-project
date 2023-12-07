/*
    Gallery Controller
    Upload, save, etc, to MongoDB and Storage folder(s)
*/
// Validate
const Joi = require("joi");
// Models
//const User = require("../model/User");
const Gallery = require("../model/Gallery");
const GalleryItem = require("../model/GalleryItem");
// Utils
const fs = require("fs");
const path = require("path");
// const util = require('util')
// Multiform Upload
const formidable = require("formidable");
// Function to find a directory by recursively traversing up the file system
var vueAssets, uploadUrl;
// Function to find a directory by recursively traversing up the file system
const findDirectory = (currentPath, targetDirectoryNames) => {
  for (const targetDirectoryName of targetDirectoryNames) {
    const targetPath = path.join(currentPath, targetDirectoryName);
    if (fs.existsSync(targetPath)) {
      return targetPath;
    }
  }

  const parentPath = path.dirname(currentPath);

  // If we've reached the root directory, return null (not found)
  if (currentPath === parentPath) {
    return null;
  }

  // Recursively search in the parent directory
  return findDirectory(parentPath, targetDirectoryNames);
};

// Usage
const targetDirectoryNames = ['src', 'www'];
var wwwPath; // Declaration without initialization

// Get the current working directory
const cwd = process.cwd();

wwwPath = findDirectory(cwd, targetDirectoryNames); // Assignment

if (!wwwPath) {
  console.error(`Neither 'src' nor 'www' folder found!`);
} else {
  vueAssets = "server/uploads/galleries";
  uploadUrl = path.join(wwwPath, vueAssets);
  // console.log('uploadUrl:', uploadUrl);
}

// Validate Scheme with Joi
const gallerySchema = Joi.object().keys({
  galleryName: Joi.string().required().min(2),
  galleryDescription: Joi.string().required(),
  galleryCoverArtUrl: Joi.string(),
});

// Validate Update Scheme with Joi
const galleryUpdateSchema = Joi.object().keys({
  galleryName: Joi.string().min(2),
  galleryOldName: Joi.string(),
  galleryDescription: Joi.string(),
  galleryCoverArtUrl: Joi.string(),
});

// Validate item schema
const itemSchema = Joi.object().keys({
  galleryId: Joi.string().required(),
  title: Joi.string().required().min(2),
  description: Joi.string().required(),
  galleryItemUrl: Joi.string(),
  galleryName: Joi.string().required(),
  galleryItemFileName: Joi.string(),
});

// Create new gallery
exports.createGallery = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    // Only need one file for the gallery cover item
    form.multiples = false;
    // Parse form
    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.json({
            error: true,
            status: 400,
            message: "Failed to create gallery!",
          });
        }
        const { galleryName, galleryDescription } = fields;
        if (!galleryName || !galleryDescription) {
          return res.json({
            error: true,
            status: 400,
            message: "Please fill all the fields!",
          });
        }
        if (!files) {
          return res.json({
            error: true,
            status: 400,
            message: "Please upload a cover art!",
          });
        }
        console.log("Fields: " + JSON.stringify(fields));
        const result = gallerySchema.validate(fields);
        if (result.error) {
          return res.json({
            error: true,
            status: 400,
            message: result.error.message,
          });
        }
        // Check if gallery already exists
        const gallery = await Gallery.findOne({
          galleryName: fields.galleryName,
        });
        if (gallery) {
          return res.json({
            error: true,
            status: 400,
            message: "Gallery already exists!",
          });
        }

        /*

        // Need to write image to folder after validation and saving to database

        */

        // Create a gallery folder if not exists (it should)
        const formatName = fields.galleryName
          .replace(/\s+/g, "-")
          .toLowerCase();
        const galleryFolder = path.join(uploadUrl, formatName);
        if (!fs.existsSync(galleryFolder)) {
          fs.mkdirSync(galleryFolder);
        }
        // Save cover art file to storage
        const file = files.files;

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
        if (allowedMimeTypes.includes(file.mimetype)) {
          // Save image to storage
          const date = new Date();
          const originalFileName = file.originalFilename;
          const fileName = `${date.getTime()}-${originalFileName}`;
          const filepath = path.join(galleryFolder, fileName);
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
          // Trim filepath for future api call
          const trimFilepath = filepath.split(path.sep);
          const filePathToSave = trimFilepath.slice(trimFilepath.length - 4).join("/");
          // Add filepath to result value
          fields.galleryCoverArtUrl = filePathToSave;
          fields.galleryCoverArtFileName = fileName;
          // Create new gallery and save data to database
          const newGallery = new Gallery(fields);
          await newGallery.save();
          // Return success
          return res.json({
            error: false,
            status: 200,
            message: "Gallery created successfully!",
          });
        }
      } catch (error) {
        // Catch Formidable errors
        return res.json({
          error: true,
          status: 400,
          message: "Failed to create gallery! " + error,
        });
      }
    });
    // Catch mongoose errors
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error",
    });
  }
};

// Delete Gallery
exports.deleteGallery = async (req, res) => {
  try {
    // Check if gallery exists
    const gallery = await Gallery.findOne({
      // find by name
      galleryName: req.params.name,
    });
    if (!gallery) {
      return res.json({
        error: true,
        status: 400,
        message: "Gallery does not exist!",
      });
    }
    // Delete gallery folder from drive
    const deletePath = path.join(uploadUrl, gallery.galleryName.toLowerCase());
    if (fs.existsSync(deletePath)) {
      fs.rmdirSync(deletePath, { recursive: true });
    }
    await GalleryItem.deleteMany({ galleryName: req.params.name });
    // Delete gallery from db
    await Gallery.findOneAndDelete({
      // find by name
      galleryName: req.params.name
    });
    // Return success
    return res.json({
      error: false,
      status: 200,
      message: "Gallery deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: true,
      status: 500,
      message: `Internal server error => ${error}`,
    });
  }
};

// Get Gallery
exports.getGalleryByName = async (req, res) => {
  try {
    const gallery = await Gallery.findOne({
      galleryName: req.params.name,
    });
    if (!gallery) {
      return res.json({
        error: true,
        status: 404,
        message: "Gallery Not Found",
      });
    }
    // Return gallery
    res.send(gallery);
  } catch (error) {
    res.json({
      error: true,
      status: 500,
      message: "Get Gallery Failed",
    });
  }
};

// Get all gallery items from gallery
exports.getGalleryItemsByGalleryName = async (req, res) => {
  try {
    const galleryItems = await GalleryItem.find({ galleryName: req.params.name });
    if (!galleryItems) {
      return res.json({
        error: true,
        status: 404,
        message: "Gallery Item Not Found!",
      });
    }
    else {
      res.send(galleryItems);
    }
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error: " + error,
    });
  }
};

// Get all galleries from MongoDB
exports.getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find({});
    if (!galleries) {
      return res.json({
        error: true,
        status: 404,
        message: "Galleries Not Found",
      });
    }
    // Return galleries
    res.send(galleries);
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Get Galleries Failed",
    });
  }
};

// Update Gallery
exports.updateGallery = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    // Only need one file for the gallery cover item
    form.multiples = false;
    // Parse form
    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.json({
            error: true,
            status: 400,
            message: "Failed to edit gallery!",
          });
        }
        const { galleryName } = fields;

        if (galleryName === undefined || galleryName === "undefined") {
          return res.json({
            error: true,
            status: 400,
            message: "Update request returned undefined!",
          });
        }
        // Validate data
        const result = galleryUpdateSchema.validate(fields);
        if (result.error) {
          return res.json({
            error: true,
            status: 400,
            message: result.error.message,
          });
        }
        // Check for old file and delete it
        const oldFile = await Gallery.findOne({ galleryName: fields.galleryOldName });
        if (!oldFile) {
          return res.json({
            error: true,
            status: 400,
            message: "Could not find the old gallery name!",
          });
        }
        const validUrl = oldFile.galleryCoverArtUrl;
        // Detele the old cover art file
        if (validUrl.length > 0) {
          fs.unlinkSync(validUrl, (err) => {
            if (err) console.log(`fs.unlink Error: ${err}`);
            console.log(`${validUrl} was deleted`);
          });
        } else {
          return res.json({
            error: true,
            status: 500,
            message: "File Delete Error! => " + err,
          });
        }
        // Save cover art file to storage
        const file = files.files;

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
        if (allowedMimeTypes.includes(file.mimetype)) {
          // Change gallery folder name
          const formatName = fields.galleryName.replace(/\s+/g, "-").toLowerCase();
          const galleryFolder = path.join(uploadUrl, formatName);
          const oldFormatName = fields.galleryOldName.replace(/\s+/g, "-").toLowerCase();
          // If we change the gallery name,rename the old folder
          if (formatName !== oldFormatName) {
            const oldGalleryFolder = path.join(uploadUrl, oldFormatName);
            try {
              if (fs.existsSync(oldGalleryFolder)) {
                // rename folder without deleting contents
                fs.renameSync(oldGalleryFolder, galleryFolder);
              }
            } catch (error) {
              console.log(error);
            }
          }
          // Save image to storage
          const date = new Date();
          const originalFileName = file.originalFilename;
          const fileName = `${date.getTime()}-${originalFileName}`;
          const filepath = path.join(galleryFolder, fileName);
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
          // Trim filepath for future api call
          const trimFilepath = filepath.split(path.sep);
          const filePathToSave = trimFilepath.slice(trimFilepath.length - 4).join("/");
          // Add filepath to result value
          fields.galleryCoverArtUrl = filePathToSave;
          fields.galleryCoverArtFileName = fileName;
        }
        // Update all gallery items with the new gallery name
        await GalleryItem.updateMany({ galleryName: fields.galleryOldName }, {
          galleryName: fields.galleryName
        });
        // Get galleryName then update gallery
        await Gallery.findByIdAndUpdate(oldFile._id, fields, { new: true, });
        return res.json({
          error: false,
          status: 200,
          message: "Gallery Updated!",
        });
      } catch (error) {
        // Catch Formidable errors
        return res.json({
          error: true,
          status: 400,
          message: "Formidable error => " + error,
        });
      }
    });
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error => " + error,
    });
  }
};

// Add item to gallery
exports.addItemToGallery = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    // Only need one file for each gallery item
    form.multiples = false;
    // Parse form
    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return res.json({
            error: true,
            status: 400,
            message: "Failed to add item to gallery!",
          });
        }

        const { galleryName, title, description } = fields;
        if (!galleryName || !title || !description) {
          return res.json({
            error: true,
            status: 400,
            message: "Please fill all the fields!",
          });
        }

        // Check if only one file was uploaded from Formidable
        if (!files) {
          return res.json({
            error: true,
            status: 400,
            message: "Please upload a gallery item!",
          });
        }

        // Get gallery old filename for later deletion
        // Validate fields data
        const result = itemSchema.validate(fields);
        if (result.error) {
          return res.json({
            error: true,
            status: 400,
            message: result.error.message,
          });
        }

        // Check if gallery item exists, if not create it
        const galleryItemCheckDuplicate = await GalleryItem.findOne({ title: fields.title });

        if (galleryItemCheckDuplicate) {
          return res.json({
            error: true,
            status: 400,
            message: "Gallery item already exists!",
          });
        }

        // Get galleryName to prepare for file upload
        const gallery = await Gallery.findById(fields.galleryId);
        if (!gallery) {
          return res.json({
            error: true,
            status: 404,
            message: "Gallery Not Found",
          });
        } else {
          // Create a gallery folder if not exists (it should exist)
          const formatName = fields.galleryName
            .replace(/\s+/g, "-")
            .toLowerCase();
          let galleryFolder = path.join(uploadUrl, formatName);
          if (fs.existsSync(galleryFolder)) {
            console.log("Gallery Exists: " + galleryFolder);
          }
          else {
            // Gallery should not exist, create anyway
            fs.mkdirSync(galleryFolder);
          }
        }
        // Save cover art file to storage
        const file = files.files;

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
        if (allowedMimeTypes.includes(file.mimetype)) {
          const formatName = fields.galleryName
            .replace(/\s+/g, "-")
            .toLowerCase();
          let galleryFolder = path.join(uploadUrl, formatName);
          // Save image to storage
          const date = new Date();
          const originalFileName = file.originalFilename;
          const fileName = `${date.getTime()}-${originalFileName}`;
          const filepath = path.join(galleryFolder, fileName);
          const rawData = fs.readFileSync(file.filepath);
          fs.writeFileSync(filepath, rawData, (err) => {
            if (err) {
              return res.json({
                error: true,
                status: 400,
                message: "Failed to save file!",
              });
            }
          });
          // Trim filepath for future api call
          const trimFilepath = filepath.split(path.sep);
          const filePathToSave = trimFilepath.slice(trimFilepath.length - 4).join("/");
          // Add filepath to result value
          fields.galleryItemUrl = filePathToSave;
          // Add fileName to result value
          fields.galleryItemFileName = fileName;
          // Validate schema after all fields are updated
          let result = itemSchema.validate(fields);
          if (result.error) {
            return res.json({
              error: true,
              status: 400,
              message: result.error.message,
            });
          }
        }
        // Add item to galleryItem db if no duplicate item exists
        const newItem = new GalleryItem(fields);
        await newItem.save();
        // Add item to galleryItems array in gallery db
        gallery.galleryItems.push(newItem);
        await gallery.save();
        return res.json({
          error: false,
          status: 200,
          message: "Gallery item added!",
        });
      } catch (error) {
        return res.json({
          error: true,
          status: 500,
          message: "Formidable error! " + error,
        });
      }
    });
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error! " + error,
    });
  }
};

// Delete item from gallery
exports.deleteItemFromGallery = async (req, res) => {
  try {
    // Get path from galleryItem db
    const galleryItem = await GalleryItem.findById({
      _id: req.params._id,
    });

    if (!galleryItem) {
      return res.json({
        error: true,
        status: 404,
        message: "Gallery item not found!",
      });
    }
    // Delete file from gallery folder
    const path = path.join(uploadUrl, galleryItem.galleryName.replace(/\s+/g, "-").toLowerCase(), galleryItem.galleryItemFileName);
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
        return res.json({
          error: true,
          status: 500,
          message: "Gallery Delete Error! => " + err,
        });
      }
      console.log("Deleted file from gallery folder!");
    });
    // Delete gallery item from gallery db
    await Gallery.findOneAndUpdate({ 'galleryName': galleryItem.galleryName }, { $pull: { 'galleryItems': req.params._id } });

    // Delete gallery item from gallery db
    await GalleryItem.deleteOne({ title: galleryItem.title })
      .then(() => {
        return res.json({
          error: false,
          status: 200,
          message: "Deletion Successful!",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          error: true,
          status: 500,
          message: "Gallery Delete Error! => " + err,
        });
      });
  } catch (err) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error! => " + err,
    });
  }
};

// Get gallery name by id
exports.getGalleryNameById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.json({
        error: true,
        status: 400,
        message: "Gallery does not exist!",
      });
    }
    return res.json({
      error: false,
      status: 200,
      message: "Gallery found!",
      galleryName: gallery.galleryName,
    });
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error",
    });
  }
}

// Get all gallery items from all galleries
exports.getAllGalleryItems = async (req, res) => {
  try {
    const galleryItem = await GalleryItem.find({});
    if (!galleryItem) {
      return res.json({
        error: true,
        status: 400,
        message: "No gallery items found!",
      });
    }
    return res.json({
      error: false,
      status: 200,
      message: "Gallery items found!",
      galleryItems: galleryItem,
    });
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error",
    });
  }
}

// Send file to gallery cuz Vue is whack
exports.getGalleryCoverImage = async (req, res) => {
  try {
    // Check if gallery exists
    const gallery = await Gallery.findOne({
      galleryName: req.params.name,
    });
    if (!gallery) {
      return res.json({
        error: true,
        status: 400,
        message: "Gallery does not exist!",
      });
    }

    // Check if file exists
    const file = gallery.galleryCoverArtUrl;
    if (!fs.existsSync(file)) {
      return res.json({
        error: true,
        status: 400,
        message: `File does not exist! Reason: ${file}`,
      });
    } else {
      let sendFile = fs.createReadStream(file);
      if (sendFile) {
        sendFile.pipe(res);
      } else {
        return res.json({
          error: true,
          status: 400,
          message: "File does not exist!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error",
    });
  }
};

// Get gallery image by via URL
exports.getGalleryImage = async (req, res) => {
  try {
    const { galleryTitle, fileName } = req.params;
    // Check if file exists
    const file = path.join(uploadUrl, galleryTitle, fileName);
    if (!fs.existsSync(file)) {
      return res.json({
        error: true,
        status: 400,
        message: `File does not exist! Reason: ${file}`,
      });
    } else {
      let sendFile = fs.createReadStream(file);
      if (sendFile) {
        sendFile.pipe(res);
      } else {
        return res.json({
          error: true,
          status: 400,
          message: "File does not exist!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error",
    });
  }
};
