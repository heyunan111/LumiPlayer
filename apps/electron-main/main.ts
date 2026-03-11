import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import createWindow from "./window/createWindow";
import path from "node:path";

// 在导入 IPC 之前设置数据库路径
const dbPath = path.join(app.getPath("userData"), "dev.db");
process.env.DATABASE_URL = `file:${dbPath}`;

import "./ipc/testIpc";
import { registerNativeIpc } from "./ipc/nativeIpc";

// 初始化数据库
async function initDatabase() {
  const { getPrisma } = await import("../../packages/database/db");
  const prisma = getPrisma();

  // 创建表（如果不存在）
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER
    )
  `);

  console.log("Database initialized");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(async () => {
  await initDatabase();
  registerNativeIpc(); // 注册 Native IPC
  createWindow();
});
