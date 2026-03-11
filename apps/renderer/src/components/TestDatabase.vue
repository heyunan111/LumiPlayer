<template>
    <div class="test-container">
        <h2>数据库测试</h2>

        <div class="section">
            <h3>创建用户</h3>
            <input v-model="newUser.name" placeholder="姓名" />
            <input v-model="newUser.email" placeholder="邮箱" />
            <input v-model.number="newUser.age" type="number" placeholder="年龄" />
            <button @click="createUser">创建</button>
        </div>

        <div class="section">
            <h3>用户列表</h3>
            <button @click="loadUsers">刷新列表</button>
            <ul v-if="users.length > 0">
                <li v-for="user in users" :key="user.id">
                    <span>{{ user.id }}. {{ user.name }} - {{ user.email }} - {{ user.age }}岁</span>
                    <button @click="updateUserAge(user.id)">+1岁</button>
                    <button @click="deleteUser(user.id)">删除</button>
                </li>
            </ul>
            <p v-else>暂无用户</p>
        </div>

        <div class="section" v-if="message">
            <p :class="messageType">{{ message }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const users = ref<any[]>([])
const newUser = ref({
    name: '',
    email: '',
    age: undefined as number | undefined
})
const message = ref('')
const messageType = ref('success')

async function createUser() {
    try {
        if (!newUser.value.name || !newUser.value.email) {
            showMessage('请填写姓名和邮箱', 'error')
            return
        }

        await window.testApi.createUser(
            newUser.value.name,
            newUser.value.email,
            newUser.value.age
        )

        showMessage('创建成功！', 'success')
        newUser.value = { name: '', email: '', age: undefined }
        await loadUsers()
    } catch (error: any) {
        showMessage('创建失败: ' + error.message, 'error')
    }
}

async function loadUsers() {
    try {
        users.value = await window.testApi.getUsers()
        showMessage(`加载了 ${users.value.length} 个用户`, 'success')
    } catch (error: any) {
        showMessage('加载失败: ' + error.message, 'error')
    }
}

async function updateUserAge(id: number) {
    try {
        const user = users.value.find(u => u.id === id)
        if (user) {
            await window.testApi.updateUser(id, undefined, (user.age || 0) + 1)
            showMessage('更新成功！', 'success')
            await loadUsers()
        }
    } catch (error: any) {
        showMessage('更新失败: ' + error.message, 'error')
    }
}

async function deleteUser(id: number) {
    try {
        await window.testApi.deleteUser(id)
        showMessage('删除成功！', 'success')
        await loadUsers()
    } catch (error: any) {
        showMessage('删除失败: ' + error.message, 'error')
    }
}

function showMessage(msg: string, type: 'success' | 'error') {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

onMounted(() => {
    loadUsers()
})
</script>

<style scoped>
.test-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

h2 {
    color: #333;
    margin-bottom: 20px;
}

.section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
}

h3 {
    margin-top: 0;
    color: #666;
}

input {
    padding: 8px 12px;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

button {
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 5px;
}

button:hover {
    background: #45a049;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 10px;
    margin: 10px 0;
    background: white;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

li button {
    background: #2196F3;
    padding: 5px 10px;
    font-size: 12px;
}

li button:last-child {
    background: #f44336;
}

li button:hover {
    opacity: 0.8;
}

.success {
    color: #4CAF50;
    font-weight: bold;
}

.error {
    color: #f44336;
    font-weight: bold;
}
</style>
