import ScreenRecorder from "./components/recorder";
import ThemeToggler from "./components/themeToggler";
import { handleMobileUsers } from "./utils/handleMobileUsers";

window.addEventListener("load", () => handleMobileUsers());

const screenRec = {};
//instance
screenRec.recorder = ScreenRecorder.getInstance();
screenRec.theme = ThemeToggler.getInstance();
// init
screenRec.recorder.init();
screenRec.theme.init();
