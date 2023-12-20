const { format } = require("date-fns");
const FileUploader = require("../../../conn/uploader");
const uploader = new FileUploader();
const { v4: uuidv4 } = require("uuid");

const imageotions = {
  use_filename: true,
  unique_filename: true,
  overwrite: false,
  folder: "",
  userId: "",
  alt: "",
  resource_type: "",
};

const AddPersonImage = async (req, res) => {
  try {
    const { images } = req.body;
    const { personId } = req.params;
    // find the person exists
    const personExists = await req.db.findOne("person", {
      id: personId,
    });
    if (!personExists) {
      return res.status(404).json({ error: "Person not found" });
    }
    const user = req.user;
    const newoptions = {
      ...imageotions,
      folder: `persons/${personId}`,
      userId: user.id,
      alt: "person image",
      resource_type: "image",
    };
    const formattedImages = images.map((image) => {
      const public_id = uuidv4();
      return { ...image, public_id };
    });
    uploader.options = newoptions;
    const imageUrls = await uploader.multipleUploadCloudinary(
      formattedImages,
      newoptions
    );
    // save urls to db
    const insertdata = [];
    for (const url of imageUrls) {
      const imageObj = {
        userId: user.id,
        personId: personId,
        imageUrl: url.url,
        timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        isActive: 1,
        publicId: url.public_id,
      };
      insertdata.push(imageObj);
    }
    const response = await req.db.insertMany("imagedata", insertdata);
    if (!response?.success) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    res.status(200).json({ msg: "Images added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const DeletePersonImage = async (req, res) => {};
const GetPersonImages = async (req, res) => {};

// images meta
const AddPersonImageMeta = async (req, res) => {};
const UpdatePersonImageMeta = async (req, res) => {};
const DeletePersonImageMeta = async (req, res) => {};
const GetPersonImageMeta = async (req, res) => {};

module.exports = {
  AddPersonImage,
  DeletePersonImage,
  GetPersonImages,
  AddPersonImageMeta,
  UpdatePersonImageMeta,
  DeletePersonImageMeta,
  GetPersonImageMeta,
};
