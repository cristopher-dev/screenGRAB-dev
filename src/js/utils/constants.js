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
export const LOCAL_STORAGE_KEY = "screenGRAB-color-scheme";

// Media recorder configuration
export const MEDIA_RECORDER_CONFIG = {
  CHUNK_SIZE: 3000, // ms - Chunks más grandes para mejor estabilidad en grabaciones largas
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

// Microphone configuration
export const MICROPHONE_CONFIG = {
  DEFAULT: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  }
};

// Video MIME types in order of preference for compatibility
export const VIDEO_MIME_TYPES = {
  MP4_H264: 'video/mp4;codecs=h264,aac',
  MP4_H264_BASELINE: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
  MP4_GENERIC: 'video/mp4',
  WEBM_VP8: 'video/webm;codecs=vp8,opus',
  WEBM_VP9: 'video/webm;codecs=vp9,opus',
  WEBM_GENERIC: 'video/webm',
};

// File extension mappings
export const FILE_EXTENSIONS = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

// Compatibility warnings
export const COMPATIBILITY_WARNINGS = {
  WEBM_WINDOWS: `
    <div style="font-size: 14px; line-height: 1.5;">
      <strong>⚠️ Formato WebM detectado</strong><br>
      Si no puedes reproducir el video en Windows Media Player:<br>
      • Usa <strong>VLC Media Player</strong> (gratuito)<br>
      • Convierte a MP4 con herramientas online<br>
      • Usa navegadores modernos para reproducir
    </div>
  `
};

// Video conversion messages
export const CONVERSION_MESSAGES = {
  LOADING_FFMPEG: `
    <div style="font-size: 14px; line-height: 1.5;">
      <strong>🔄 Preparando conversión automática</strong><br>
      Cargando FFmpeg.wasm (~31 MB) para convertir<br>
      tu video WebM a MP4 compatible con Windows...
    </div>
  `,
  CONVERTING: `
    <div style="font-size: 14px; line-height: 1.5;">
      <strong>⚡ Convirtiendo video</strong><br>
      Tu video se está convirtiendo a MP4 para<br>
      máxima compatibilidad con todos los reproductores...
    </div>
  `,
  CONVERSION_SUCCESS: `
    <div style="font-size: 14px; line-height: 1.5;">
      <strong>✅ Conversión completada</strong><br>
      Tu video ahora está en formato MP4 y es<br>
      compatible con Windows Media Player
    </div>
  `,
  CONVERSION_FAILED: `
    <div style="font-size: 14px; line-height: 1.5;">
      <strong>❌ Error en la conversión</strong><br>
      No se pudo convertir el video. Se descargará<br>
      en formato original. Usa VLC para reproducir.
    </div>
  `,
  FFMPEG_LOAD_FAILED: `
    <div style="font-size: 14px; line-height: 1.5;">
      <strong>⚠️ Conversión no disponible</strong><br>
      No se pudo cargar el convertidor de video.<br>
      El video se descargará en formato original.
    </div>
  `
};
