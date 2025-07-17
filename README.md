# ✨ ScreenREC - The Screen Recorder You Need

<div align="center">

![ScreenREC Logo](src/images/logo.png)

### 🎬 **The Ultimate Screen Recording Tool**

### Free, Unlimited, Hassle-Free!

[![Live Demo](https://img.shields.io/badge/🌐_View_Demo-4285f4?style=for-the-badge)](https://screenrec.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/cristopher-dev/screenREC-dev?style=for-the-badge&logo=github)](https://github.com/cristopher-dev/screenREC-dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE.md)

</div>

---

## 🌟 **Why ScreenREC?**

In a world where **visual content is king**, you need a tool that doesn’t limit you. ScreenREC was born during the COVID-19 era when video calls, tutorials, and demos became essential.

**And best of all? It’s completely FREE and without restrictions!**

## 🚀 **Features You'll Love**

<div align="center">

### 🎯 **Elegant and Functional Interface**

</div>

**Light Theme - Perfect for daytime work** ☀️  
![ScreenREC Light Theme - Clean and professional interface](docs/screenshots/light-theme.png)

**Dark Theme - Ideal for long sessions** 🌙  
![ScreenREC Dark Theme - Modern and sleek design](docs/screenshots/dark-theme.png)

### ✨ **What Makes ScreenREC Special:**

🎬 **UNLIMITED RECORDING**

> No time restrictions. Record from 5 seconds to 5 hours.

💰 **100% FREE FOREVER**

> No hidden subscriptions, no watermarks, no tricks.

🚫 **ZERO ADS**

> Pure recording experience without annoying interruptions.

🎵 **CRYSTAL CLEAR AUDIO**

> Capture system audio + microphone simultaneously.

🎨 **ELEGANT THEMES**

> Switch between light and dark mode as you prefer.

📱 **100% RESPONSIVE**

> Works perfectly on any screen resolution.

⚡ **NO INSTALLATION**

> Directly in your browser. Just click and start recording!

🔒 **TOTAL PRIVACY**

> Everything is processed on your device. We never send your recordings.

## 🎯 **Try It Now!**

<div align="center">

### 🌐 **[» LIVE DEMO - Click Here «](https://screenrec.vercel.app)**

_You'll be recording like a pro in less than 10 seconds!_

</div>

---

## 🔥 **Perfect Use Cases**

### 👨‍💼 **Professionals**

- 📊 Business presentations
- 🎓 Tutorials and training
- 🐛 Bug reports with visual evidence
- 📹 Product demos

### 🎮 **Content Creators**

- 🎬 Gameplay and streaming
- 🖥️ Software tutorials
- 🎨 Creative processes
- 📚 Educational content

### 👨‍🎓 **Students and Educators**

- 📖 Virtual classes
- 📝 Task explanations
- 🧪 Online experiments
- 💡 Collaborative projects

## ⚡ **Cutting-Edge Technology**

<div align="center">

### 🏗️ **Built with the Best Modern Web Technologies**

</div>

| Technology               | Purpose          | Why We Chose It                              |
| ------------------------ | ---------------- | -------------------------------------------- |
| 🟧 **Parcel.js**         | Build & Bundling | ⚡ Zero config, blazing fast                 |
| 🟦 **Vanilla JS ES6+**   | Core Logic       | 🚀 Pure performance, no heavy dependencies   |
| 🟪 **Pug Templates**     | Modular HTML     | 📦 Reusable and maintainable components      |
| 🟩 **SCSS/Sass**         | Advanced Styles  | 🎨 Variables, mixins, scalable architecture  |
| 🔴 **MediaRecorder API** | Recording        | 🎬 Native browser API, maximum compatibility |

### 🌐 **Web APIs Used**

- **🎥 MediaRecorder API**: High-quality video/audio recording
- **🖥️ getDisplayMedia API**: Native screen capture
- **🎤 getUserMedia API**: Professional microphone access

## 🎮 **Getting Started is Super Easy!**

<div align="center">

### 🚀 **Start Recording in 4 Simple Steps**

</div>

```bash
# 1️⃣ Clone this awesome project
git clone https://github.com/cristopher-dev/screenREC-dev.git
cd screenREC-dev

# 2️⃣ Install dependencies (just once)
npm install

# 3️⃣ Launch the development server!
npm start

# 4️⃣ Open your browser at http://localhost:1234 and start recording! 🎬
```

### 🔥 **Want to deploy your own version?**

```bash
# Build for production (fully optimized)
npm run build

# Your app will be ready in the /dist folder!
```

### 📋 **Browser Compatibility**

| Browser        | Minimum Version | Status     |
| -------------- | --------------- | ---------- |
| 🟢 **Chrome**  | 72+             | ✅ Perfect |
| 🟠 **Firefox** | 65+             | ✅ Perfect |
| 🔵 **Safari**  | 13+             | ✅ Perfect |
| 🟣 **Edge**    | 79+             | ✅ Perfect |

> **💡 Tip:** For the best experience, use Chrome or Firefox.

### 📱 **Supported Devices**

- ✅ **Desktop/Laptop**: Full experience
- ❌ **Mobile/Tablet**: Coming soon (recording APIs not yet available on mobile)

## 📁 Project Structure

```
src/
├── index.pug                 # Main entry point
├── js/
│   ├── index.js             # App initialization
│   ├── components/          # Reusable components
│   │   ├── recorder.js      # Screen recording logic
│   │   └── themeToggler.js  # Theme management
│   └── utils/               # Utility functions
│       ├── constants.js     # App constants
│       ├── errorHandler.js  # Error management
│       └── handleMobileUsers.js # Mobile detection
├── scss/
│   ├── index.scss          # Main stylesheet
│   ├── components/         # Component styles
│   └── utils/              # SCSS utilities
├── partials/               # Pug templates
└── images/                 # Static assets
```

## 🏗️ Architecture

### Singleton Pattern

All main components use the Singleton pattern:

```javascript
// Usage example
import ScreenRecorder from './components/recorder';
const recorder = ScreenRecorder.getInstance();
```

### ES6 Modules

Import/export system for modularity:

```javascript
import ScreenRecorder from './components/recorder';
import ThemeToggler from './components/themeToggler';
```

### State Management

Centralized state within each component:

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

## 🎨 Code Conventions

### CSS Classes (BEM-like)

- **Block**: `.sh__component` (sh = ScreenRec)
- **Element**: `.sh__component--element`
- **List**: `.sh__component__list--item`

### JavaScript

- **Constants**: `UPPER_SNAKE_CASE`
- **Variables**: `camelCase`
- **Classes**: `PascalCase`
- **Files**: `camelCase.js`

### Files

- **Pug templates**: `kebab-case.pug`
- **SCSS files**: `kebab-case.scss` with `_` prefix for partials
- **JavaScript**: `camelCase.js`

## 📜 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Format code
npm run format

# Check formatting
npm run check-format

# Check linting
npm run check-lint

# Run all checks
npm test
```

## 🔧 Configuration

### ESLint

The project uses ESLint for linting with Prettier integration.

### Prettier

Automatic code formatting with standard configuration.

### Husky

Git hooks for pre-commit checks.

## 🎯 **Quick Usage Guide**

<div align="center">

### 📖 **Record Like a Pro in 5 Steps!**

</div>

### 🎬 **Recording Process:**

1. **🎯 Select your target**

   - 🖥️ Full screen
   - 🪟 Specific window
   - 🌐 Browser tab

2. **🎵 Configure audio (optional)**

   - 🔊 System audio
   - 🎤 Personal microphone
   - 🎭 Or both for maximum quality!

3. **📝 Name your recording (optional)**

   - Give it a custom name
   - Or let us generate one automatically

4. **🎬 RECORD!**

   - ⏺️ Start your recording
   - ⏸️ Pause when needed
   - ⏹️ Stop when finished

5. **📥 Instant download**
   - The file downloads automatically
   - MP4 format compatible everywhere
   - Ready to share!

---

## 🏆 **Why ScreenREC is the Best Choice**

### 🆚 **Comparison with Competitors:**

| Feature             | ScreenREC         | Other Recorders            |
| ------------------- | ----------------- | -------------------------- |
| **💰 Price**        | ✅ Free Forever   | ❌ Expensive subscriptions |
| **⏱️ Time limit**   | ✅ Unlimited      | ❌ 5-10 minutes            |
| **🚫 Ads**          | ✅ Zero ads       | ❌ Annoying ads            |
| **💧 Watermark**    | ✅ No watermark   | ❌ Annoying logo           |
| **📱 Installation** | ✅ Browser only   | ❌ Heavy software          |
| **🔒 Privacy**      | ✅ 100% local     | ❌ Forced upload           |
| **🎨 Interface**    | ✅ Modern & clean | ❌ Outdated                |
| **🌙 Themes**       | ✅ Light & dark   | ❌ Only one option         |

## 🚀 **Join the ScreenREC Revolution!**

<div align="center">

### 🤝 **Want to Make ScreenREC Even Better?**

[![Contribute](https://img.shields.io/badge/🚀_Contribute-Now-green?style=for-the-badge)](https://github.com/cristopher-dev/screenREC-dev/fork)
[![Issues](https://img.shields.io/badge/🐛_Report_Bug-Here-red?style=for-the-badge)](https://github.com/cristopher-dev/screenREC-dev/issues)
[![Discussions](https://img.shields.io/badge/💬_Discuss_Ideas-Forum-blue?style=for-the-badge)](https://github.com/cristopher-dev/screenREC-dev/discussions)

</div>

### 🎯 **How to Contribute:**

1. **🍴 Fork** the project
2. **🌿 Create** your feature branch: `git checkout -b feature/AmazingFeature`
3. **💻 Develop** your awesome improvement
4. **✅ Commit** your changes: `git commit -m 'Add: AmazingFeature'`
5. **🚀 Push** to the branch: `git push origin feature/AmazingFeature`
6. **🎉 Open** a Pull Request

### 🌟 **Ideas to Contribute:**

- 🎨 New themes and colors
- 🌍 Translation to other languages
- 📱 Mobile device support
- 🎛️ Advanced recording controls
- 🔧 Performance optimizations
- 🧪 Automated tests

### 💡 **Got a great idea?**

Open an [Issue](https://github.com/cristopher-dev/screenREC-dev/issues) and tell us!

---

<div align="center">

## � **Contact & Important Links**

[![GitHub](https://img.shields.io/badge/GitHub-cristopher--dev-black?style=for-the-badge&logo=github)](https://github.com/cristopher-dev)
[![License MIT](https://img.shields.io/badge/📄_License-MIT-green?style=for-the-badge)](LICENSE.md)
[![Security](https://img.shields.io/badge/🔒_Security-Policy-red?style=for-the-badge)](SECURITY.md)
[![Privacy](https://img.shields.io/badge/🛡️_Privacy-Policy-blue?style=for-the-badge)](privacy-policy.md)

### 👨‍💻 **Created with ❤️ by SAGNIK SAHOO**

_Developed during the COVID-19 era to democratize screen recording_

### 🌟 **Did you like ScreenREC?**

<div style="font-size: 1.5em; margin: 20px 0;">

\*\*⭐ Give us a star on GitHub! ⭐

</div>

Your support motivates us to keep improving and maintain ScreenREC free forever.

### 🔗 **Useful Links**

- 🌐 **[Live Demo](https://screenrec.vercel.app)** - Try it now
- 📚 **[Documentation](docs/)** - Detailed guides
- 🐛 **[Report Bugs](https://github.com/cristopher-dev/screenREC-dev/issues)** - Help us improve
- 💬 **[Discussions](https://github.com/cristopher-dev/screenREC-dev/discussions)** - Share ideas
- 🔒 **[Security](SECURITY.md)** - Report vulnerabilities

### 🏆 **Special Thanks**

- 🌍 **The web development community** for amazing APIs
- 🦠 **The COVID-19 era** for teaching us the importance of digital tools
- 👥 **All contributors** who made ScreenREC better
- ⭐ **Every user** who uses and recommends ScreenREC

---

<div style="border: 2px solid #4285f4; border-radius: 10px; padding: 20px; background: linear-gradient(45deg, #f0f8ff, #e6f3ff);">

### 🎉 **Getting Started is Free and Takes Only 30 Seconds!**

**[🚀 GO TO LIVE DEMO 🚀](https://screenrec.vercel.app)**

_No registration required • No limits • No tricks_

</div>

</div>

---

**Made with 💙 for the global community • ScreenREC © 2024 • Powered by modern web APIs**
