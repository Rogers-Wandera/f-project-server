const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const ProgressBar = require("progress");
const stream = require("stream");

class FileUploader {
  constructor() {
    this.filename = "";
    this.options = {};
    this.storage = multer.memoryStorage();
    this.upload = multer({
      storage: this.storage,
      limits: {
        fileSize: 1024 * 1024 * 30,
        files: 5,
      },
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|mov|avi|mkv)$/i)
        ) {
          return cb(new Error("Invalid File type"), false);
        } else {
          cb(null, true);
        }
      },
    });
    this.cloudinaryConfig = {
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
      secure: true,
    };
    cloudinary.config(this.cloudinaryConfig);
  }

  async uploadToCloudinary(file, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      const uploadstream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      const readStream = new stream.Readable();
      readStream.push(file.buffer);
      readStream.push(null);

      readStream.pipe(uploadstream).on("data", (chunk) => {
        onProgress(chunk.length);
      });
    });
  }

  async handleFileUpload(req, res) {
    try {
      const totalSize = req.headers["content-length"];
      const multerUpload = this.upload.array(this.filename, 5);
      const bar = new ProgressBar("Uploading [:bar] :rate/bps :percent :etas", {
        total: parseInt(totalSize, 10),
        width: 30,
      });

      req.on("data", (chunk) => {
        bar.tick(chunk.length);
        // console.log(`Progress: ${bar.curr}%`);
      });
      await new Promise((resolve, reject) => {
        multerUpload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            reject({ error: "File upload error check the filename" });
          } else if (err) {
            reject({ error: err.message });
          }

          resolve();
        });
      });
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file provided" });
      }
      const filesToUpload = req.files.filter((file) => {
        const validFileName = file.originalname.match(
          /^[\w-]+\.(jpg|jpeg|png|gif|mp4|mov|avi|mkv)$/i
        );
        return validFileName;
      });
      return filesToUpload;
    } catch (error) {
      return { error: error.message };
    }
  }

  async singleUploadCloudinary(file) {
    try {
      const bar = new ProgressBar("Uploading [:bar] :rate/bps :percent :etas", {
        total: parseInt(file.size, 10),
        width: 30,
      });
      const upload = await this.uploadToCloudinary(file, (chunksize) => {
        bar.tick(chunksize);
      });
      const { secure_url } = upload;
      return { url: secure_url };
    } catch (error) {
      return { error: error.message };
    }
  }

  async multipleUploadCloudinary(files) {
    try {
      const upload = files.map(async (file) => {
        const bar = new ProgressBar(
          "Uploading [:bar] :rate/bps :percent :etas",
          {
            total: parseInt(file.size, 10),
            width: 30,
          }
        );
        const uploader = await this.uploadToCloudinary(file, (chunksize) => {
          bar.tick(chunksize);
        });
        const { secure_url } = uploader;
        return { url: secure_url };
      });
      const result = await Promise.allSettled(upload);
      const formatted = result.map((res) => {
        return {
          url: res.value.url,
          status: res.status,
          reason: res.reason,
        };
      });
      return formatted;
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = FileUploader;
