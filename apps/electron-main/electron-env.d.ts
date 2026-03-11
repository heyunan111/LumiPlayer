/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_DEV_SERVER_URL: string
  }
}

// 为 window 对象添加类型定义
interface Window {
  ipcRenderer: {
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => void
    off: (channel: string, ...args: any[]) => void
    send: (channel: string, ...args: any[]) => void
    invoke: (channel: string, ...args: any[]) => Promise<any>
  }
  testApi: {
    createUser: (name: string, email: string, age?: number) => Promise<any>
    getUsers: () => Promise<any[]>
    getUserById: (id: number) => Promise<any>
    updateUser: (id: number, name?: string, age?: number) => Promise<any>
    deleteUser: (id: number) => Promise<void>
  }
}
