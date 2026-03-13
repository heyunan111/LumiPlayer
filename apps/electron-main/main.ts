import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import createWindow, {
  registerLocalFileProtocol,
  handleLocalFileProtocol,
} from "./window/createWindow";
import path from "node:path";

import { registerNativeIpc } from "./ipc/nativeIpc";

registerLocalFileProtocol();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(async () => {
  handleLocalFileProtocol();
  registerNativeIpc();
  createWindow();
});
