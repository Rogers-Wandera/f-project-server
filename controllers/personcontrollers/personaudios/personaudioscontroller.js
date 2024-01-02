const Recorder = require("../../../utils/recording");
const fs = require("fs");
const FileUploader = require("../../../conn/uploader");
const uploader = new FileUploader();
const { format } = require("date-fns");

const imageotions = {
  use_filename: true,
  unique_filename: true,
  overwrite: false,
  folder: "",
  userId: "",
  alt: "",
  resource_type: "",
};
const recorders = {};
const getRecorderInstances = (personId) => {
  if (!recorders[personId]) {
    recorders[personId] = new Recorder(personId);
  }
  return recorders[personId];
};

const RecordPersonAudio = async (req, res) => {
  try {
    const { personId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      res.status(400).json({ msg: "No person found" });
      return;
    }
    const recordobj = getRecorderInstances(personId);
    recordobj.start();
    res.status(200).json({ msg: "Recording has started" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const PausePersonAudio = async (req, res) => {
  try {
    const { personId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      res.status(400).json({ msg: "No person found" });
      return;
    }
    const recordobj = getRecorderInstances(personId);
    recordobj.pause();
    res.status(200).json({ msg: "Recording has paused" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const ResumePersonAudio = async (req, res) => {
  try {
    const { personId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      res.status(400).json({ msg: "No person found" });
      return;
    }
    const recordobj = getRecorderInstances(personId);
    recordobj.resume();
    res.status(200).json({ msg: "Recording has resumed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const StopPersonAudio = async (req, res) => {
  try {
    const { personId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      res.status(400).json({ msg: "No person found" });
      return;
    }
    const recordobj = getRecorderInstances(personId);
    recordobj.timeoutflag = true;
    recordobj.stop();
    res.status(200).json({ msg: "Recording has stopped" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetPersonAudio = async (req, res) => {
  try {
    const { personId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      res.status(400).json({ msg: "No person found" });
      return;
    }
    const recordobj = getRecorderInstances(personId);
    const audiodata = recordobj.retrieve();
    console.log(audiodata);
    const { path, flags } = audiodata;
    const defaultEncoding = audiodata._readableState.defaultEncoding;
    const audio = { path, flags, defaultEncoding };
    res.status(200).json({ audio });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UploadPersonAudio = async (req, res) => {
  try {
    const { audio, recorded } = req.body;
    const { path } = audio;
    const { personId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      res.status(400).json({ msg: "No person found" });
      return;
    }
    if (!fs.existsSync(path)) {
      res.status(400).json({ msg: "File not found" });
      return;
    }
    const user = req.user;
    const newoptions = {
      ...imageotions,
      folder: `personsaudio/${personId}`,
      userId: user.id,
      alt: "person audio",
      resource_type: "raw",
    };
    const response = await uploader.singleUploadCloudinary(audio, newoptions);
    if (!response?.url) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    const audioObject = {
      createdBy: req.user.id,
      personId: personId,
      publicId: response.public_id,
      audioUrl: response.url,
      creationDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      isActive: 1,
    };
    // save record in database
    const results = await req.db.insertOne("personaudio", audioObject);
    if (!results?.success) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    if (recorded == true) {
      const recordobj = getRecorderInstances(personId);
      // delete the file from the recordings
      recordobj.deleterecord();
    }
    res.status(200).json({ msg: "File uploaded successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const CancelUpload = async (req, res) => {
  try {
    const { personId } = req.params;
    const personExists = await req.db.findByConditions("person", {
      id: personId,
    });
    if (personExists.length <= 0) {
      res.status(400).json({ msg: "No person found" });
      return;
    }
    const recordobj = getRecorderInstances(personId);
    // delete the file from the recordings
    const response = recordobj.deleterecord();
    if (!response) {
      res.status(500).json({ msg: "Something went wrong" });
    }
    res.status(200).json({ msg: "Recording has been deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UploadAudioFromLocal = async (req, res) => {
  try {
    const audioToUpload = await uploader.handleFileUpload(req, res);
    if (!audioToUpload?.audio) {
      return res
        .status(400)
        .json({ error: "No audio uploaded please select an audio file" });
    }
    const audiofiles = audioToUpload.audio;
    const { path } = audiofiles[0];
    const audio = {
      path: path,
      defaultEncoding: audioToUpload.audio[0].encoding,
    };
    res.status(200).json({ audio });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  RecordPersonAudio,
  GetPersonAudio,
  PausePersonAudio,
  ResumePersonAudio,
  StopPersonAudio,
  UploadPersonAudio,
  CancelUpload,
  UploadAudioFromLocal,
};
