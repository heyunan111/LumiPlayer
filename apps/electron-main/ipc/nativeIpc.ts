import { ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// 加载 Native Addon
let addon: any;
try {
  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(__dirname, "../../../native/build/Release/addon.node"),
    path.join(__dirname, "../../../native/build/addon.node"),
    path.join(__dirname, "../../native/build/Release/addon.node"),
    path.join(__dirname, "../../native/build/addon.node"),
    path.join(process.cwd(), "native/build/Release/addon.node"),
    path.join(process.cwd(), "native/build/addon.node"),
  ];

  console.log("🔍 Searching for native addon...");
  console.log("__dirname:", __dirname);
  console.log("process.cwd():", process.cwd());

  let addonPath: string | null = null;
  for (const p of possiblePaths) {
    if (existsSync(p)) {
      addonPath = p;
      console.log(`✅ Found at: ${p}`);
      break;
    }
  }

  if (!addonPath) {
    throw new Error("addon.node not found in any expected location");
  }

  console.log("📦 Attempting to load addon...");
  addon = require(addonPath);
  console.log("✅ Native addon loaded successfully");
  console.log("Available functions:", Object.keys(addon));
} catch (error: any) {
  console.error("❌ Failed to load native addon:");
  console.error("Error name:", error.name);
  console.error("Error message:", error.message);
  console.error("Error stack:", error.stack);
  console.error("\n⚠️  Please rebuild the addon:");
  console.error("  cd native && npm run build:gyp");
}

// 注册 IPC 处理器
export function registerNativeIpc() {
  // Hello World
  ipcMain.handle("native:sayHello", () => {
    if (!addon) throw new Error("Native addon not loaded");
    return addon.sayHello();
  });

  // 问候函数
  ipcMain.handle("native:greet", (_event, name: string) => {
    if (!addon) throw new Error("Native addon not loaded");
    return addon.greet(name);
  });

  // 加法函数
  ipcMain.handle("native:add", (_event, a: number, b: number) => {
    if (!addon) throw new Error("Native addon not loaded");
    return addon.add(a, b);
  });

  console.log("✅ Native IPC handlers registered");
}
