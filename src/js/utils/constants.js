// Recording notification types and configurations
export const NOTIFICATION_TYPES = {
  START: "start",
  STOP: "stop",
  PAUSE: "pause",
  RESUME: "resume",
};

export const NOTIFICATION_CONFIG = {
  [NOTIFICATION_TYPES.START]: { text: "Started Recording", variant: "active" },
  [NOTIFICATION_TYPES.STOP]: { text: "Stopped Recording", variant: "success" },
  [NOTIFICATION_TYPES.PAUSE]: { text: "Paused Recording", variant: "warning" },
  [NOTIFICATION_TYPES.RESUME]: { text: "Resumed Recording", variant: "active" },
};

// Recording options
export const RECORDING_OPTIONS = {
  SCREEN: "screen",
  SCREEN_MIC: "screen-mic",
  SCREEN_CAMERA: "screen-camera",
};

// Theme storage key
export const LOCAL_STORAGE_KEY = "screenREC-color-scheme";

// Media recorder configuration
export const MEDIA_RECORDER_CONFIG = {
  CHUNK_SIZE: 15, // ms
  TOAST_TIMEOUT: 3700, // ms
  ANIMATION_TIMEOUT: 500, // ms
};

// Audio configuration for screen recording
export const AUDIO_CONFIG = {
  echoCancellation: true,
  noiseSuppression: true,
  sampleRate: 44100,
};

// Video configuration for screen recording
export const VIDEO_CONFIG = {
  mediaSource: "screen",
};

// Camera configuration
export const CAMERA_CONFIG = {
  DEFAULT: {
    width: { ideal: 320 },
    height: { ideal: 240 },
    facingMode: "user"
  },
  HD: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: "user"
  }
};
