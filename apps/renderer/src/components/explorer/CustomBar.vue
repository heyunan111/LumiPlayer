<template>
    <div class="CustomBar">
        <button title="添加文件">+</button>
        <button title="删除所选文件">-</button>
    </div>
</template>
<script setup lang="ts">

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