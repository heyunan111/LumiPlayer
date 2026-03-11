<template>
    <div class="ProgressBar">
        <button class="nav-btn prev">
            <span class="arrow">←</span>
        </button>

        <div class="progress-bar">
            <div class="progress-fill" :style="{ width: percentage + '%' }">
            </div>

        </div>
        <div class="progress-text-container">
            <span class="progress-text">{{ percentage }}%</span>
        </div>
        <button class="nav-btn next">
            <span class="arrow">→</span>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    // 当前进度 (0-100)
    percentage: {
        type: Number,
        default: 0,
        validator: (value) => value >= 0 && value <= 100
    },

})

const barStyle = computed(() => ({
    width: props.percentage + '%',
    backgroundColor: props.color,
    height: '100%',
    borderRadius: 'inherit',
    transition: props.animated ? 'width 0.3s ease' : 'none',
    position: 'relative'
}))
</script>

<style scoped>
.ProgressBar {
    background-color: rgb(31, 31, 31);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 10px;
}

.nav-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
}

.nav-btn:hover {
    opacity: 0.8;
}

.nav-btn:active {
    opacity: 0.6;
}

.progress-bar {
    background-color: rgb(78,
            78,
            78);
    border-radius: 100px;
    overflow: hidden;
    height: 5px;
    position: relative;
    flex: 1;
    min-width: 100px;
}

.progress-fill {
    background-color: rgb(44, 44, 226);
    height: 100%;
    border-radius: 100px;
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.progress-text-container {
    min-width: 40px;
    display: flex;
    justify-content: center;
}

.progress-text {
    color: white;
    font-size: 12px;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}
</style>