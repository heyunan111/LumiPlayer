# Prisma 使用示例

## 1. 安装依赖

```bash
cnpm install prisma @prisma/client dotenv --save
```

## 2. 已完成的步骤 ✅

- ✅ 数据库已创建（dev.db）
- ✅ Prisma Client 已生成
- ✅ User 表已创建

## 3. 测试数据库

在 Renderer 进程中使用前，需要先在 `preload.ts` 中暴露 API。

在 `preload.ts` 中暴露 API：

```typescript
// apps/electron-main/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  createUser: (name: string, email: string, age?: number) => 
    ipcRenderer.invoke('test:createUser', name, email, age),
  
  getUsers: () => 
    ipcRenderer.invoke('test:getUsers'),
  
  getUserById: (id: number) => 
    ipcRenderer.invoke('test:getUserById', id),
  
  updateUser: (id: number, name?: string, age?: number) => 
    ipcRenderer.invoke('test:updateUser', id, name, age),
  
  deleteUser: (id: number) => 
    ipcRenderer.invoke('test:deleteUser', id)
})
```

在 Vue 组件中使用：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const users = ref([])

onMounted(async () => {
  // 获取所有用户
  users.value = await window.api.getUsers()
})

async function addUser() {
  // 创建用户
  const user = await window.api.createUser('张三', 'zhangsan@example.com', 25)
  console.log('创建的用户:', user)
  
  // 刷新列表
  users.value = await window.api.getUsers()
}

async function updateUser(id: number) {
  // 更新用户
  await window.api.updateUser(id, '李四', 30)
  users.value = await window.api.getUsers()
}

async function deleteUser(id: number) {
  // 删除用户
  await window.api.deleteUser(id)
  users.value = await window.api.getUsers()
}
</script>

<template>
  <div>
    <button @click="addUser">添加用户</button>
    
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.email }} - {{ user.age }}
        <button @click="updateUser(user.id)">更新</button>
        <button @click="deleteUser(user.id)">删除</button>
      </li>
    </ul>
  </div>
</template>
```

## 5. 常用 Prisma 操作

```typescript
// 创建
await prisma.user.create({
  data: { name: '张三', email: 'test@example.com', age: 25 }
})

// 查询所有
await prisma.user.findMany()

// 查询单个
await prisma.user.findUnique({ where: { id: 1 } })

// 条件查询
await prisma.user.findMany({
  where: { age: { gte: 18 } }  // 年龄 >= 18
})

// 更新
await prisma.user.update({
  where: { id: 1 },
  data: { age: 30 }
})

// 删除
await prisma.user.delete({ where: { id: 1 } })

// Upsert（存在则更新，不存在则创建）
await prisma.user.upsert({
  where: { email: 'test@example.com' },
  update: { name: '李四' },
  create: { name: '李四', email: 'test@example.com' }
})
```

## 6. 项目结构

```
prisma/
  schema.prisma          # 数据库模型定义
  
packages/database/
  db.ts                  # Prisma 客户端实例
  
apps/electron-main/ipc/
  testIpc.ts             # IPC 处理器
```

## 7. 下一步

修改 `prisma/schema.prisma` 添加你需要的表，然后运行：

```bash
npx prisma migrate dev --name add_new_table
npx prisma generate
```
