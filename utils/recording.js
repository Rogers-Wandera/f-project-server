const recorder = require("node-record-lpcm16");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

class Recorder {
  /**
   * Constructor for the Recorder class.
   * @param {string} personId - Unique identifier for the person associated with the recording.
   * @param {function} onRecordComplete - Callback function to execute when recording is complete.
   */
  constructor(personId, onRecordComplete) {
    this.personId = personId;
    this.filepath = path.join(__dirname, "..", "recordings");
    this.recordingStream = null;
    this.filestream = null;
    this.timeoutflag = false;
    this.onRecordComplete = onRecordComplete || (() => {});
    this.audioLength = 0;
    if (!fs.existsSync(this.filepath)) {
      fs.mkdirSync(this.filepath, { recursive: true });
    }
  }

  /**
   * Starts the audio recording process.
   * Continuously updates the audio length and stops recording when it reaches one minute.
   */
  async start() {
    try {
      if (this.filestream) {
        this.filestream.close();
      }
      this.filestream = fs.createWriteStream(
        `recordings/${this.personId}.wav`,
        {
          encoding: "binary",
          flags: "a",
        }
      );
      this.recordingStream = recorder
        .record({
          sampleRate: 44100,
        })
        .stream()
        .on("error", (err) => {
          // console.log(err);
          // throw new Error(`${err.name}: ${err.message}`);
          console.log(err.message);
        })
        .on("data", (data) => {
          this.audioLength += data.length;
          // Check if the audio length has reached one minute
          if (this.audioLength >= 44100 * 2 * 60 && !this.timeoutflag) {
            this.timeoutflag = true;
            this.stop();
            this.onRecordComplete();
          }
        })
        .pipe(this.filestream);
    } catch (error) {
      console.log(error);
      // throw new Error("Error recording (start) ->: " + error.message);
    }
  }

  /**
   * Stops the audio recording process.
   */
  stop() {
    try {
      if (this.recordingStream) {
        if (this.timeoutflag) {
          this.recordingStream.end();
          if (this.filestream) {
            this.filestream.close();
            this.filestream = null;
          }
          this.recordingStream = null;
        }
      }
    } catch (error) {
      throw new Error("Error recording (stop) ->: " + error.message);
    }
  }

  /**
   * Pauses the audio recording process.
   */
  pause() {
    try {
      if (this.recordingStream) {
        this.recordingStream.pause();
      }
    } catch (error) {
      throw new Error("Error recording (pause) ->: " + error.message);
    }
  }

  /**
   * Resumes the audio recording process.
   * Stops recording if the audio length has reached one minute.
   */
  resume() {
    try {
      if (this.recordingStream) {
        if (this.audioLength >= 44100 * 2 * 60) {
          this.stop();
          return;
        }
        this.recordingStream.resume();
      }
    } catch (error) {
      throw new Error("Error recording (resume) ->: " + error.message);
    }
  }

  /**
   * Retrieves the recorded audio file stream.
   * @returns {fs.ReadStream} - Readable stream for the recorded audio file.
   * @throws {Error} - If the recording file is not found.
   */
  retrieve() {
    try {
      const recordingPath = path.join(this.filepath, `${this.personId}.wav`);
      if (fs.existsSync(recordingPath)) {
        const filestream = fs.createReadStream(recordingPath);
        return filestream;
      } else {
        return { path: "", flags: "", defaultEncoding: "" };
      }
    } catch (error) {
      throw new Error("Error retrieving recording -> " + error.message);
    }
  }

  /**
   * Deletes the recorded audio file.
   * @returns {boolean} - True if the file is successfully deleted.
   * @throws {Error} - If the recording file is not found.
   */
  async deleterecord() {
    try {
      const recordingPath = path.join(this.filepath, `${this.personId}.wav`);
      const deletepath = path.join(__dirname, "..", "deletedrecords");
      if (!fs.existsSync(deletepath)) {
        fs.mkdirSync(deletepath);
      }
      if (fs.existsSync(recordingPath)) {
        const newpath = path.join(deletepath, `${this.personId}-${uuid()}.wav`);
        fs.renameSync(recordingPath, newpath);
        return true;
      } else {
        throw new Error("Recording not found");
      }
    } catch (error) {
      throw new Error("Error deleting recording -> " + error.message);
    }
  }

  deleteconverted() {
    try {
      const recordingPath = path.join(
        __dirname,
        "..",
        "converted",
        `${this.personId}.wav`
      );
      if (fs.existsSync(recordingPath)) {
        fs.unlinkSync(recordingPath);
        return true;
      }
      return false;
    } catch (error) {
      throw new Error("Error deleting recording converted -> " + error.message);
    }
  }
}

module.exports = Recorder;
