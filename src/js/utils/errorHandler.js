// Error handling utilities for the screen recorder

export class RecorderError extends Error {
  constructor(message, type) {
    super(message);
    this.name = "RecorderError";
    this.type = type;
  }
}

export const ERROR_TYPES = {
  MEDIA_ACCESS_DENIED: "media_access_denied",
  MEDIA_NOT_SUPPORTED: "media_not_supported",
  RECORDING_FAILED: "recording_failed",
  INITIALIZATION_FAILED: "initialization_failed",
};

export const ERROR_MESSAGES = {
  [ERROR_TYPES.MEDIA_ACCESS_DENIED]:
    "Access to screen recording was denied. Please allow permissions and try again.",
  [ERROR_TYPES.MEDIA_NOT_SUPPORTED]:
    "Screen recording is not supported in this browser.",
  [ERROR_TYPES.RECORDING_FAILED]:
    "Recording failed unexpectedly. Please try again.",
  [ERROR_TYPES.INITIALIZATION_FAILED]: "Failed to initialize the recorder.",
};

export function handleRecorderError(error) {
  console.error("Recorder Error:", error);

  // Show user-friendly error message
  const toast = document.getElementById("toast");
  const desc = document.getElementById("desc");

  if (toast && desc) {
    let message =
      ERROR_MESSAGES[error.type] ||
      error.message ||
      "An unexpected error occurred.";

    toast.className = "error";
    desc.innerHTML = message;

    setTimeout(() => {
      toast.classList.remove("error");
    }, 5000);
  }
}
