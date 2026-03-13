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

import { MediaFile } from "../store/playerStore";

export const nativeApi = {
  openFileDialog: async (): Promise<string> => {
    return await window.ipcRenderer.invoke("native:openFileDialog");
  },

  getFileSize: async (filePath: string): Promise<number> => {
    return await window.ipcRenderer.invoke("native:getFileSize", filePath);
  },

  dbInsert: async (file: MediaFile) => {
    return await window.ipcRenderer.invoke("native:dbInsert", file);
  },
  dbRemove: async (id: string) => {
    return await window.ipcRenderer.invoke("native:dbRemove", id);
  },
  dbGetAll: async (): Promise<MediaFile[]> => {
    return await window.ipcRenderer.invoke("native:dbGetAll");
  },
};

export function getMediaDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const media = document.createElement("video");
    media.preload = "metadata";
    media.src = `localfile://local/${encodeURIComponent(filePath)}`;
    media.onloadedmetadata = () => {
      resolve(media.duration);
      media.src = "";
    };
    media.onerror = () => reject(new Error("Failed to load media metadata"));
  });
}
