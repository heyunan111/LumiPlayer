import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

// 暴露数据库测试 API
contextBridge.exposeInMainWorld('testApi', {
  createUser: (name: string, email: string, age?: number) => 
    ipcRenderer.invoke('test:createUser', name, email, age),
  
  getUsers: () => 
    ipcRenderer.invoke('test:getUsers'),
  
  getUserById: (id: number) => 
    ipcRenderer.invoke('test:getUserById', id),
  
  updateUser: (id: number, name?: string, age?: number) => 
    ipcRenderer.invoke('test:updateUser', id, name, age),
  
  deleteUser: (id: number) => 
    ipcRenderer.invoke('test:deleteUser', id)
})
