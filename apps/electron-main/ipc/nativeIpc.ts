import { ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { existsSync, statSync } from "fs";
import type { MediaFile } from "../../renderer/src/store/playerStore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let addon: any;
try {
  const possiblePaths = [
    path.join(__dirname, "../../../native/build/Release/addon.node"),
    path.join(__dirname, "../../native/build/Release/addon.node"),
    path.join(process.cwd(), "native/build/Release/addon.node"),
  ];

  let addonPath: string | null = null;
  for (const p of possiblePaths) {
    if (existsSync(p)) {
      addonPath = p;
      break;
    }
  }

  if (!addonPath) throw new Error("addon.node not found");
  addon = require(addonPath);
} catch (error: any) {
  console.error("Failed to load native addon:", error.message);
}

export function registerNativeIpc() {
  ipcMain.handle("native:openFileDialog", () => {
    if (!addon) throw new Error("Native addon not loaded");
    return addon.openFileDialog();
  });

  ipcMain.handle("native:getFileSize", (_event, filePath: string) => {
    const { size } = statSync(filePath);
    return size;
  });

  ipcMain.handle("native:dbInsert", (_event, mediaFile: MediaFile) => {
    if (!addon) throw new Error("Native addon not loaded");
    return addon.dbInsert(mediaFile);
  });

  ipcMain.handle("native:dbRemove", (_event, id: string) => {
    if (!addon) throw new Error("Native addon not loaded");
    return addon.dbRemove(id);
  });

  ipcMain.handle("native:dbGetAll", () => {
    if (!addon) throw new Error("Native addon not loaded");
    return addon.dbGetAll() as MediaFile[];
  });
}
