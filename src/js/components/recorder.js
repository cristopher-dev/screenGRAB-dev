import {
  NOTIFICATION_CONFIG,
  RECORDING_OPTIONS,
  MEDIA_RECORDER_CONFIG,
  AUDIO_CONFIG,
  VIDEO_CONFIG,
  MICROPHONE_CONFIG,
} from "../utils/constants";
import {
  RecorderError,
  ERROR_TYPES,
  handleRecorderError,
} from "../utils/errorHandler";

export default class screenGRABorder {
  constructor() {
    if (screenGRABorder.instance) {
      throw new Error("Use screenGRABorder.getInstance() instead of new");
    }

    this.elements = this.initializeElements();
    this.state = {
      mime: null,
      mediaRecorder: null,
      isRecording: false,
      isPause: false,
      filename: null,
      selectedOption: null,
      selectedCameraId: null,
      selectedMicrophoneId: null,
      availableCameras: [],
      availableMicrophones: [],
      screenStream: null,
      microphoneStream: null,
      cameraStream: null,
      canvasElement: null,
      screenVideo: null,
      cameraVideo: null,
      audioContext: null,
      recordingStartTime: null,
      recordingTimer: null,
      recordingDuration: 0,
    };
    this.toastTimeout = null;
  }

  static getInstance() {
    if (!screenGRABorder.instance) {
      screenGRABorder.instance = new screenGRABorder();
    }
    return screenGRABorder.instance;
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
      cameraSelector: document.querySelector(".sh__camera-selector"),
      cameraSelect: document.getElementById("camera-select"),
      microphoneSelector: document.querySelector(".sh__microphone-selector"),
      microphoneSelect: document.getElementById("microphone-select"),
      recordingTime: document.getElementById("recording-time"),
      recordingTimeText: document.querySelector(".sh__recording-time--text"),
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

    // Show camera selector if screen-camera option is selected
    if (selectedAttrValue === RECORDING_OPTIONS.SCREEN_CAMERA) {
      this.showCameraSelector();
      this.showMicrophoneSelector();
    } else if (selectedAttrValue === RECORDING_OPTIONS.SCREEN_MIC) {
      this.hideCameraSelector();
      this.showMicrophoneSelector();
    } else {
      this.hideCameraSelector();
      this.hideMicrophoneSelector();
    }

    this.elements.dropdownDefaultOption.textContent = selectedElement.innerText;
    
    // Establecer el MIME type correcto para video
    this.state.mime = this.getBestMimeType();
    return selectedAttrValue;
  }

  getBestMimeType() {
    // Lista de MIME types ordenados por preferencia para grabaciones largas
    const preferredMimeTypes = [
      // Priorizar formatos más estables para grabaciones largas
      'video/webm;codecs=vp8,opus',     // VP8 es más estable que VP9
      'video/webm;codecs=vp9,opus',     // VP9 solo si VP8 no está disponible
      'video/webm',                     // WebM genérico
      'video/mp4;codecs=h264,aac',      // MP4 H264 (más compatible)
      'video/mp4'                       // MP4 genérico
    ];

    for (const mimeType of preferredMimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        console.log(`Usando MIME type: ${mimeType}`);
        return mimeType;
      }
    }

    // Fallback más robusto
    console.warn('Ningún MIME type preferido es compatible, probando fallbacks...');
    
    // Probar tipos básicos sin codecs específicos
    const fallbackTypes = ['video/webm', 'video/mp4'];
    for (const type of fallbackTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log(`Usando fallback MIME type: ${type}`);
        return type;
      }
    }

    // Último recurso - usar el que esté disponible
    console.error('No se encontró ningún MIME type compatible');
    return 'video/webm'; // Fallback final
  }

  async detectAvailableCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      this.state.availableCameras = videoDevices;
      return videoDevices;
    } catch (error) {
      console.error('Error detecting cameras:', error);
      return [];
    }
  }

  async detectAvailableMicrophones() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      this.state.availableMicrophones = audioDevices;
      return audioDevices;
    } catch (error) {
      console.error('Error detecting microphones:', error);
      return [];
    }
  }

  async populateCameraOptions() {
    const cameras = await this.detectAvailableCameras();
    const select = this.elements.cameraSelect;
    
    // Clear existing options
    select.innerHTML = '';
    
    if (cameras.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No se encontraron cámaras';
      option.disabled = true;
      select.appendChild(option);
      return;
    }
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona una cámara';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    
    // Add camera options
    cameras.forEach((camera, index) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.textContent = camera.label || `Cámara ${index + 1}`;
      select.appendChild(option);
    });
  }

  async populateMicrophoneOptions() {
    const microphones = await this.detectAvailableMicrophones();
    const select = this.elements.microphoneSelect;
    
    // Clear existing options
    select.innerHTML = '';
    
    if (microphones.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No se encontraron micrófonos';
      option.disabled = true;
      select.appendChild(option);
      return;
    }
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona un micrófono';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    
    // Add microphone options
    microphones.forEach((microphone, index) => {
      const option = document.createElement('option');
      option.value = microphone.deviceId;
      option.textContent = microphone.label || `Micrófono ${index + 1}`;
      select.appendChild(option);
    });
  }

  showCameraSelector() {
    this.elements.cameraSelector.style.display = 'block';
    this.elements.cameraSelector.classList.add('visible');
    this.populateCameraOptions();
  }

  hideCameraSelector() {
    this.elements.cameraSelector.style.display = 'none';
    this.elements.cameraSelector.classList.remove('visible');
    this.state.selectedCameraId = null;
  }

  showMicrophoneSelector() {
    this.elements.microphoneSelector.style.display = 'block';
    this.elements.microphoneSelector.classList.add('visible');
    this.populateMicrophoneOptions();
  }

  hideMicrophoneSelector() {
    this.elements.microphoneSelector.style.display = 'none';
    this.elements.microphoneSelector.classList.remove('visible');
    this.state.selectedMicrophoneId = null;
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

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  startRecordingTimer() {
    this.state.recordingStartTime = Date.now();
    this.state.recordingDuration = 0;
    
    // Mostrar el indicador de tiempo
    this.elements.recordingTime.classList.add('visible', 'recording');
    
    this.state.recordingTimer = setInterval(() => {
      if (!this.state.isPause) {
        this.state.recordingDuration = Math.floor((Date.now() - this.state.recordingStartTime) / 1000);
        this.elements.recordingTimeText.textContent = this.formatTime(this.state.recordingDuration);
      }
    }, 1000);
  }

  pauseRecordingTimer() {
    // Pausar el timer pero mantener el tiempo actual
    if (this.state.recordingTimer) {
      clearInterval(this.state.recordingTimer);
      this.state.recordingTimer = null;
    }
    
    // Cambiar animación para indicar pausa
    this.elements.recordingTime.classList.remove('recording');
    this.elements.recordingTime.classList.add('paused');
  }

  resumeRecordingTimer() {
    // Reanudar el timer desde donde se pausó
    this.state.recordingStartTime = Date.now() - (this.state.recordingDuration * 1000);
    
    this.state.recordingTimer = setInterval(() => {
      this.state.recordingDuration = Math.floor((Date.now() - this.state.recordingStartTime) / 1000);
      this.elements.recordingTimeText.textContent = this.formatTime(this.state.recordingDuration);
    }, 1000);
    
    // Restaurar animación de grabación
    this.elements.recordingTime.classList.remove('paused');
    this.elements.recordingTime.classList.add('recording');
  }

  stopRecordingTimer() {
    if (this.state.recordingTimer) {
      clearInterval(this.state.recordingTimer);
      this.state.recordingTimer = null;
    }
    
    // Ocultar el indicador de tiempo
    this.elements.recordingTime.classList.remove('visible', 'recording', 'paused');
    
    // Log del tiempo total de grabación
    console.log(`Grabación completada. Duración total: ${this.formatTime(this.state.recordingDuration)}`);
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

  showCustomToast(message, variant = 'warning') {
    // Clear any existing toast timeouts
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // Set toast variant
    this.elements.toast.className = ""; // Reset classes
    this.elements.toast.classList.add(variant);
    this.elements.toast.classList.add("active");

    document.getElementById("desc").innerHTML = message;

    // Handle close button click
    const closeBtn = this.elements.toast.querySelector(".toast-close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.elements.toast.classList.add("closing");
        setTimeout(() => {
          this.elements.toast.classList.remove("active", "closing");
        }, 300);
      };
    }

    // Auto-close toast after timeout
    this.toastTimeout = setTimeout(() => {
      this.elements.toast.classList.remove("active");
    }, MEDIA_RECORDER_CONFIG.TOAST_TIMEOUT);
  }

  createRecorder(stream) {
    // the stream data is stored in this array
    let recordedChunks = [];
    let totalSize = 0; // Rastrear el tamaño total
    
    // Validar que el MIME type sea compatible antes de crear el MediaRecorder
    if (!MediaRecorder.isTypeSupported(this.state.mime)) {
      console.error(`MIME type no compatible: ${this.state.mime}`);
      // Intentar con un fallback
      this.state.mime = this.getBestMimeType();
      console.log(`Usando MIME type de respaldo: ${this.state.mime}`);
    }
    
    // Configurar opciones del MediaRecorder para mejor estabilidad
    const mediaRecorderOptions = {
      mimeType: this.state.mime
    };
    
    // Agregar opciones de bitrate para grabaciones largas si el MIME type las soporta
    if (this.state.mime.includes('webm')) {
      // Para WebM, usar bitrates más conservadores para grabaciones largas
      mediaRecorderOptions.videoBitsPerSecond = 2500000; // 2.5 Mbps
      mediaRecorderOptions.audioBitsPerSecond = 128000;  // 128 kbps
    }
    
    console.log('Configuración MediaRecorder:', mediaRecorderOptions);
    
    try {
      this.state.mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
    } catch (error) {
      console.error('Error creando MediaRecorder con opciones avanzadas:', error);
      // Fallback sin opciones de bitrate
      this.state.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.state.mime
      });
    }

    this.state.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
        totalSize += e.data.size;
        
        // Log periódico del progreso para grabaciones largas
        if (recordedChunks.length % 50 === 0) {
          console.log(`Grabación en progreso: ${recordedChunks.length} chunks, ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
          
          // Forzar garbage collection si está disponible
          if (window.gc && typeof window.gc === 'function') {
            window.gc();
          }
        }
        
        // Advertencia si el archivo se está volviendo muy grande (>500MB)
        if (totalSize > 500 * 1024 * 1024 && recordedChunks.length % 100 === 0) { // Solo mostrar cada 100 chunks para no spam
          console.warn('Grabación muy grande (>500MB), considere detener pronto para evitar problemas de memoria');
          this.showCustomToast('Grabación muy larga detectada. Considere detener pronto.', 'warning');
        }
        
        // Límite de seguridad para evitar que el navegador se cuelgue (1GB)
        if (totalSize > 1024 * 1024 * 1024) {
          console.error('Límite de memoria alcanzado, deteniendo grabación automáticamente');
          this.stopRecording();
          this.showCustomToast('Grabación detenida automáticamente por límite de memoria', 'error');
        }
      } else {
        console.warn('Chunk vacío recibido');
      }
    };

    this.state.mediaRecorder.onstop = () => {
      console.log(`Grabación finalizada: ${recordedChunks.length} chunks, ${(totalSize / 1024 / 1024).toFixed(2)} MB total`);
      
      if (this.state.isRecording) this.stopRecording();
      
      // Verificar que tenemos datos antes de procesar
      if (recordedChunks.length === 0) {
        console.error('No se grabaron datos');
        handleRecorderError(new RecorderError('No se grabaron datos de video', ERROR_TYPES.PROCESSING));
        return;
      }
      
      // Procesar el video en el próximo tick para evitar bloquear la UI
      setTimeout(() => {
        this.bakeVideo(recordedChunks);
        recordedChunks = [];
        totalSize = 0;
      }, 100);
    };

    this.state.mediaRecorder.onerror = (event) => {
      console.error('Error en MediaRecorder:', event.error);
      handleRecorderError(new RecorderError('Error durante la grabación: ' + event.error.message, ERROR_TYPES.RECORDING_FAILED));
    };

    // When stopping 'Tab Record' on Chrome browser by clicking 'Stop sharing' button, this gets fired instead of onstop event.
    this.state.mediaRecorder.stream.oninactive = () => {
      console.log('Stream inactivo, deteniendo grabación');
      this.stopRecording();
    };

    this.state.mediaRecorder.start(MEDIA_RECORDER_CONFIG.CHUNK_SIZE);
    console.log(`MediaRecorder iniciado con chunks de ${MEDIA_RECORDER_CONFIG.CHUNK_SIZE}ms`);
    return this.state.mediaRecorder;
  }

  async recordScreenAndMicrophone() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: VIDEO_CONFIG,
        audio: AUDIO_CONFIG,
      });

      // Use selected microphone or default
      const microphoneConstraints = this.state.selectedMicrophoneId
        ? {
            audio: {
              deviceId: { exact: this.state.selectedMicrophoneId },
              ...MICROPHONE_CONFIG.DEFAULT
            }
          }
        : { audio: MICROPHONE_CONFIG.DEFAULT };

      console.log('Usando micrófono:', this.state.selectedMicrophoneId || 'por defecto', 'Constraints:', microphoneConstraints);
      
      const microphoneStream = await navigator.mediaDevices.getUserMedia(microphoneConstraints);

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

  async recordScreenAndCamera() {
    // Check if a camera is selected
    if (!this.state.selectedCameraId) {
      throw new Error('Debe seleccionar una cámara antes de grabar');
    }

    // Get screen stream
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: VIDEO_CONFIG,
      audio: AUDIO_CONFIG,
    });

    // Get camera stream with selected device
    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: this.state.selectedCameraId },
        width: { ideal: 320 },
        height: { ideal: 240 },
      },
      audio: false // We'll use the screen audio
    });

    // Create a canvas to combine both streams
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions based on screen stream
    const screenVideo = document.createElement('video');
    screenVideo.srcObject = screenStream;
    screenVideo.play();

    const cameraVideo = document.createElement('video');
    cameraVideo.srcObject = cameraStream;
    cameraVideo.play();

    // Wait for videos to load metadata
    await Promise.all([
      new Promise(resolve => screenVideo.addEventListener('loadedmetadata', resolve)),
      new Promise(resolve => cameraVideo.addEventListener('loadedmetadata', resolve))
    ]);

    // Set canvas size to screen dimensions
    canvas.width = screenVideo.videoWidth;
    canvas.height = screenVideo.videoHeight;

    // Calculate camera overlay position (bottom-right corner)
    const cameraWidth = Math.min(320, canvas.width * 0.25);
    const cameraHeight = (cameraWidth * cameraVideo.videoHeight) / cameraVideo.videoWidth;
    const cameraX = canvas.width - cameraWidth - 20;
    const cameraY = canvas.height - cameraHeight - 20;

    // Draw frames continuously
    const drawFrame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw screen content
      ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
      
      // Draw camera overlay with rounded corners
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cameraX, cameraY, cameraWidth, cameraHeight, 10);
      ctx.clip();
      ctx.drawImage(cameraVideo, cameraX, cameraY, cameraWidth, cameraHeight);
      ctx.restore();

      // Add border to camera overlay
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cameraX, cameraY, cameraWidth, cameraHeight, 10);
      ctx.stroke();

      requestAnimationFrame(drawFrame);
    };

    drawFrame();

    // Get the canvas stream
    const canvasStream = canvas.captureStream(30); // 30 FPS

    // Handle audio - combine screen audio with selected microphone if available
    if (this.state.selectedMicrophoneId) {
      try {
        // Get microphone stream with selected device
        const microphoneConstraints = {
          audio: {
            deviceId: { exact: this.state.selectedMicrophoneId },
            ...MICROPHONE_CONFIG.DEFAULT
          }
        };
        
        const microphoneStream = await navigator.mediaDevices.getUserMedia(microphoneConstraints);
        
        // Get audio tracks
        const screenAudioTracks = screenStream.getAudioTracks();
        const microphoneAudioTracks = microphoneStream.getAudioTracks();

        // If we have both audio sources, mix them
        if (screenAudioTracks.length > 0 || microphoneAudioTracks.length > 0) {
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

          // Add mixed audio to canvas stream
          destination.stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));
        }

        // Store microphone stream for cleanup
        this.state.microphoneStream = microphoneStream;
      } catch (error) {
        console.warn('Failed to get selected microphone, using screen audio only:', error);
        // Fallback to screen audio only
        const screenAudioTracks = screenStream.getAudioTracks();
        if (screenAudioTracks.length > 0) {
          screenAudioTracks.forEach(track => canvasStream.addTrack(track));
        }
      }
    } else {
      // Use screen audio only
      const screenAudioTracks = screenStream.getAudioTracks();
      if (screenAudioTracks.length > 0) {
        screenAudioTracks.forEach(track => canvasStream.addTrack(track));
      }
    }

    // Store references for cleanup
    this.state.screenStream = screenStream;
    this.state.cameraStream = cameraStream;
    this.state.canvasElement = canvas;
    this.state.screenVideo = screenVideo;
    this.state.cameraVideo = cameraVideo;

    return canvasStream;
  }

  bakeVideo(recordedChunks) {
    console.log(`Procesando video: ${recordedChunks.length} chunks`);
    console.log(`MIME type para blob: ${this.state.mime}`);
    
    // Verificar que tengamos chunks válidos
    if (!recordedChunks || recordedChunks.length === 0) {
      console.error('No hay chunks de video para procesar');
      handleRecorderError(new RecorderError('No se grabaron datos de video', ERROR_TYPES.PROCESSING));
      return;
    }

    // Verificar que los chunks tengan datos
    const totalSize = recordedChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (totalSize === 0) {
      console.error('Los chunks están vacíos');
      handleRecorderError(new RecorderError('Los datos de video están vacíos', ERROR_TYPES.PROCESSING));
      return;
    }

    try {
      // Crear el blob con el MIME type correcto
      const blob = new Blob(recordedChunks, {
        type: this.state.mime
      });
      
      console.log(`Blob creado: ${(blob.size / 1024 / 1024).toFixed(2)} MB, tipo: ${blob.type}`);
      console.log(`Duración total de grabación: ${this.formatTime(this.state.recordingDuration)}`);
      
      // Verificar que el blob se creó correctamente
      if (blob.size === 0) {
        console.error('El blob resultante está vacío');
        handleRecorderError(new RecorderError('Error al procesar el video', ERROR_TYPES.PROCESSING));
        return;
      }
      
      let savedName;
      if (this.state.filename == null || this.state.filename == "")
        savedName = this.getRandomString(15);
      else savedName = this.state.filename;
      
      // Determinar la extensión correcta basada en el MIME type
      const fileExtension = this.getFileExtensionFromMimeType(this.state.mime);
      console.log(`Extensión de archivo: ${fileExtension}`);
      
      // Crear URLs por separado para descarga y preview
      const downloadUrl = URL.createObjectURL(blob);
      const previewUrl = URL.createObjectURL(blob);
      
      // Configurar la descarga
      this.elements.download.href = downloadUrl;
      this.elements.download.download = `${savedName}.${fileExtension}`;
      
      // Configurar el preview
      this.elements.videoOpacitySheet.remove();
      this.elements.preview.autoplay = true;
      this.elements.preview.controls = true;
      this.elements.preview.muted = false;
      this.elements.preview.src = previewUrl;
      
      // Agregar listener para limpiar URLs cuando ya no se necesiten
      const downloadHandler = () => {
        console.log('Iniciando descarga, limpiando URL en 2 segundos...');
        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
          console.log('URL de descarga limpiada');
        }, 2000); // Dar más tiempo para la descarga
        this.elements.download.removeEventListener('click', downloadHandler);
      };
      
      this.elements.download.addEventListener('click', downloadHandler);
      
      // Limpiar URL del preview cuando se carge un nuevo video
      const previewHandler = () => {
        if (this.elements.preview.src !== previewUrl) {
          URL.revokeObjectURL(previewUrl);
          console.log('URL de preview limpiada');
          this.elements.preview.removeEventListener('loadstart', previewHandler);
        }
      };
      
      this.elements.preview.addEventListener('loadstart', previewHandler);
      
      console.log('Video procesado exitosamente');
      
    } catch (error) {
      console.error('Error al crear el blob de video:', error);
      handleRecorderError(new RecorderError('Error al procesar el video: ' + error.message, ERROR_TYPES.PROCESSING));
    }
  }

  getFileExtensionFromMimeType(mimeType) {
    // Extraer el tipo principal sin los codecs
    const baseType = mimeType.split(';')[0].toLowerCase();
    
    if (baseType === 'video/mp4') {
      return 'mp4';
    } else if (baseType === 'video/webm') {
      return 'webm';
    } else if (baseType.includes('mp4')) {
      return 'mp4';
    } else if (baseType.includes('webm')) {
      return 'webm';
    } else {
      // Fallback seguro
      console.warn(`Tipo MIME desconocido: ${mimeType}, usando webm como fallback`);
      return 'webm';
    }
  }

  async startRecording() {
    try {
      // Validate required selections based on recording option
      if (this.state.selectedOption === RECORDING_OPTIONS.SCREEN_MIC) {
        if (!this.state.selectedMicrophoneId) {
          throw new Error('Debe seleccionar un micrófono antes de grabar con audio');
        }
      } else if (this.state.selectedOption === RECORDING_OPTIONS.SCREEN_CAMERA) {
        if (!this.state.selectedCameraId) {
          throw new Error('Debe seleccionar una cámara antes de grabar con cámara');
        }
        // Microphone is optional for screen + camera, but show warning if not selected
        if (!this.state.selectedMicrophoneId) {
          console.warn('No se ha seleccionado micrófono. Solo se grabará el audio del sistema.');
        }
      }

      let stream;
      if (this.state.selectedOption === RECORDING_OPTIONS.SCREEN) {
        stream = await this.recordScreen();
      } else if (this.state.selectedOption === RECORDING_OPTIONS.SCREEN_MIC) {
        stream = await this.recordScreenAndMicrophone();
      } else if (this.state.selectedOption === RECORDING_OPTIONS.SCREEN_CAMERA) {
        stream = await this.recordScreenAndCamera();
      } else {
        // Handle the case where no valid option is selected
        return;
      }

      this.state.filename = document.getElementById("filename").value;
      this.state.isRecording = true;
      this.state.mediaRecorder = this.createRecorder(stream);
      this.elements.preview.srcObject = stream;
      this.elements.preview.captureStream =
        this.elements.preview.captureStream ||
        this.elements.preview.mozCaptureStream;
      this.elements.mimeChoiceWrapper.classList.add("hide");
      this.elements.headerText.classList.add("is-recording");
      this.elements.preview.classList.add("visible");
      this.elements.pauseAndResume.classList.add("visible");
      this.elements.stop.classList.add("visible");
      
      // Iniciar el timer de grabación
      this.startRecordingTimer();
      
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
    
    // Pausar el timer
    this.pauseRecordingTimer();
    
    this.appendStatusNotification("pause");
    this.elements.pauseAndResume.classList.add("resume");
    this.elements.pauseAndResume.classList.remove("pause");
  }

  resumeRecording() {
    this.state.mediaRecorder.resume();
    this.state.isPause = false;
    
    // Reanudar el timer
    this.resumeRecordingTimer();
    
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
    if (this.state.cameraStream) {
      this.state.cameraStream.getTracks().forEach((track) => track.stop());
    }

    // Clean up video elements
    if (this.state.screenVideo) {
      this.state.screenVideo.srcObject = null;
    }
    if (this.state.cameraVideo) {
      this.state.cameraVideo.srcObject = null;
    }

    // Close AudioContext if it exists
    if (this.state.audioContext) {
      this.state.audioContext.close();
      this.state.audioContext = null;
    }

    const isInactive = this.state.mediaRecorder.state === "inactive"; // when stopping record with `Stop Sharing` button, isInactive is true

    this.state.isRecording = false;
    if (!isInactive) this.state.mediaRecorder.stop(); // prevents program from stopping the mediaRecorder twice, causing app to crash on chrome browser
    
    // Detener el timer de grabación
    this.stopRecordingTimer();
    
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
    this.state.cameraStream = null;
    this.state.canvasElement = null;
    this.state.screenVideo = null;
    this.state.cameraVideo = null;
    this.state.filename = null;
    this.state.selectedCameraId = null;
    this.state.selectedMicrophoneId = null;
    this.state.recordingStartTime = null;
    this.state.recordingDuration = 0;

    // Limpiar el timer de grabación
    if (this.state.recordingTimer) {
      clearInterval(this.state.recordingTimer);
      this.state.recordingTimer = null;
    }

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

    // Hide camera and microphone selectors
    this.hideCameraSelector();
    this.hideMicrophoneSelector();

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

    // Camera selector event listener
    this.elements.cameraSelect.addEventListener("change", (e) => {
      this.state.selectedCameraId = e.target.value;
    });

    // Microphone selector event listener
    this.elements.microphoneSelect.addEventListener("change", (e) => {
      this.state.selectedMicrophoneId = e.target.value;
      console.log('Micrófono seleccionado:', e.target.value, 'Etiqueta:', e.target.options[e.target.selectedIndex].text);
    });
  }
}
