<template>
  <Home></Home>
</template>

<script lang="ts" setup>
import Home from './views/Home.vue';
import { onMounted } from 'vue';
import { FileExplorerStore } from './store/playerStore';

let fileExplorerStore = FileExplorerStore()

onMounted(async () => {
  await fileExplorerStore.init();
})

</script>

<style lang="css" scoped></style>