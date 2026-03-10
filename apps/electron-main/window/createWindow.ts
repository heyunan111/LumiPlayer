
import { BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 定义路径变量
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const APP_ROOT = path.join(__dirname, '../..')
const RENDERER_DIST = path.join(APP_ROOT, 'dist-electron')
const VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

export default function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    // 开发模式下打开开发者工具
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  return win
}