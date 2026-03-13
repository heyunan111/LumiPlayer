<template>
    <div class="FileExplorer">
        <CustomBar />
        <ul class="file-list">
            <li v-for="item in files" :key="item.id" class="file-item"
                :class="{ active: item.id === fileExplorerStore.selectedFileId }" @click="onItemClicked(item.id)">
                <span class="active-bar"></span>

                <span class="file-icon">
                    <svg v-if="item.type === 'video'" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                </span>

                <div class="file-info">
                    <span class="file-name">{{ item.name }}</span>
                    <span class="file-duration">{{ formatDuration(item.duration) }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import CustomBar from './CustomBar.vue'
import { FileExplorerStore } from '../../store/playerStore'

const fileExplorerStore = FileExplorerStore()
const { files } = storeToRefs(fileExplorerStore)

function onItemClicked(id: string) {
    fileExplorerStore.selectFile(id)
    fileExplorerStore.setCurrentFile(id)
}

function formatDuration(seconds?: number): string {
    if (!seconds) return '--:--'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<style lang="css" scoped>
.FileExplorer {
    display: flex;
    flex-direction: column;
    background: #111;
    height: 100%;
    overflow: hidden;
    border-left: 1px solid rgba(255, 255, 255, 0.06);
}

.file-list {
    list-style: none;
    padding: 8px 0;
    margin: 0;
    overflow-y: auto;
    flex: 1;
}

.file-list::-webkit-scrollbar {
    width: 4px;
}

.file-list::-webkit-scrollbar-track {
    background: transparent;
}

.file-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 2px;
}

.file-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 14px 9px 16px;
    cursor: pointer;
    position: relative;
    transition: background 0.15s ease;
    user-select: none;
}

.file-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.active-bar {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 60%;
    border-radius: 1px;
    background: transparent;
    transition: background 0.2s ease;
}

.file-item.active .active-bar {
    background: #3A86FF;
}

.file-icon {
    color: rgba(255, 255, 255, 0.35);
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.file-item.active .file-icon {
    color: #3A86FF;
}

.file-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.file-name {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
}

.file-item.active .file-name {
    color: #fff;
    font-weight: 500;
}

.file-duration {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.3);
}
</style>
