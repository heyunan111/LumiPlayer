// Native C++ API 接口

// 声明 window 上的 ipcRenderer（扩展已有类型）
declare global {
  interface Window {
    ipcRenderer: {
      on(channel: string, listener: (event: any, ...args: any[]) => void): void;
      off(channel: string, ...args: any[]): void;
      send(channel: string, ...args: any[]): void;
      invoke(channel: string, ...args: any[]): Promise<any>;
    };
  }
}

export const nativeApi = {
  // Hello World
  sayHello: async (): Promise<string> => {
    return await window.ipcRenderer.invoke("native:sayHello");
  },

  // 问候函数
  greet: async (name: string): Promise<string> => {
    return await window.ipcRenderer.invoke("native:greet", name);
  },

  // 加法函数
  add: async (a: number, b: number): Promise<number> => {
    return await window.ipcRenderer.invoke("native:add", a, b);
  },
};
