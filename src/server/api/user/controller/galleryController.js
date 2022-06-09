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
const vueAssets = "../../../../assets/galleries";
const uploadUrl = path.join(__dirname, vueAssets);
// Validate Scheme with Joi
const gallerySchema = Joi.object().keys({
  galleryName: Joi.string().required().min(2),
  galleryDescription: Joi.string().required(),
  galleryCoverArtUrl: Joi.string(),
});

// Validate Update Scheme with Joi
const galleryUpdateSchema = Joi.object().keys({
  galleryName: Joi.string().required().min(2),
  galleryOldName: Joi.string(),
  galleryDescription: Joi.string().required(),
  galleryCoverArtUrl: Joi.string(),
});

// Validate item schema
const itemSchema = Joi.object().keys({
  title: Joi.string().required().min(2),
  description: Joi.string().required(),
  galleryItemUrl: Joi.string(),
  galleryName: Joi.string().required(),
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
        // Create a gallery folder if not exists
        const formatName = fields.galleryName
          .replace(/\s+/g, "-")
          .toLowerCase();
        const galleryFolder = `${uploadUrl}/${formatName}`;
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
          const filepath = `${galleryFolder}/${fileName}`;
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
          // Add filepath to result value
          fields.galleryCoverArtUrl = filepath;
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
    // Delete gallery
    await Gallery.findOneAndDelete({
      // find by name
      galleryName: req.params.name,
    });
    // Delete gallery folder
    const formatName = req.params.name.replace(/\s+/g, "-").toLowerCase();
    const galleryFolder = `${uploadUrl}/${formatName}`;
    if (fs.existsSync(galleryFolder)) {
      fs.rmdirSync(galleryFolder, { recursive: true });
    }
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
      message: "Internal server error",
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
        const { galleryOldName, galleryName, galleryDescription } = fields;
        if (!galleryName || !galleryDescription || !galleryOldName) {
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

        // Get gallery old filename for later deletion
        const gallery = await Gallery.findOne({
          galleryName: galleryOldName,
        });
        // Create a variable to use for later to delete file with fs.unlinkSync
        const galleryOldFile = gallery.galleryCoverArtFileName;

        // Validate data
        const result = galleryUpdateSchema.validate(fields);
        if (result.error) {
          return res.json({
            error: true,
            status: 400,
            message: result.error.message,
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
          // Create a gallery folder if not exists
          const formatName = fields.galleryName
            .replace(/\s+/g, "-")
            .toLowerCase();
          const galleryFolder = `${uploadUrl}/${formatName}`;
          const oldFormatName = fields.galleryOldName.toLowerCase();
          // If we change the gallery name,rename the old folder
          if (formatName !== oldFormatName) {
            const oldGalleryFolder = `${uploadUrl}/${oldFormatName}`;
            if (fs.existsSync(oldGalleryFolder)) {
              // rename folder without deleting contents
              fs.renameSync(oldGalleryFolder, galleryFolder);
            }
          }
          // Save image to storage
          const date = new Date();
          const originalFileName = file.originalFilename;
          const fileName = `${date.getTime()}-${originalFileName}`;
          const filepath = `${galleryFolder}/${fileName}`;
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
          // Add filepath to result value
          fields.galleryCoverArtUrl = filepath;
          fields.galleryCoverArtFileName = fileName;
        }
        // Check for old file and delete it
        if (galleryOldFile) {
          // This is hacky but whatever it will always work
          const validUrl = fields.galleryCoverArtUrl;
          const deleteOldFile = validUrl.substring(
            0,
            validUrl.lastIndexOf("/") + 1
          );
          // Detele the old cover art file
          try {
            fs.unlinkSync(`${deleteOldFile}${galleryOldFile}`);
          } catch (error) {
            console.log(error);
            return res.json({
              error: true,
              status: 500,
              message: "File Delete Error!",
            });
          }
          // Get galleryName then update gallery
          const gallery = await Gallery.findOneAndUpdate(
            { galleryName: fields.galleryOldName },
            {
              $set: {
                galleryName: fields.galleryName,
                galleryCoverArtUrl: fields.galleryCoverArtUrl,
                galleryCoverArtFileName: fields.galleryCoverArtFileName,
              },
            },
            { new: true }
          );
          if (!gallery) {
            return res.json({
              error: true,
              status: 404,
              message: "Gallery Not Found",
            });
          } else {
            gallery.save();
            return res.json({
              error: false,
              status: 200,
              message: "Gallery Updated",
            });
          }
        }
      } catch (error) {
        // Catch Formidable errors
        return res.json({
          error: true,
          status: 400,
          message: "Failed to edit gallery! Formidable error.",
        });
      }
    });
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error",
    });
  }
};

// Get all gallery items from gallery
exports.getGalleryItems = async (req, res) => {
  try {
    const { galleryName } = req.params.name;
    const gallery = await Gallery.findOne({ galleryName });
    if (!gallery) {
      return res.json({
        error: true,
        status: 404,
        message: "Gallery Not Found!",
      });
    } else {
      return res.json({
        error: false,
        status: 200,
        message: "Gallery Items Found!",
        gallery: gallery.galleryItems,
      });
    }
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error",
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
        const result = itemSchema.validate(fields);
        if (result.error) {
          return res.json({
            error: true,
            status: 400,
            message: result.error.message,
          });
        }
        // Check if the folder exists just in case
        const formatName = fields.galleryName
          .replace(/\s+/g, "-")
          .toLowerCase();
        const galleryFolder = `${uploadUrl}/${formatName}`;
        if (!fs.existsSync(galleryFolder)) {
          return res.json({
            error: true,
            status: 400,
            message: "Gallery folder does not exist!",
          });
        }
        // Save cover art file to storage
        const file = files.files;
        // Check if only one file was uploaded from Formidable
        if (!file) {
          return res.json({
            error: true,
            status: 400,
            message: "Please upload a file!",
          });
        } else {
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
            const originalFileName = file.originalname;
            const fileExtension = path.extname(originalFileName);
            const fileName = `${date.getTime()}--${originalFileName}${fileExtension}`;
            const filepath = `${galleryFolder}/${date}-${fileName}`;
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
            // Add filepath to result value
            fields.galleryItemUrl = filepath;
            // Add fileName to result value
            fields.galleryItemFileName = fileName;
            // Validate schema after all fields are updated
            const result = itemSchema.validate(fields);
            if (result.error) {
              console.log(fields);
              return res.json({
                error: true,
                status: 400,
                message: result.error.message,
              });
            }
          }
        }
        // Get galleryName then update gallery
        const gallery = await Gallery.findOne({
          galleryName: fields.galleryName,
        });
        // Check if gallery item exists, if not create it
        const checkItems = gallery.galleryItems;
        if (checkItems.length > 0) {
          const item = checkItems.find((item) => item.title === fields.title);
          if (item) {
            return res.json({
              error: true,
              status: 400,
              message: "Gallery item already exists!",
            });
          } else {
            // Add item to gallery if no duplicate item exists
            const item = new GalleryItem({
              title: fields.title,
              description: fields.description,
              galleryItemUrl: fields.galleryItemUrl,
              galleryItemFileName: fields.galleryItemFileName,
              gallery: {
                name: fields.galleryName,
              },
            });
            await item.save();

            // Get gallery name then update gallery with galleryItem
            const gallery = await Gallery.findOneAndUpdate(
              { galleryName: fields.galleryName },
              {
                $push: {
                  galleryItems: fields,
                },
              },
              { new: true }
            );
            if (!gallery) {
              return res.json({
                error: true,
                status: 404,
                message: "Gallery Not Found!",
              });
            } else {
              await gallery.save();
              return res.json({
                error: false,
                status: 200,
                message: "Gallery Item Added!",
              });
            }
          }
        }
        // Return success
        return res.json({
          error: false,
          status: 200,
          message: "Item added successfully!",
        });
      } catch (error) {
        return res.json({
          error: true,
          status: 500,
          message: "Formidable error!",
        });
      }
    });
  } catch (error) {
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error!",
    });
  }
};

// Delete item from gallery
exports.deleteItemFromGallery = async (req, res) => {
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
    // Delete gallery item from gallery
    await Gallery.findOneAndUpdate(
      { galleryName: req.params.name },
      { $pull: { file: { file: req.params.file } } },
      { new: true }
    );
    // Return success
    return res.json({
      error: false,
      status: 200,
      message: "Item deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: true,
      status: 500,
      message: "Internal server error",
    });
  }
};

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
