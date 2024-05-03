const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");

class FileUploader {
  constructor() {
    this.filename = "";
    this.options = {};
    this.filelimit = 40;
    this.filesize = 5;
    this.storage = multer.diskStorage({
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });
    this.upload = (filesize = 5) => {
      this.filesize = filesize;
      return multer({
        storage: this.storage,
        limits: {
          fileSize: 1024 * 1024 * this.filesize,
          files: this.filelimit,
        },
        fileFilter: (req, file, cb) => {
          if (
            !file.originalname.match(
              /\.(jpg|jpeg|png|gif|mp4|mov|mp3|wav|avi|ogg|mkv|waptt)$/i
            )
          ) {
            return cb(new Error("Invalid File type"), false);
          } else {
            cb(null, true);
          }
        },
      }).fields([
        { name: "image", maxCount: this.filelimit },
        { name: "video", maxCount: 1 },
        { name: "pdf", maxCount: 1 },
        { name: "audio", maxCount: 1 },
      ]);
    };
    this.cloudinaryConfig = {
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
      secure: true,
    };
    cloudinary.config(this.cloudinaryConfig);
  }

  async uploadToCloudinary(filepath) {
    try {
      const upload = cloudinary.uploader.upload(filepath, this.options);
      return upload;
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadFile(req, res, filesize) {
    return new Promise((resolve, reject) => {
      const uploader = this.upload(filesize);
      uploader(req, res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
              reject(
                `Unexpected Field: ${err.field} Expected fields are: image, video, pdf, audio`
              );
            } else if (err.code === "LIMIT_FILE_SIZE") {
              reject(
                `File size is too large provide file not more than ${filesize} mb`
              );
            } else if (err.code === "LIMIT_FILE_COUNT") {
              reject("Maximum number of files exceeded");
            }
          }
          reject(err);
        } else {
          if (!req.files || req.files.length === 0) {
            reject(new Error("File not found"));
          }
          resolve(req.files);
        }
      });
    });
  }
  async handleFileUpload(req, res, filesize = 5) {
    try {
      const files = await this.uploadFile(req, res, filesize);
      return files;
    } catch (error) {
      throw new Error(error);
    }
  }
  async singleUploadCloudinary(file, options = {}) {
    try {
      options["public_id"] = "";
      if (!file?.path) {
        throw new Error("No Path Found on the file");
      }
      if (file?.public_id) {
        options["public_id"] = file.public_id;
      } else {
        delete options["public_id"];
      }
      this.options = options;
      const upload = await this.uploadToCloudinary(file.path);
      const { secure_url, public_id } = upload;
      return { url: secure_url, public_id: public_id };
    } catch (error) {
      throw new Error(error);
    }
  }

  async multipleUploadCloudinary(files, options = {}) {
    try {
      const urls = [];
      for (const file of files) {
        if (file?.path) {
          const upload = await this.singleUploadCloudinary(file, options);
          urls.push(upload);
        }
      }
      return urls;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getImagesInFolder(folderPath) {
    try {
      const result = await cloudinary.api.resources({
        type: "upload",
        prefix: folderPath,
      });
      const images = result.resources.map((resource) => ({
        public_id: resource.public_id,
        url: resource.secure_url,
      }));

      return images;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteCloudinaryImage(public_id, resource_type = "upload") {
    try {
      const result = await cloudinary.uploader.destroy(public_id, {
        resource_type: resource_type,
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  checkWavFormat(filepath) {
    const extension = path.extname(filepath).toLowerCase();
    return extension === ".wav";
  }
}

module.exports = FileUploader;
