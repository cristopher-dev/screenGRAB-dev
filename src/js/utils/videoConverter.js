import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

/**
 * Conversor de video usando FFmpeg.wasm
 * Convierte videos WebM a MP4 para máxima compatibilidad
 */
export default class VideoConverter {
  constructor() {
    if (VideoConverter.instance) {
      throw new Error("Use VideoConverter.getInstance() instead of new");
    }

    this.ffmpeg = new FFmpeg();
    this.isLoaded = false;
    this.isLoading = false;
    this.loadingPromise = null;
  }

  static getInstance() {
    if (!VideoConverter.instance) {
      VideoConverter.instance = new VideoConverter();
    }
    return VideoConverter.instance;
  }

  /**
   * Inicializa FFmpeg.wasm
   */
  async loadFFmpeg() {
    if (this.isLoaded) {
      return true;
    }

    if (this.isLoading) {
      return this.loadingPromise;
    }

    this.isLoading = true;
    console.log('🔄 Cargando FFmpeg.wasm...');

    this.loadingPromise = this._performLoad();
    
    try {
      const result = await this.loadingPromise;
      this.isLoaded = result;
      this.isLoading = false;
      return result;
    } catch (error) {
      this.isLoading = false;
      throw error;
    }
  }

  async _performLoad() {
    try {
      // Usar ESM para compatibilidad con Parcel
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm';
      
      // Configurar logs para debugging
      this.ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg:', message);
      });

      // Cargar FFmpeg.wasm
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      console.log('✅ FFmpeg.wasm cargado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error cargando FFmpeg.wasm:', error);
      throw new Error(`No se pudo cargar FFmpeg.wasm: ${error.message}`);
    }
  }

  /**
   * Convierte un video WebM a MP4
   * @param {Blob} webmBlob - El blob del video WebM
   * @param {Function} onProgress - Callback para progreso (opcional)
   * @returns {Promise<Blob>} - El blob del video MP4 convertido
   */
  async convertWebMToMP4(webmBlob, onProgress = null) {
    if (!this.isLoaded) {
      throw new Error('FFmpeg.wasm no está cargado. Llama a loadFFmpeg() primero.');
    }

    console.log('🔄 Iniciando conversión WebM → MP4...');
    const startTime = performance.now();

    try {
      // Escribir el archivo de entrada
      const inputFileName = 'input.webm';
      const outputFileName = 'output.mp4';
      
      console.log(`📁 Escribiendo archivo de entrada: ${(webmBlob.size / 1024 / 1024).toFixed(2)} MB`);
      await this.ffmpeg.writeFile(inputFileName, await fetchFile(webmBlob));

      // Configurar listener de progreso si se proporciona
      if (onProgress) {
        this.ffmpeg.on('progress', ({ progress, time }) => {
          onProgress({
            progress: progress,
            time: time / 1000000, // Convertir a segundos
            message: `Conversión: ${(progress * 100).toFixed(1)}% completado`
          });
        });
      }

      // Ejecutar la conversión con parámetros optimizados para compatibilidad
      console.log('⚡ Ejecutando conversión...');
      await this.ffmpeg.exec([
        '-i', inputFileName,
        // Códec de video H.264 para máxima compatibilidad
        '-c:v', 'libx264',
        // Perfil baseline para máxima compatibilidad con reproductores antiguos
        '-profile:v', 'baseline',
        '-level', '3.0',
        // Códec de audio AAC
        '-c:a', 'aac',
        // Bitrate de audio conservador
        '-b:a', '128k',
        // Asegurar que el formato sea compatible
        '-movflags', '+faststart',
        // Archivo de salida
        outputFileName
      ]);

      // Leer el archivo convertido
      console.log('📤 Leyendo archivo convertido...');
      const data = await this.ffmpeg.readFile(outputFileName);
      
      // Crear el blob MP4
      const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
      
      // Limpiar archivos temporales
      await this.ffmpeg.deleteFile(inputFileName);
      await this.ffmpeg.deleteFile(outputFileName);

      const endTime = performance.now();
      const conversionTime = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`✅ Conversión completada en ${conversionTime}s`);
      console.log(`📊 Tamaño original: ${(webmBlob.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📊 Tamaño convertido: ${(mp4Blob.size / 1024 / 1024).toFixed(2)} MB`);

      return mp4Blob;

    } catch (error) {
      console.error('❌ Error durante la conversión:', error);
      throw new Error(`Error en la conversión: ${error.message}`);
    }
  }

  /**
   * Verifica si un blob necesita conversión
   * @param {string} mimeType - El tipo MIME del video
   * @returns {boolean} - true si necesita conversión
   */
  needsConversion(mimeType) {
    const baseType = mimeType.split(';')[0].toLowerCase();
    return baseType.includes('webm');
  }

  /**
   * Convierte un video si es necesario
   * @param {Blob} videoBlob - El blob del video
   * @param {string} mimeType - El tipo MIME original
   * @param {Function} onProgress - Callback para progreso (opcional)
   * @returns {Promise<{blob: Blob, extension: string, wasConverted: boolean}>}
   */
  async convertIfNeeded(videoBlob, mimeType, onProgress = null) {
    if (!this.needsConversion(mimeType)) {
      return {
        blob: videoBlob,
        extension: 'mp4',
        wasConverted: false
      };
    }

    // Asegurar que FFmpeg esté cargado
    await this.loadFFmpeg();

    const convertedBlob = await this.convertWebMToMP4(videoBlob, onProgress);
    
    return {
      blob: convertedBlob,
      extension: 'mp4',
      wasConverted: true
    };
  }

  /**
   * Limpia recursos
   */
  cleanup() {
    if (this.ffmpeg) {
      // Remover listeners
      this.ffmpeg.off('log');
      this.ffmpeg.off('progress');
    }
  }
}

// Errores personalizados
export class VideoConversionError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'VideoConversionError';
    this.originalError = originalError;
  }
}
