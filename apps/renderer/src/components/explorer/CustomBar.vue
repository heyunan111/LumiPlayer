<template>
    <div class="CustomBar">
        <button @click="onAddFileClicked" title="添加文件">+</button>
        <button @click="onRemoveFileClicked" title="删除所选文件">-</button>
    </div>
</template>
<script setup lang="ts">

import { nativeApi, getMediaDuration } from '../../api/native';
import { FileExplorerStore, FileType } from '../../store/playerStore';

const fileExplorerStore = FileExplorerStore();

function getFileType(path: string): FileType {
    const ext = path.split('.').pop()?.toLowerCase();
    const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg'];
    return audioExts.includes(ext ?? '') ? 'audio' : 'video';
}

const openFile = async () => {
    const filePath = await nativeApi.openFileDialog();
    if (!filePath) return;
    const fileName = filePath.split(/[\\/]/).pop() ?? filePath;
    const [size, duration] = await Promise.all([
        nativeApi.getFileSize(filePath),
        getMediaDuration(filePath),
    ]);
    fileExplorerStore.addFile({
        type: getFileType(filePath),
        path: filePath,
        name: fileName,
        size,
        duration,
    });
}


function onAddFileClicked() {
    console.log("onAddFileClicked");
    openFile();
}

function onRemoveFileClicked() {
    console.log("onRemoveFileClicked");

}

</script>

<style lang="css" scoped>
.CustomBar {
    display: flex;
    background-color: rgb(25, 25, 25);
    height: 32px;
}

.CustomBar button {
    flex: 1;
    border: none;
    background-color: transparent;
    color: white;
    cursor: pointer;
}

.CustomBar button:hover {
    background-color: rgb(50, 50, 50);
}
</style>