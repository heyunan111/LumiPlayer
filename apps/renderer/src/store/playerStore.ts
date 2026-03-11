import { defineStore } from "pinia";

export type FileType = "video" | "audio";

export interface MediaFile {
  id: string;
  type: FileType;
  path: string;
  name: string;
  size: number; // 文件大小（字节）
  duration?: number; // 时长（秒）
  addedAt: number; // 添加时间戳
}

export const FileExplorerStore = defineStore("FileExplorer", {
  state: () => ({
    files: [] as MediaFile[],
    currentFile: null as MediaFile | null,
    selectedFileId: null as string | null,
  }),

  getters: {
    // 获取所有视频文件
    videoFiles: (state) => state.files.filter((f) => f.type === "video"),

    // 获取所有音频文件
    audioFiles: (state) => state.files.filter((f) => f.type === "audio"),

    // 获取文件总数
    totalFiles: (state) => state.files.length,

    // 获取总大小（字节）
    totalSize: (state) => state.files.reduce((sum, f) => sum + f.size, 0),

    // 获取选中的文件
    selectedFile: (state) =>
      state.files.find((f) => f.id === state.selectedFileId) || null,
  },

  actions: {
    // 添加文件
    addFile(file: Omit<MediaFile, "id" | "addedAt">) {
      const newFile: MediaFile = {
        ...file,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        addedAt: Date.now(),
      };
      this.files.push(newFile);
      return newFile;
    },

    // 批量添加文件
    addFiles(files: Omit<MediaFile, "id" | "addedAt">[]) {
      return files.map((file) => this.addFile(file));
    },

    // 删除文件
    removeFile(fileId: string) {
      const index = this.files.findIndex((f) => f.id === fileId);
      if (index !== -1) {
        this.files.splice(index, 1);
        if (this.selectedFileId === fileId) {
          this.selectedFileId = null;
        }
        if (this.currentFile?.id === fileId) {
          this.currentFile = null;
        }
      }
    },

    // 清空所有文件
    clearFiles() {
      this.files = [];
      this.currentFile = null;
      this.selectedFileId = null;
    },

    // 选择文件
    selectFile(fileId: string) {
      this.selectedFileId = fileId;
    },

    // 设置当前播放文件
    setCurrentFile(fileId: string) {
      const file = this.files.find((f) => f.id === fileId);
      if (file) {
        this.currentFile = file;
      }
    },

    // 更新文件信息
    updateFile(fileId: string, updates: Partial<Omit<MediaFile, "id">>) {
      const file = this.files.find((f) => f.id === fileId);
      if (file) {
        Object.assign(file, updates);
      }
    },

    // 根据路径查找文件
    findByPath(path: string) {
      return this.files.find((f) => f.path === path);
    },
  },
});
