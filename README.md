# ✨ ScreenREC - El Grabador de Pantalla que Necesitas

<div align="center">

![ScreenREC Logo](src/images/logo.png)

### 🎬 **La herramienta definitiva para grabación de pantalla**
### ¡Gratuita, Sin límites, Sin complicaciones!

[![Live Demo](https://img.shields.io/badge/🌐_Ver_Demo-4285f4?style=for-the-badge)](https://screenrec.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/cristopher-dev/screenREC-dev?style=for-the-badge&logo=github)](https://github.com/cristopher-dev/screenREC-dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE.md)

</div>

---

## 🌟 **¿Por qué ScreenREC?**

En un mundo donde **el contenido visual es rey**, necesitas una herramienta que no te limite. ScreenREC nació durante la era COVID-19 cuando las videollamadas, tutoriales y demostraciones se volvieron esenciales. 

**¡Y lo mejor de todo? Es completamente GRATIS y sin restricciones!**

## 🚀 **Características que te Encantarán**

<div align="center">

### 🎯 **Interfaz Elegante y Funcional**

</div>

**Tema Claro - Perfecto para trabajar de día** ☀️
![ScreenREC Tema Claro - Interfaz limpia y profesional](docs/screenshots/light-theme.png)

**Tema Oscuro - Ideal para largas sesiones** 🌙
![ScreenREC Tema Oscuro - Diseño moderno y elegante](docs/screenshots/dark-theme.png)

### ✨ **Lo que hace especial a ScreenREC:**

🎬 **GRABACIÓN ILIMITADA** 
> Sin restricciones de tiempo. Graba desde 5 segundos hasta 5 horas.

💰 **100% GRATUITO PARA SIEMPRE**
> Sin suscripciones ocultas, sin marcas de agua, sin trucos.

🚫 **CERO ANUNCIOS**
> Experiencia pura de grabación sin interrupciones molestas.

🎵 **AUDIO CRISTALINO**
> Captura audio del sistema + micrófono simultáneamente.

🎨 **TEMAS ELEGANTES**
> Cambia entre modo claro y oscuro según tu preferencia.

📱 **RESPONSIVE AL 100%**
> Funciona perfectamente en cualquier resolución de pantalla.

⚡ **SIN INSTALACIÓN**
> Directo en tu navegador. ¡Haz clic y empieza a grabar!

🔒 **PRIVACIDAD TOTAL**
> Todo se procesa en tu dispositivo. Nunca enviamos tus grabaciones.

## 🎯 **¡Pruébalo Ahora!**

<div align="center">

### 🌐 **[» DEMO EN VIVO - Haz clic aquí «](https://screenrec.vercel.app)**

*¡En menos de 10 segundos estarás grabando como un profesional!*

</div>

---

## 🔥 **Casos de Uso Perfectos**

### 👨‍💼 **Profesionales**
- 📊 Presentaciones de negocios
- 🎓 Tutoriales y capacitaciones
- 🐛 Reportes de bugs con evidencia visual
- 📹 Demos de productos

### 🎮 **Creadores de Contenido**
- 🎬 Gameplay y streaming
- 🖥️ Tutoriales de software
- 🎨 Procesos creativos
- 📚 Contenido educativo

### 👨‍🎓 **Estudiantes y Educadores**
- 📖 Clases virtuales
- 📝 Explicaciones de tareas
- 🧪 Experimentos online
- 💡 Proyectos colaborativos

## ⚡ **Tecnología de Vanguardia**

<div align="center">

### 🏗️ **Construido con las mejores tecnologías web modernas**

</div>

| Tecnología | Propósito | ¿Por qué la elegimos? |
|------------|-----------|----------------------|
| 🟧 **Parcel.js** | Build & Bundling | ⚡ Configuración cero, velocidad máxima |
| 🟦 **Vanilla JS ES6+** | Lógica Principal | 🚀 Performance puro, sin dependencias pesadas |
| 🟪 **Pug Templates** | HTML Modular | 📦 Componentes reutilizables y mantenibles |
| 🟩 **SCSS/Sass** | Estilos Avanzados | 🎨 Variables, mixins y arquitectura escalable |
| 🔴 **MediaRecorder API** | Grabación | 🎬 API nativa del navegador, máxima compatibilidad |

### 🌐 **APIs Web Utilizadas**
- **🎥 MediaRecorder API**: Grabación de video/audio de alta calidad
- **🖥️ getDisplayMedia API**: Captura de pantalla nativa del navegador
- **🎤 getUserMedia API**: Acceso profesional al micrófono

## 🎮 **¡Empezar es Súper Fácil!**

<div align="center">

### 🚀 **En 4 pasos simples estarás grabando**

</div>

```bash
# 1️⃣ Clona este increíble proyecto
git clone https://github.com/cristopher-dev/screenREC-dev.git
cd screenREC-dev

# 2️⃣ Instala las dependencias (solo una vez)
npm install

# 3️⃣ ¡Lanza el servidor de desarrollo!
npm start

# 4️⃣ ¡Abre tu navegador en http://localhost:1234 y empieza a grabar! 🎬
```

### 🔥 **¿Quieres deployar tu propia versión?**

```bash
# Construye para producción (optimizado al máximo)
npm run build

# ¡Tu aplicación estará lista en la carpeta /dist!
```

### 📋 **Compatibilidad de Navegadores**

| Navegador | Versión Mínima | Estado |
|-----------|----------------|--------|
| 🟢 **Chrome** | 72+ | ✅ Perfecto |
| 🟠 **Firefox** | 65+ | ✅ Perfecto |
| 🔵 **Safari** | 13+ | ✅ Perfecto |
| 🟣 **Edge** | 79+ | ✅ Perfecto |

> **💡 Tip:** Para la mejor experiencia, usa Chrome o Firefox.

### 📱 **Dispositivos Soportados**
- ✅ **Desktop/Laptop**: Experiencia completa
- ❌ **Mobile/Tablet**: Próximamente (las APIs de grabación aún no están disponibles en móviles)

## 📁 Estructura del Proyecto

```
src/
├── index.pug                 # Punto de entrada principal
├── js/
│   ├── index.js             # Inicialización de la aplicación
│   ├── components/          # Componentes reutilizables
│   │   ├── recorder.js      # Lógica de grabación de pantalla
│   │   └── themeToggler.js  # Gestión de temas
│   └── utils/               # Funciones utilitarias
│       ├── constants.js     # Constantes de la aplicación
│       ├── errorHandler.js  # Gestión de errores
│       └── handleMobileUsers.js # Detección móvil
├── scss/
│   ├── index.scss          # Hoja de estilos principal
│   ├── components/         # Estilos de componentes
│   └── utils/              # Utilidades SCSS
├── partials/               # Plantillas Pug
└── images/                 # Assets estáticos
```

## 🏗️ Arquitectura

### Patrón Singleton
Todos los componentes principales utilizan el patrón Singleton:

```javascript
// Ejemplo de uso
import ScreenRecorder from "./components/recorder";
const recorder = ScreenRecorder.getInstance();
```

### Módulos ES6
Sistema de importación/exportación para modularidad:

```javascript
import ScreenRecorder from "./components/recorder";
import ThemeToggler from "./components/themeToggler";
```

### Gestión de Estado
Estado centralizado dentro de cada componente:

```javascript
this.state = {
  mime: null,
  mediaRecorder: null,
  isRecording: false,
  isPause: false,
  filename: null,
  selectedOption: null,
  screenStream: null,
  microphoneStream: null,
};
```

## 🎨 Convenciones de Código

### Clases CSS (BEM-like)
- **Bloque**: `.sh__component` (sh = ScreenRec)
- **Elemento**: `.sh__component--element`
- **Lista**: `.sh__component__list--item`

### JavaScript
- **Constantes**: `UPPER_SNAKE_CASE`
- **Variables**: `camelCase`
- **Clases**: `PascalCase`
- **Archivos**: `camelCase.js`

### Archivos
- **Plantillas Pug**: `kebab-case.pug`
- **Archivos SCSS**: `kebab-case.scss` con prefijo `_` para partials
- **JavaScript**: `camelCase.js`

## 📜 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build

# Formatear código
npm run format

# Verificar formato
npm run check-format

# Verificar linting
npm run check-lint

# Ejecutar todas las verificaciones
npm test
```

## 🔧 Configuración

### ESLint
El proyecto utiliza ESLint para linting con integración de Prettier.

### Prettier
Formateo automático de código con configuración estándar.

### Husky
Git hooks para verificaciones pre-commit.

## 🎯 **Guía de Uso Rápida**

<div align="center">

### 📖 **¡Graba como un profesional en 5 pasos!**

</div>

### 🎬 **Proceso de Grabación:**

1. **🎯 Selecciona tu objetivo**
   - 🖥️ Pantalla completa
   - 🪟 Ventana específica  
   - 🌐 Pestaña del navegador

2. **🎵 Configura el audio (opcional)**
   - 🔊 Audio del sistema
   - 🎤 Micrófono personal
   - 🎭 ¡O ambos para máxima calidad!

3. **📝 Nombra tu grabación (opcional)**
   - Dale un nombre personalizado
   - O deja que generemos uno automáticamente

4. **🎬 ¡GRABA!**
   - ⏺️ Inicia tu grabación
   - ⏸️ Pausa cuando necesites
   - ⏹️ Detén cuando termines

5. **📥 Descarga instantánea**
   - El archivo se descarga automáticamente
   - Formato MP4 compatible con todo
   - ¡Listo para compartir!

---

## 🏆 **¿Por qué ScreenREC es la Mejor Opción?**

### 🆚 **Comparación con la Competencia:**

| Característica | ScreenREC | Otros Grabadores |
|----------------|-----------|------------------|
| **💰 Precio** | ✅ Gratis Forever | ❌ Suscripciones caras |
| **⏱️ Límite de tiempo** | ✅ Ilimitado | ❌ 5-10 minutos |
| **🚫 Anuncios** | ✅ Cero anuncios | ❌ Anuncios invasivos |
| **💧 Marca de agua** | ✅ Sin marca | ❌ Logo molesto |
| **📱 Instalación** | ✅ Solo navegador | ❌ Software pesado |
| **🔒 Privacidad** | ✅ 100% local | ❌ Subida forzada |
| **🎨 Interfaz** | ✅ Moderna y limpia | ❌ Anticuada |
| **🌙 Temas** | ✅ Claro y oscuro | ❌ Una sola opción |

## 🚀 **¡Únete a la Revolución ScreenREC!**

<div align="center">

### 🤝 **¿Quieres hacer ScreenREC aún mejor?**

[![Contribuir](https://img.shields.io/badge/🚀_Contribuir-Ahora-green?style=for-the-badge)](https://github.com/cristopher-dev/screenREC-dev/fork)
[![Issues](https://img.shields.io/badge/🐛_Reportar_Bug-Aquí-red?style=for-the-badge)](https://github.com/cristopher-dev/screenREC-dev/issues)
[![Discussions](https://img.shields.io/badge/💬_Discutir_Ideas-Foro-blue?style=for-the-badge)](https://github.com/cristopher-dev/screenREC-dev/discussions)

</div>

### 🎯 **Cómo Contribuir:**

1. **🍴 Fork** el proyecto
2. **🌿 Crea** tu rama de feature: `git checkout -b feature/IncreibleFeature`
3. **💻 Desarrolla** tu mejora increíble
4. **✅ Commit** tus cambios: `git commit -m 'Add: IncreibleFeature'`
5. **🚀 Push** a la rama: `git push origin feature/IncreibleFeature`
6. **🎉 Abre** un Pull Request

### 🌟 **Ideas para Contribuir:**
- 🎨 Nuevos temas y colores
- 🌍 Traducción a otros idiomas
- 📱 Soporte para dispositivos móviles
- 🎛️ Controles avanzados de grabación
- 🔧 Optimizaciones de performance
- 🧪 Tests automatizados

### 💡 **¿Tienes una idea genial?**
¡Abre un [Issue](https://github.com/cristopher-dev/screenREC-dev/issues) y cuéntanos!

---

<div align="center">

## � **Contacto y Links Importantes**

[![GitHub](https://img.shields.io/badge/GitHub-cristopher--dev-black?style=for-the-badge&logo=github)](https://github.com/cristopher-dev)
[![License MIT](https://img.shields.io/badge/📄_Licencia-MIT-green?style=for-the-badge)](LICENSE.md)
[![Security](https://img.shields.io/badge/🔒_Seguridad-Policy-red?style=for-the-badge)](SECURITY.md)
[![Privacy](https://img.shields.io/badge/🛡️_Privacidad-Policy-blue?style=for-the-badge)](privacy-policy.md)

### 👨‍💻 **Creado con ❤️ por SAGNIK SAHOO**

*Desarrollado durante la era COVID-19 para democratizar la grabación de pantalla*

### 🌟 **¿Te gustó ScreenREC?**

<div style="font-size: 1.5em; margin: 20px 0;">

**⭐ ¡Dale una estrella en GitHub!** ⭐

</div>

Tu apoyo nos motiva a seguir mejorando y mantener ScreenREC gratis para siempre.

### 🔗 **Enlaces Útiles**
- 🌐 **[Demo Live](https://screenrec.vercel.app)** - Prueba ahora mismo
- 📚 **[Documentación](docs/)** - Guías detalladas
- 🐛 **[Reportar Bugs](https://github.com/cristopher-dev/screenREC-dev/issues)** - Ayúdanos a mejorar
- 💬 **[Discusiones](https://github.com/cristopher-dev/screenREC-dev/discussions)** - Comparte ideas
- 🔒 **[Seguridad](SECURITY.md)** - Reporta vulnerabilidades

### 🏆 **Agradecimientos Especiales**

- 🌍 **La comunidad de desarrollo web** por las APIs increíbles
- 🦠 **La era COVID-19** por enseñarnos la importancia de las herramientas digitales
- 👥 **Todos los contributores** que han hecho ScreenREC mejor
- ⭐ **Cada usuario** que usa y recomienda ScreenREC

---

<div style="border: 2px solid #4285f4; border-radius: 10px; padding: 20px; background: linear-gradient(45deg, #f0f8ff, #e6f3ff);">

### 🎉 **¡Empezar es Gratis y Toma Solo 30 Segundos!**

**[🚀 IR AL DEMO LIVE 🚀](https://screenrec.vercel.app)**

*No se requiere registro • No hay límites • No hay trucos*

</div>

</div>

---

**Made with 💙 for the global community • ScreenREC © 2024 • Powered by modern web APIs**