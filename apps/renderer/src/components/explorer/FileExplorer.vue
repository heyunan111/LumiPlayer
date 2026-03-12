<template>
    <div>
        <CustomBar></CustomBar>
    </div>
    <div class="FileExplorer">
        <ul class="clickable-list">
            <li v-for="item in files" :key="item.id" class="list-item">
                {{ item.name }} - {{ item.duration }}s
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import CustomBar from './CustomBar.vue';
import { FileExplorerStore } from '../../store/playerStore';

const fileExplorerStore = FileExplorerStore();
const { files } = storeToRefs(fileExplorerStore);
</script>

<style lang="css" scoped>
.FileExplorer {
    display: flex;
    flex-direction: column;
    background-color: rgb(43, 45, 51);
    color: white;
    height: 100vh;
    padding: 20px;
}

.clickable-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.list-item {
    color: black;
    padding: 12px 20px;
    margin: 8px 0;
    background: #f5f5f5;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
}

.list-item:hover {
    background: #e8e8e8;
    transform: translateX(4px);
}

.list-item:active {
    transform: scale(0.98) translateX(4px);
    background: #d8d8d8;
}
</style>
