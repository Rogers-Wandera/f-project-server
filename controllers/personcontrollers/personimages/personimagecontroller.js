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

const DeletePersonImage = async (req, res) => {
  try {
    const { personId } = req.params;
    const { imageId } = req.query;
    // find the person exists
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res.status(400).json({ error: "Person not found" });
    }
    // find image exists
    const imageExists = await req.db.findByConditions("imagedata", {
      id: imageId,
      personId,
    });
    if (imageExists.length <= 0) {
      return res.status(400).json({ error: "Image not found" });
    }
    const results = await req.db.deleteOne("imagedata", { id: imageId });
    if (!results) {
      return res.status(500).json({ error: "Something went wrong" });
    } else {
      // delete image from the cloud
      const { publicId } = imageExists[0];
      const results = await uploader.deleteCloudinaryImage(publicId);
      console.log(results);
    }
    res.status(200).json({ msg: "Image deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const GetPersonImages = async (req, res) => {
  try {
    const { personId } = req.params;
    // find the person exists
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res.status(400).json({ error: "Person not found" });
    }
    const images = await req.db.findByConditions("imagedata", {
      personId,
      isActive: 1,
    });
    res.status(200).json({ images });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// images meta
const AddPersonImageMeta = async (req, res) => {
  try {
    const { personId } = req.params;
    const { imageId } = req.query;
    const { metaName, metaDesc } = req.body;
    // find the person exists
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res.status(400).json({ error: "Person not found" });
    }
    // find image exists
    const imageExists = await req.db.findByConditions("imagedata", {
      id: imageId,
      personId,
    });
    if (imageExists.length <= 0) {
      return res.status(400).json({ error: "Image not found" });
    }
    // find meta exists
    const metaExists = await req.db.findByConditions("imagemetadata", {
      imageId,
      metaName,
    });
    if (metaExists.length > 0) {
      return res
        .status(400)
        .json({ error: "Meta with that name already exists" });
    }
    // insert data
    const data = {
      metaName,
      metaDesc,
      imageId,
      isActive: 1,
      createdBy: req.user.id,
      creationDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    const results = await req.db.insertOne("imagemetadata", data);
    if (!results?.success) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    res.status(200).json({ msg: "Meta added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const UpdatePersonImageMeta = async (req, res) => {
  try {
    const { personId } = req.params;
    const { imageId, metaId } = req.query;
    const { metaName, metaDesc } = req.body;
    // find the person exists
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res.status(400).json({ error: "Person not found" });
    }
    // find image exists
    const imageExists = await req.db.findByConditions("imagedata", {
      id: imageId,
      personId,
    });
    if (imageExists.length <= 0) {
      return res.status(400).json({ error: "Image not found" });
    }
    // find meta exists
    const metaExists = await req.db.findByConditions("imagemetadata", {
      imageId,
      id: metaId,
    });
    if (metaExists.length <= 0) {
      return res.status(400).json({ error: "Meta does not exist" });
    }
    const data = {
      metaName,
      metaDesc,
      modifiedBy: req.user.id,
      modificationDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    const results = await req.db.updateOne(
      "imagemetadata",
      { id: metaId },
      data
    );
    if (!results) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    res.status(200).json({ msg: "Meta updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const DeletePersonImageMeta = async (req, res) => {
  try {
    const { personId } = req.params;
    const { imageId, metaId } = req.query;
    // find the person exists
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res.status(400).json({ error: "Person not found" });
    }
    // find image exists
    const imageExists = await req.db.findByConditions("imagedata", {
      id: imageId,
      personId,
    });
    if (imageExists.length <= 0) {
      return res.status(400).json({ error: "Image not found" });
    }
    // find meta exists
    const metaExists = await req.db.findByConditions("imagemetadata", {
      imageId,
      id: metaId,
      isActive: 1,
    });
    if (metaExists.length <= 0) {
      return res.status(400).json({ error: "Meta does not exist" });
    }
    const response = await req.db.softDelete("imagemetadata", {
      id: metaId,
    });
    if (!response) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    res.status(200).json({ msg: "Meta deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const GetPersonImageMeta = async (req, res) => {
  try {
    const { personId } = req.params;
    const { imageId } = req.query;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      return res.status(400).json({ error: "Person not found" });
    }
    // find image exists
    const imageExists = await req.db.findByConditions("imagedata", {
      id: imageId,
      personId,
    });
    if (imageExists.length <= 0) {
      return res.status(400).json({ error: "Image not found" });
    }
    const meta = await req.db.findByConditions("imagemetadata", {
      imageId,
      isActive: 1,
    });
    res.status(200).json({ meta });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getImagesInFolder = async (req, res) => {
  try {
    const data = await uploader.getImagesInFolder("persons");
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  AddPersonImage,
  DeletePersonImage,
  GetPersonImages,
  AddPersonImageMeta,
  UpdatePersonImageMeta,
  DeletePersonImageMeta,
  GetPersonImageMeta,
  getImagesInFolder,
};
