<template>
    <div class="Home">
        <div class="player-panel">
            <Player />
            <ProgressBar />
            <ControlBar />
        </div>
        <div class="sidebar">
            <FileExplorer />
        </div>
    </div>
</template>

<script setup lang="ts">
import FileExplorer from '../components/explorer/FileExplorer.vue'
import ControlBar from '../components/player/ControlBar.vue'
import Player from '../components/player/Player.vue'
import ProgressBar from '../components/player/ProgressBar.vue'
</script>

<style lang="css" scoped>
.Home {
    display: flex;
    width: 100%;
    height: 100vh;
    background: #0a0a0a;
    overflow: hidden;
}

.player-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
}

.sidebar {
    width: 240px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
