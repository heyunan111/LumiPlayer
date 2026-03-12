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
  openFileDialog: async (): Promise<string> => {
    return await window.ipcRenderer.invoke("native:openFileDialog");
  },

  getFileSize: async (filePath: string): Promise<number> => {
    return await window.ipcRenderer.invoke("native:getFileSize", filePath);
  },
};

// 通过 HTMLMediaElement 获取媒体时长（秒），在 renderer 进程中调用
export function getMediaDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const media = document.createElement("video");
    media.preload = "metadata";
    media.src = `localfile://${filePath.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1%3A")}`;
    media.onloadedmetadata = () => {
      resolve(media.duration);
      media.src = "";
    };
    media.onerror = () => reject(new Error("Failed to load media metadata"));
  });
}
