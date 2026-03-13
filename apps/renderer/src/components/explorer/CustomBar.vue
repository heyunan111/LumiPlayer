<template>
    <div class="CustomBar">
        <button class="bar-btn" @click="onAddFileClicked" title="添加文件">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
        <button class="bar-btn" @click="onRemoveFileClicked" title="删除所选文件">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { nativeApi, getMediaDuration } from '../../api/native'
import { FileExplorerStore, FileType } from '../../store/playerStore'

const fileExplorerStore = FileExplorerStore()

function getFileType(path: string): FileType {
    const ext = path.split('.').pop()?.toLowerCase()
    const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg']
    return audioExts.includes(ext ?? '') ? 'audio' : 'video'
}

async function openFile() {
    const filePath = await nativeApi.openFileDialog()
    if (!filePath) return
    const fileName = filePath.split(/[\\/]/).pop() ?? filePath
    const [size, duration] = await Promise.all([
        nativeApi.getFileSize(filePath),
        getMediaDuration(filePath),
    ])
    fileExplorerStore.addFile({ type: getFileType(filePath), path: filePath, name: fileName, size, duration })
}

function onAddFileClicked() { openFile() }
function onRemoveFileClicked() {
    if (fileExplorerStore.selectedFileId)
        fileExplorerStore.removeFile(fileExplorerStore.selectedFileId)
}
</script>

<style lang="css" scoped>
.CustomBar {
    display: flex;
    align-items: center;
    background: #0d0d0d;
    height: 36px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 0 4px;
    gap: 2px;
    flex-shrink: 0;
}

.bar-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, color 0.15s ease;
}

.bar-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
}

.bar-btn:active {
    background: rgba(255, 255, 255, 0.14);
}
</style>
