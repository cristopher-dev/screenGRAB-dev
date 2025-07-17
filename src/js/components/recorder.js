import {
  NOTIFICATION_CONFIG,
  RECORDING_OPTIONS,
  MEDIA_RECORDER_CONFIG,
  AUDIO_CONFIG,
  VIDEO_CONFIG,
} from "../utils/constants";
import {
  RecorderError,
  ERROR_TYPES,
  handleRecorderError,
} from "../utils/errorHandler";

export default class ScreenRecorder {
  constructor() {
    if (ScreenRecorder.instance) {
      throw new Error("Use ScreenRecorder.getInstance() instead of new");
    }

    this.elements = this.initializeElements();
    this.state = {
      mime: null,
      mediaRecorder: null,
      isRecording: false,
      isPause: false,
      filename: null,
      selectedOption: null,
      screenStream: null,
      microphoneStream: null,
      audioContext: null,
    };
    this.toastTimeout = null;
  }

  static getInstance() {
    if (!ScreenRecorder.instance) {
      ScreenRecorder.instance = new ScreenRecorder();
    }
    return ScreenRecorder.instance;
  }

  initializeElements() {
    return {
      start: document.getElementById("start"),
      stop: document.getElementById("stop"),
      pauseAndResume: document.getElementById("pauseAndResume"),
      preview: document.querySelector("#preview"),
      download: document.querySelector("#download"),
      recordAgain: document.querySelector("#recordAgain"),
      recordingName: document.querySelector("#filename"),
      mimeChoiceWrapper: document.querySelector(".sh__choice"),
      videoWrapper: document.querySelector(".sh__video--wrp"),
      videoOpacitySheet: document.querySelector(".sh__video--sheet"),
      dropdownToggle: document.querySelector(".sh__dropdown--btn"),
      dropdownList: document.querySelector(".sh__dropdown__list"),
      dropdownDefaultOption: document.querySelector(
        ".sh__dropdown--defaultOption"
      ),
      dropdownOptions: document.querySelectorAll(".sh__dropdown__list--item"),
      dropdownChevron: document.querySelector(".sh__dropdown--icon.chevron"),
      headerText: document.querySelector(".sh__header"),
      toast: document.getElementById("toast"),
    };
  }

  toggleDropdown() {
    this.elements.dropdownToggle.classList.toggle("toggled");
    this.elements.dropdownChevron.classList.toggle("toggled");
    this.elements.dropdownList.classList.toggle("open");
  }

  getSelectedValue(el) {
    const selectedElement = el;
    const selectedAttrValue = selectedElement.getAttribute("data-value");

    if (selectedAttrValue !== "") {
      this.elements.start.classList.add("visible");
    } else {
      this.elements.start.classList.remove("visible");
    }

    this.elements.dropdownDefaultOption.textContent = selectedElement.innerText;
    this.state.mime = selectedAttrValue;
    return selectedAttrValue;
  }

  getRandomString(length) {
    let randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }

  getNotificationConfig(actionType) {
    return NOTIFICATION_CONFIG[actionType] || { text: "", variant: "active" };
  }

  appendStatusNotification(actionType) {
    // Clear any existing toast timeouts
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    const { text: notificationText, variant } =
      this.getNotificationConfig(actionType);

    // Set toast variant based on action type
    this.elements.toast.className = ""; // Reset classes
    this.elements.toast.classList.add(variant);

    document.getElementById("desc").innerHTML = notificationText;

    // Handle close button click
    const closeBtn = this.elements.toast.querySelector(".toast-close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.elements.toast.classList.add("closing");
        setTimeout(() => {
          this.elements.toast.classList.remove("active", "closing");
        }, 500); // Match the animation duration
      };
    }

    // Auto-dismiss timer
    this.toastTimeout = setTimeout(() => {
      this.elements.toast.classList.remove("active");
    }, MEDIA_RECORDER_CONFIG.TOAST_TIMEOUT);
  }

  createRecorder(stream) {
    // the stream data is stored in this array
    let recordedChunks = [];
    this.state.mediaRecorder = new MediaRecorder(stream);

    this.state.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    this.state.mediaRecorder.onstop = () => {
      if (this.state.isRecording) this.stopRecording();
      this.bakeVideo(recordedChunks);
      recordedChunks = [];
    };

    // When stopping 'Tab Record' on Chrome browser by clicking 'Stop sharing' button, this gets fired instead of onstop event.
    this.state.mediaRecorder.stream.oninactive = () => {
      this.stopRecording();
    };

    this.state.mediaRecorder.start(MEDIA_RECORDER_CONFIG.CHUNK_SIZE);
    return this.state.mediaRecorder;
  }

  async recordScreenAndMicrophone() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: VIDEO_CONFIG,
        audio: AUDIO_CONFIG,
      });

      const microphoneStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Check if we have audio tracks to work with
      const screenAudioTracks = screenStream.getAudioTracks();
      const microphoneAudioTracks = microphoneStream.getAudioTracks();

      // If neither stream has audio tracks, just return the screen stream
      if (screenAudioTracks.length === 0 && microphoneAudioTracks.length === 0) {
        return screenStream;
      }

      // Create an AudioContext and a MediaStreamAudioDestinationNode
      this.state.audioContext = new AudioContext();
      const destination = this.state.audioContext.createMediaStreamDestination();

      // Connect screen audio if available
      if (screenAudioTracks.length > 0) {
        const screenSource = this.state.audioContext.createMediaStreamSource(screenStream);
        screenSource.connect(destination);
      }

      // Connect microphone audio if available
      if (microphoneAudioTracks.length > 0) {
        const microphoneSource = this.state.audioContext.createMediaStreamSource(microphoneStream);
        microphoneSource.connect(destination);
      }

      // Replace the screen stream's audio track with the destination's track
      const tracks = [
        ...screenStream.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ];

      return new MediaStream(tracks);
    } catch (error) {
      // Clean up AudioContext if it was created
      if (this.state.audioContext) {
        this.state.audioContext.close();
        this.state.audioContext = null;
      }
      throw error;
    }
  }

  async recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
      audio: AUDIO_CONFIG,
      video: VIDEO_CONFIG,
    });
  }

  bakeVideo(recordedChunks) {
    const blob = new Blob(recordedChunks, {
      type: "video/" + this.state.mime,
    });
    let savedName;
    if (this.state.filename == null || this.state.filename == "")
      savedName = this.getRandomString(15);
    else savedName = this.state.filename;
    this.elements.download.href = URL.createObjectURL(blob);
    this.elements.download.download = `${savedName}.mp4`;
    this.elements.videoOpacitySheet.remove();
    this.elements.preview.autoplay = true;
    this.elements.preview.controls = true;
    this.elements.preview.muted = false;
    this.elements.preview.src = URL.createObjectURL(blob);
    URL.revokeObjectURL(blob); // clear from memory
  }

  async startRecording() {
    try {
      let stream;
      if (this.state.selectedOption === RECORDING_OPTIONS.SCREEN) {
        stream = await this.recordScreen();
      } else if (this.state.selectedOption === RECORDING_OPTIONS.SCREEN_MIC) {
        stream = await this.recordScreenAndMicrophone();
      } else {
        // Handle the case where no valid option is selected
        return;
      }

      let mimeType = "video/" + this.state.mime;

      this.state.filename = document.getElementById("filename").value;
      this.state.isRecording = true;
      this.state.mediaRecorder = this.createRecorder(stream, mimeType);
      this.elements.preview.srcObject = stream;
      this.elements.preview.captureStream =
        this.elements.preview.captureStream ||
        this.elements.preview.mozCaptureStream;
      this.elements.mimeChoiceWrapper.classList.add("hide");
      this.elements.headerText.classList.add("is-recording");
      this.elements.preview.classList.add("visible");
      this.elements.pauseAndResume.classList.add("visible");
      this.elements.stop.classList.add("visible");
      this.appendStatusNotification("start");
    } catch (error) {
      const recorderError = new RecorderError(
        error.message,
        error.name === "NotAllowedError"
          ? ERROR_TYPES.MEDIA_ACCESS_DENIED
          : ERROR_TYPES.RECORDING_FAILED
      );
      handleRecorderError(recorderError);
    }
  }

  pauseRecording() {
    this.state.mediaRecorder.pause();
    this.state.isPause = true;
    this.appendStatusNotification("pause");
    this.elements.pauseAndResume.classList.add("resume");
    this.elements.pauseAndResume.classList.remove("pause");
  }

  resumeRecording() {
    this.state.mediaRecorder.resume();
    this.state.isPause = false;
    this.appendStatusNotification("resume");
    this.elements.pauseAndResume.classList.remove("resume");
    this.elements.pauseAndResume.classList.add("pause");
  }

  stopRecording() {
    // Stop the tracks of the MediaRecorder's stream
    this.state.mediaRecorder.stream
      .getTracks()
      .forEach((track) => track.stop());

    // If you have separate streams for the screen and microphone, stop those as well
    if (this.state.screenStream) {
      this.state.screenStream.getTracks().forEach((track) => track.stop());
    }
    if (this.state.microphoneStream) {
      this.state.microphoneStream.getTracks().forEach((track) => track.stop());
    }

    // Close AudioContext if it exists
    if (this.state.audioContext) {
      this.state.audioContext.close();
      this.state.audioContext = null;
    }

    const isInactive = this.state.mediaRecorder.state === "inactive"; // when stopping record with `Stop Sharing` button, isInactive is true

    this.state.isRecording = false;
    if (!isInactive) this.state.mediaRecorder.stop(); // prevents program from stopping the mediaRecorder twice, causing app to crash on chrome browser
    this.elements.preview.srcObject = null;
    this.elements.headerText.classList.remove("is-recording");
    this.elements.headerText.classList.add("is-reviewing");
    this.elements.stop.classList.remove("visible");
    this.elements.pauseAndResume.classList.remove("visible");
    this.elements.recordingName.classList.remove("visible");
    this.elements.download.classList.add("visible");
    this.elements.recordAgain.classList.add("visible");
    this.appendStatusNotification("stop");
  }

  resetToInitialState() {
    // Reset state
    this.state.isRecording = false;
    this.state.isPause = false;
    this.state.mediaRecorder = null;
    this.state.screenStream = null;
    this.state.microphoneStream = null;
    this.state.filename = null;

    // Close AudioContext if it exists
    if (this.state.audioContext) {
      this.state.audioContext.close();
      this.state.audioContext = null;
    }

    // Reset UI elements
    this.elements.preview.srcObject = null;
    this.elements.preview.src = "";
    this.elements.preview.classList.remove("visible");
    this.elements.headerText.classList.remove("is-recording", "is-reviewing");
    this.elements.mimeChoiceWrapper.classList.remove("hide");
    this.elements.download.classList.remove("visible");
    this.elements.recordAgain.classList.remove("visible");
    this.elements.recordingName.classList.remove("visible");
    this.elements.stop.classList.remove("visible");
    this.elements.pauseAndResume.classList.remove("visible", "resume", "pause");

    // Clear download link
    this.elements.download.href = "";
    this.elements.download.download = "";

    // Clear filename input
    this.elements.recordingName.value = "";

    // Reset dropdown selection
    this.state.selectedOption = null;
    this.elements.dropdownDefaultOption.textContent = "¿Qué quieres grabar?";
  }

  init() {
    this.elements.dropdownToggle.addEventListener("click", () => {
      this.toggleDropdown();
    });

    document.addEventListener("click", (e) => {
      if (this.elements.dropdownToggle.classList.contains("toggled")) {
        if (!e.target.closest(".sh__dropdown--btn")) {
          this.toggleDropdown();
        }
      }
    });

    this.elements.dropdownOptions.forEach((el) => {
      el.addEventListener("click", () => {
        this.elements.recordingName.classList.add("visible");
        this.state.selectedOption = this.getSelectedValue(el); // Store the selected value
        this.toggleDropdown();
      });
    });

    this.elements.start.addEventListener("click", () => {
      if (!this.state.isRecording) this.startRecording();
    });

    this.elements.pauseAndResume.addEventListener("click", () => {
      if (!this.state.isPause) this.pauseRecording();
      else if (this.state.isPause) this.resumeRecording();
    });

    this.elements.stop.addEventListener("click", () => {
      if (this.state.isRecording) this.stopRecording();
    });

    this.elements.recordAgain.addEventListener("click", () => {
      this.resetToInitialState();
    });
  }
}
