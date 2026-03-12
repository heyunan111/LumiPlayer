import { BrowserWindow, app, protocol, net } from "electron";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createReadStream, statSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 定义路径变量
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
// 使用 app.getAppPath() 获取应用根目录
const APP_ROOT = app.getAppPath();
const RENDERER_DIST = path.join(APP_ROOT, "dist-electron");
const VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

export function registerLocalFileProtocol() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "localfile",
      privileges: { secure: true, supportFetchAPI: true, stream: true },
    },
  ]);
}

const MIME: Record<string, string> = {
  mp4: "video/mp4",
  mkv: "video/x-matroska",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  flac: "audio/flac",
  aac: "audio/aac",
};

export function handleLocalFileProtocol() {
  protocol.handle("localfile", (request) => {
    const raw = decodeURIComponent(request.url.slice("localfile://".length));
    console.log("[localfile] url:", request.url, "raw:", raw);
    const filePath = raw.replace(/\//g, "\\");
    console.log("[localfile] filePath:", filePath);
    try {
      const stat = statSync(filePath);
      const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
      const mime = MIME[ext] ?? "application/octet-stream";
      const stream = createReadStream(filePath);
      const nodeStream = stream as any;
      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
          nodeStream.on("end", () => controller.close());
          nodeStream.on("error", (err: Error) => controller.error(err));
        },
        cancel() {
          nodeStream.destroy();
        },
      });
      return new Response(webStream, {
        status: 200,
        headers: {
          "Content-Type": mime,
          "Content-Length": stat.size.toString(),
          "Accept-Ranges": "bytes",
        },
      });
    } catch (e) {
      console.error("localfile protocol error:", e);
      return new Response("Not found", { status: 404 });
    }
  });
}

export default function createWindow() {
  const iconPath = path.join(VITE_PUBLIC, "logo.ico");

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    // 开发模式下打开开发者工具
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  return win;
}
