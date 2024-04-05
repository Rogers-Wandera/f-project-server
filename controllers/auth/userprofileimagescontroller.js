const Userprofileimages = require("../../models/userprofileimagesmodel");
const ImageUploader = require("../../conn/uploader");

const imageotions = {
  use_filename: true,
  unique_filename: true,
  overwrite: false,
  folder: "",
  userId: "",
  alt: "",
  resource_type: "",
};

const ViewUserprofileimages = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const userprofileimages = new Userprofileimages(req.db);
    userprofileimages.page = parseInt(start);
    userprofileimages.limit = parseInt(size);
    userprofileimages.filters = JSON.parse(filters);
    userprofileimages.globalFilter = globalFilter;
    userprofileimages.sortBy = JSON.parse(sorting);
    const data = await userprofileimages.ViewUserprofileimages();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ViewSingleUserprofileimages = async (req, res) => {
  try {
    const { userprofileimageId } = req.params;
    const userprofileimages = new Userprofileimages(req.db);
    userprofileimages.Id = userprofileimageId;
    const data = await userprofileimages.ViewSingleUserprofileimages();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const AddUserprofileimages = async (req, res) => {
  try {
    const uploader = new ImageUploader();
    const { image, userId } = req.body;
    const userprofileimages = new Userprofileimages(req.db);
    userprofileimages.Image = image;
    userprofileimages.UserId = userId;
    userprofileimages.createdBy = req.user.id;
    const imagesToUpload = await uploader.handleFileUpload(req, res, 10);
    if (!imagesToUpload?.image) {
      return res
        .status(400)
        .json({ error: "No image uploaded please select an image" });
    }
    const images = imagesToUpload.image;
    console.log(images);
    // const results = await userprofileimages.AddUserprofileimages();
    // if (results?.success == false) {
    //   return res.status(400).json({ msg: "something went wrong" });
    // }
    res.status(200).json({ msg: "Userprofileimages added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const UpdateUserprofileimages = async (req, res) => {
  try {
    const { image, userId } = req.body;
    const { userprofileimageId } = req.params;
    const userprofileimages = new Userprofileimages(req.db);
    userprofileimages.Id = userprofileimageId;
    userprofileimages.Image = image;
    userprofileimages.UserId = userId;
    userprofileimages.updatedBy = req.user.id;
    const results = await userprofileimages.UpdateUserprofileimages();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Userprofileimages updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const DeleteUserprofileimages = async (req, res) => {
  try {
    const { userprofileimageId } = req.params;
    const userprofileimages = new Userprofileimages(req.db);
    userprofileimages.Id = userprofileimageId;
    userprofileimages.deletedBy = req.user.id;
    const results = await userprofileimages.DeleteUserprofileimages();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Userprofileimages removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  AddUserprofileimages,
  UpdateUserprofileimages,
  DeleteUserprofileimages,
  ViewUserprofileimages,
  ViewSingleUserprofileimages,
};
