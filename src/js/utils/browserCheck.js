// Script para verificar compatibilidad con FFmpeg.wasm y MediaRecorder

if (typeof MediaRecorder !== 'undefined') {
  // Verificar tipos MIME soportados
  const mimeTypes = [
    'video/mp4;codecs=h264,aac',
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp9,opus',
    'video/webm',
  ];

  mimeTypes.forEach((mimeType) => {
    const supported = MediaRecorder.isTypeSupported(mimeType);
  });
}

export function checkBrowserCompatibility() {
  const checks = {
    mediaRecorder: typeof MediaRecorder !== 'undefined',
    sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
    webAssembly: typeof WebAssembly !== 'undefined',
    secureContext: window.isSecureContext,
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    getDisplayMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia),
  };

  const allPassed = Object.values(checks).every((check) => check);

  return checks;
}
