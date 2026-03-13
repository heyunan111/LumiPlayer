import { BrowserWindow, app, protocol } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream, statSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
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
    const url = new URL(request.url);
    const filePath = decodeURIComponent(url.pathname.slice(1));
    try {
      const stat = statSync(filePath);
      const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
      const mime = MIME[ext] ?? "application/octet-stream";
      const totalSize = stat.size;

      const rangeHeader = request.headers.get("range");
      if (rangeHeader) {
        const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
        if (match) {
          const start = parseInt(match[1], 10);
          const end = match[2] ? parseInt(match[2], 10) : totalSize - 1;
          const chunkSize = end - start + 1;
          const stream = createReadStream(filePath, { start, end });
          const nodeStream = stream as any;
          const webStream = new ReadableStream({
            start(controller) {
              nodeStream.on("data", (chunk: Buffer) =>
                controller.enqueue(chunk),
              );
              nodeStream.on("end", () => controller.close());
              nodeStream.on("error", (err: Error) => controller.error(err));
            },
            cancel() {
              nodeStream.destroy();
            },
          });
          return new Response(webStream, {
            status: 206,
            headers: {
              "Content-Type": mime,
              "Content-Range": `bytes ${start}-${end}/${totalSize}`,
              "Content-Length": chunkSize.toString(),
              "Accept-Ranges": "bytes",
            },
          });
        }
      }

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
          "Content-Length": totalSize.toString(),
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

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  return win;
}
