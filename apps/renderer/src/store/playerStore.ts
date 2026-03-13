import { defineStore } from "pinia";
import { nativeApi } from "../api/native";

export type FileType = "video" | "audio";

export interface MediaFile {
  id: string;
  type: FileType;
  path: string;
  name: string;
  size: number;
  duration?: number;
  addedAt: number;
}

export const FileExplorerStore = defineStore("FileExplorer", {
  state: () => ({
    files: [] as MediaFile[],
    currentFile: null as MediaFile | null,
    selectedFileId: null as string | null,
  }),

  getters: {
    selectedFile: (state) =>
      state.files.find((f) => f.id === state.selectedFileId) || null,
    getFile: (state) => (id: string) => {
      return state.files.find((f) => f.id === id) || null;
    },
  },

  actions: {
    async init() {
      this.files = await nativeApi.dbGetAll();
    },

    async addFile(file: Omit<MediaFile, "id" | "addedAt">) {
      const newFile: MediaFile = {
        ...file,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        addedAt: Date.now(),
      };
      this.files.push(newFile);
      await nativeApi.dbInsert(newFile);
      return newFile;
    },

    async removeFile(fileId: string) {
      const index = this.files.findIndex((f) => f.id === fileId);
      if (index !== -1) {
        this.files.splice(index, 1);
        await nativeApi.dbRemove(fileId);
        if (this.selectedFileId === fileId) {
          this.selectedFileId = null;
        }
        if (this.currentFile?.id === fileId) {
          this.currentFile = null;
        }
      }
    },

    async clearFiles() {
      await Promise.all(this.files.map((f) => nativeApi.dbRemove(f.id)));
      this.files = [];
      this.currentFile = null;
      this.selectedFileId = null;
    },

    selectFile(fileId: string) {
      this.selectedFileId = fileId;
    },

    setCurrentFile(fileId: string) {
      const file = this.files.find((f) => f.id === fileId);
      if (file) {
        this.currentFile = file;
      }
    },
  },
});

export interface PlayerContext {
  type: FileType;
  progress: number;
  currentTime: number;
  duration: number;
  isPause: boolean;
  volume: number;
}

export const PlayerContextStore = defineStore("PlayerContext", {
  state: () => ({
    playerContext: {
      type: "audio" as FileType,
      progress: 0,
      currentTime: 0,
      duration: 0,
      isPause: true,
      volume: 0.3,
    } as PlayerContext,
  }),

  getters: {
    type: (state) => state.playerContext.type,
    progress: (state) => state.playerContext.progress,
    currentTime: (state) => state.playerContext.currentTime,
    duration: (state) => state.playerContext.duration,
    isPause: (state) => state.playerContext.isPause,
    volume: (state) => state.playerContext.volume,
  },

  actions: {
    setType(type: FileType) {
      this.playerContext.type = type;
    },
    setProgress(progress: number) {
      this.playerContext.progress = Math.min(100, Math.max(0, progress));
    },
    setCurrentTime(currentTime: number) {
      this.playerContext.currentTime = currentTime;
      if (this.playerContext.duration > 0) {
        this.playerContext.progress =
          (currentTime / this.playerContext.duration) * 100;
      }
    },
    setDuration(duration: number) {
      this.playerContext.duration = duration;
    },
    setIsPause(isPause: boolean) {
      this.playerContext.isPause = isPause;
    },
    setVolume(volume: number) {
      this.playerContext.volume = volume;
    },
  },
});
