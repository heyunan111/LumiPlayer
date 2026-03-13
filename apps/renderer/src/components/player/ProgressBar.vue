<template>
    <div class="ProgressBar">
        <button class="nav-btn" @click="onPrev" title="上一首">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
            </svg>
        </button>

        <Slider class="progress-slider" v-model="progress" @dragStart="onDragStart" @dragEnd="onDragEnd" />

        <span class="time-display">{{ formatTime(playerContextStore.currentTime) }} / {{
            formatTime(playerContextStore.duration) }}</span>

        <button class="nav-btn" @click="onNext" title="下一首">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Slider from './Slider.vue'
import { PlayerContextStore, FileExplorerStore } from '../../store/playerStore'

const playerContextStore = PlayerContextStore()
const fileExplorerStore = FileExplorerStore()

const progress = ref(0)
let isSeeking = false

watch(progress, (val) => {
    if (isSeeking) playerContextStore.setProgress(val)
})

watch(() => playerContextStore.progress, (val) => {
    if (!isSeeking) progress.value = val
})

function onDragStart() { isSeeking = true }
function onDragEnd(val: number) {
    playerContextStore.setProgress(val)
    isSeeking = false
}

watch(() => fileExplorerStore.selectedFileId, (id) => {
    if (!id) return
    progress.value = 0
    const file = fileExplorerStore.getFile(id)
    if (file) {
        playerContextStore.setType(file.type)
        playerContextStore.setProgress(0)
        playerContextStore.setCurrentTime(0)
        if (file.duration) playerContextStore.setDuration(file.duration)
        playerContextStore.setIsPause(true)
    }
})

function onPrev() {
    const files = fileExplorerStore.files
    const idx = files.findIndex(f => f.id === fileExplorerStore.selectedFileId)
    if (idx > 0) fileExplorerStore.selectFile(files[idx - 1].id)
}

function onNext() {
    const files = fileExplorerStore.files
    const idx = files.findIndex(f => f.id === fileExplorerStore.selectedFileId)
    if (idx < files.length - 1) fileExplorerStore.selectFile(files[idx + 1].id)
}

function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.ProgressBar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    height: 44px;
    background: rgba(14, 14, 14, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease, background 0.2s ease;
    flex-shrink: 0;
}

.nav-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
}

.nav-btn:active {
    background: rgba(255, 255, 255, 0.14);
}

.progress-slider {
    flex: 1;
    min-width: 60px;
}

.time-display {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
    color: #888;
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.03em;
}
</style>
