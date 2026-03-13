<template>
    <div class="Player">
        <template v-if="fileExplorerStore.selectedFileId == null">
            <div class="empty-state">
                <img src="/LumiPlayer.png" class="logo" alt="LumiPlayer" />
                <p class="empty-hint">选择文件开始播放</p>
            </div>
        </template>
        <template v-else>
            <video v-if="selectedFile?.type === 'video'" ref="mediaEl" :src="mediaSrc" @timeupdate="onTimeUpdate"
                @loadedmetadata="onLoadedMetadata" @ended="onEnded" />
            <div v-else class="audio-view">
                <div class="audio-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(58,134,255,0.7)"
                        stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                </div>
                <p class="audio-title">{{ selectedFile?.name }}</p>
                <audio ref="mediaEl" :src="mediaSrc" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
                    @ended="onEnded" />
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { PlayerContextStore, FileExplorerStore } from '../../store/playerStore'

const fileExplorerStore = FileExplorerStore()
const playerContextStore = PlayerContextStore()
const selectedFile = computed(() => fileExplorerStore.selectedFile)
const mediaEl = ref<HTMLVideoElement | HTMLAudioElement | null>(null)

const mediaSrc = computed(() => {
    if (!selectedFile.value) return ''
    return `localfile://local/${encodeURIComponent(selectedFile.value.path)}`
})

function onTimeUpdate() {
    if (mediaEl.value) playerContextStore.setCurrentTime(mediaEl.value.currentTime)
}
function onLoadedMetadata() {
    if (mediaEl.value) {
        playerContextStore.setDuration(mediaEl.value.duration)
        playerContextStore.setCurrentTime(0)
        playerContextStore.setIsPause(false)
    }
}
function onEnded() { playerContextStore.setIsPause(true) }

watch(() => playerContextStore.isPause, (isPause) => {
    if (mediaEl.value) isPause ? mediaEl.value.pause() : mediaEl.value.play()
})
watch(() => playerContextStore.volume, (vol) => {
    if (mediaEl.value) mediaEl.value.volume = vol
})
watch(() => playerContextStore.progress, (val) => {
    if (mediaEl.value && playerContextStore.duration > 0) {
        const target = (val / 100) * playerContextStore.duration
        if (Math.abs(mediaEl.value.currentTime - target) > 0.5)
            mediaEl.value.currentTime = target
    }
})
</script>

<style lang="css" scoped>
.Player {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    overflow: hidden;
    min-height: 0;
}

video {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    opacity: 0.5;
}

.logo {
    width: 80px;
    height: 80px;
    object-fit: contain;
    filter: drop-shadow(0 0 20px rgba(58, 134, 255, 0.3));
}

.empty-hint {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
    letter-spacing: 0.05em;
}

.audio-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.audio-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(58, 134, 255, 0.08);
    border: 1px solid rgba(58, 134, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.audio-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    max-width: 260px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
