const UserModel = require("../../models/users");
const ImageUploader = require("../../conn/uploader");
const Userprofileimages = require("../../models/userprofileimagesmodel");

const imageotions = {
  use_filename: true,
  unique_filename: true,
  overwrite: false,
  folder: "user_profiles",
  userId: "",
  alt: "",
  resource_type: "",
};

const userdetails = async (req, res) => {
  try {
    const userdetails = await req.db.FindSelectiveOne(
      "users",
      {
        id: req.user.id,
      },
      ["firstname", "lastname", "isLocked", "verified"]
    );
    res.status(200).json(userdetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const userobj = new UserModel(req.db);
    userobj.page = parseInt(start);
    userobj.limit = parseInt(size);
    userobj.filters = JSON.parse(filters);
    userobj.globalFilter = globalFilter;
    userobj.sortBy = JSON.parse(sorting);
    const data = await userobj.ViewUsers();
    let formatted = { page: 0, totalDocs: 0, totalPages: 0, docs: [] };
    if (data.totalDocs > 0) {
      formatted.docs = data.docs.map((item) => userobj.userData(item));
      formatted.page = data.page;
      formatted.totalDocs = data.totalDocs;
      formatted.totalPages = data.totalPages;
    }
    res.status(200).json(formatted);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userobj = new UserModel(req.db);
    userobj.Id = userId;
    const data = await userobj.__delete();
    if (data == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "user deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetSingleUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const userobj = new UserModel(req.db);
    userobj.Id = userId;
    const data = await userobj.FindUser(true);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const AddProfileImage = async (req, res) => {
  try {
    const uploader = new ImageUploader();
    const userprofileimages = new Userprofileimages(req.db);
    const { userId } = req.params;
    const users = new UserModel(req.db);
    users.Id = userId;
    const user = await users.FindUser();
    const imagesToUpload = await uploader.handleFileUpload(req, res, 10);
    if (!imagesToUpload?.image) {
      return res
        .status(400)
        .json({ error: "No image uploaded please select an image" });
    }
    userprofileimages.userId = user.id;
    const imageexists = await userprofileimages.findImageExists();
    const images = imagesToUpload.image;
    imageotions.userId = user.id;
    imageotions.resource_type = "image";
    imageotions.alt = user.firstname + " " + user.lastname;
    if (Object.keys(imageexists).length > 0) {
      await uploader.deleteCloudinaryImage(imageexists.public_id, "image");
    }
    const response = await uploader.singleUploadCloudinary(
      images[0],
      imageotions
    );
    userprofileimages.image = response.url;
    userprofileimages.public_id = response.public_id;
    userprofileimages.CreatedBy = user.id;
    const results = await userprofileimages.AddUserprofileimages();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Userprofileimages added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  userdetails,
  getUsers,
  deleteUser,
  GetSingleUserDetails,
  AddProfileImage,
};
