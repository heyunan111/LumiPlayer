<template>
    <div class="Home">

        <div class="Player">

            <Player />
            <ProgressBar />
            <ControlBar />

        </div>
        <div class="FileExplorer">
            <FileExplorer />
        </div>
    </div>
</template>

<script setup lang="ts">
import FileExplorer from '../components/explorer/FileExplorer.vue';
import ControlBar from '../components/player/ControlBar.vue';
import Player from '../components/player/Player.vue';
import ProgressBar from '../components/player/ProgressBar.vue';
</script>

<style lang="css" scoped>
.Home {
    display: flex;
    justify-content: space-around;
}

.Player {
    display: flex;
    flex-direction: column;
}
</style>