<template>
    <div ref="progressBar" class="slider-track" @mousedown="onBarMouseDown">
        <div class="slider-fill" :style="{ width: props.modelValue + '%' }"></div>
        <div class="slider-thumb" :style="{ left: props.modelValue + '%' }" :class="{ dragging: isDragging }"></div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
    modelValue: number,
}>()

const emit = defineEmits<{
    'update:modelValue': [value: number]
    'dragStart': []
    'dragEnd': [value: number]
}>()

const progressBar = ref<HTMLDivElement>()
const isDragging = ref(false)

function getProgressFromEvent(e: MouseEvent | TouchEvent): number {
    const bar = progressBar.value!
    const rect = bar.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    return ratio * 100
}

function onBarMouseDown() {
    isDragging.value = true
    emit('dragStart')
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragEnd)
}

function onDragEnd(e: MouseEvent) {
    if (!isDragging.value) return
    const val = Math.floor(getProgressFromEvent(e))
    emit('update:modelValue', val)
    emit('dragEnd', val)
    isDragging.value = false
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
    if (!isDragging.value) return
    emit('update:modelValue', Math.floor(getProgressFromEvent(e)))
}
</script>

<style lang="css" scoped>
.slider-track {
    position: relative;
    flex: 1;
    height: 4px;
    background: #333;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;
    padding: 8px 0;
    margin: -8px 0;
    box-sizing: content-box;
}

.slider-fill {
    position: absolute;
    top: 8px;
    height: 4px;
    background: #3A86FF;
    border-radius: 2px;
    pointer-events: none;
    transition: width 0.05s linear;
}

.slider-thumb {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    box-shadow: 0 0 6px rgba(58, 134, 255, 0.6);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.slider-track:hover .slider-thumb,
.slider-thumb.dragging {
    transform: translate(-50%, -50%) scale(1.4);
    box-shadow: 0 0 10px rgba(58, 134, 255, 0.9);
}
</style>
