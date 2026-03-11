<template>
    <div>
        <CustomBar></CustomBar>
    </div>
    <div class="FileExplorer">
        <!-- C++ 测试区域 -->
        <div class="cpp-test">
            <h3>C++ Native Addon 测试</h3>
            <div class="test-item">
                <strong>sayHello():</strong> {{ cppMessage }}
            </div>
            <div class="test-item">
                <strong>greet('LumiPlayer'):</strong> {{ cppGreeting }}
            </div>
            <div class="test-item">
                <strong>add(42, 58):</strong> {{ cppSum }}
            </div>
        </div>

        <!-- 文件列表 -->
        <ul class="clickable-list">
            <li v-for="item in files" :key="item.id" class="list-item">
                {{ item.name }} - {{ item.duration }}s
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import CustomBar from './CustomBar.vue';
import { FileExplorerStore } from '../../store/playerStore';
import { nativeApi } from '../../api/native';

const fileExplorerStore = FileExplorerStore();

// 测试数据
fileExplorerStore.addFile({
    type: 'video',
    path: '/path/to/video.mp4',
    name: 'video.mp4',
    size: 1024000,
    duration: 120
});

const { files } = storeToRefs(fileExplorerStore);

// C++ 测试
const cppMessage = ref<string>('');
const cppGreeting = ref<string>('');
const cppSum = ref<number>(0);

// 调用 C++ Hello World
const testCppHello = async () => {
    try {
        cppMessage.value = await nativeApi.sayHello();
        console.log('C++ says:', cppMessage.value);
    } catch (error) {
        console.error('Failed to call C++:', error);
        cppMessage.value = 'Error: ' + error;
    }
};

// 调用 C++ Greet
const testCppGreet = async () => {
    try {
        cppGreeting.value = await nativeApi.greet('LumiPlayer');
        console.log('C++ greets:', cppGreeting.value);
    } catch (error) {
        console.error('Failed to call C++:', error);
    }
};

// 调用 C++ Add
const testCppAdd = async () => {
    try {
        cppSum.value = await nativeApi.add(42, 58);
        console.log('C++ calculates:', cppSum.value);
    } catch (error) {
        console.error('Failed to call C++:', error);
    }
};

// 页面加载时自动测试
testCppHello();
testCppGreet();
testCppAdd();

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

.cpp-test {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.cpp-test h3 {
    margin-top: 0;
    color: #4CAF50;
}

.test-item {
    margin: 10px 0;
    padding: 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}

.test-item strong {
    color: #64B5F6;
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