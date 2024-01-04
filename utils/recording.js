const recorder = require("node-record-lpcm16");
const fs = require("fs");
const path = require("path");

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
  start() {
    try {
      this.recordingStream = recorder
        .record({
          sampleRate: 44100,
        })
        .stream()
        .on("error", (err) => {
          throw new Error(`${err.name}: ${err.message}`);
        })
        .on("data", (data) => {
          this.audioLength += data.length;
          // Check if the audio length has reached one minute
          if (this.audioLength >= 44100 * 2 * 60 && !this.timeoutflag) {
            this.timeoutflag = true;
            this.stop();
            this.onRecordComplete();
          }
        });
      const file = fs.createWriteStream(`recordings/${this.personId}.wav`, {
        encoding: "binary",
      });
      this.recordingStream.pipe(file);
    } catch (error) {
      throw new Error("Error recording (start) ->: " + error.message);
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
        throw new Error("Recording not found");
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
  deleterecord() {
    try {
      const recordingPath = path.join(this.filepath, `${this.personId}.wav`);
      if (fs.existsSync(recordingPath)) {
        fs.unlinkSync(recordingPath);
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
