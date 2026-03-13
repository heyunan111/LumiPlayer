<template>
    <div class="ControlBar">
        <button class="play-btn" @click="onPlayClicked" :title="playerContextStore.isPause ? '播放' : '暂停'">
            <svg v-if="playerContextStore.isPause" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
        </button>

        <div class="volume-group">
            <button class="icon-btn" @click="toggleMute" :title="isMuted ? '取消静音' : '静音'">
                <svg v-if="!isMuted && volumeLevel > 0.5" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <svg v-else-if="!isMuted && volumeLevel > 0" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
            </button>

            <Slider v-model="volumeDisplay" class="volume-slider" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Slider from './Slider.vue'
import { PlayerContextStore } from '../../store/playerStore'

const playerContextStore = PlayerContextStore()

const volumeDisplay = ref(Math.round(playerContextStore.volume * 100))
const isMuted = ref(false)
let volumeBeforeMute = playerContextStore.volume

const volumeLevel = computed(() => playerContextStore.volume)

watch(volumeDisplay, (val) => {
    const v = val / 100
    playerContextStore.setVolume(v)
    if (v > 0) isMuted.value = false
})

watch(() => playerContextStore.volume, (val) => {
    volumeDisplay.value = Math.round(val * 100)
})

function onPlayClicked() {
    playerContextStore.setIsPause(!playerContextStore.isPause)
}

function toggleMute() {
    if (isMuted.value) {
        isMuted.value = false
        playerContextStore.setVolume(volumeBeforeMute || 0.3)
    } else {
        volumeBeforeMute = playerContextStore.volume
        isMuted.value = true
        playerContextStore.setVolume(0)
    }
}
</script>

<style lang="css" scoped>
.ControlBar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    height: 60px;
    background: rgba(14, 14, 14, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.play-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, transform 0.15s ease;
    flex-shrink: 0;
}

.play-btn:hover {
    background: rgba(58, 134, 255, 0.25);
    transform: scale(1.08);
}

.play-btn:active {
    transform: scale(0.95);
    background: rgba(58, 134, 255, 0.4);
}

.volume-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    max-width: 200px;
}

.icon-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease, background 0.2s ease;
    flex-shrink: 0;
}

.icon-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
}

.volume-slider {
    flex: 1;
}
</style>
