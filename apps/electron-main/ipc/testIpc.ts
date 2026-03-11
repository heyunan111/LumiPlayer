import { ipcMain } from 'electron'
import { getPrisma } from '../../../packages/database/db'

// 创建用户
ipcMain.handle('test:createUser', async (_event, name: string, email: string, age?: number) => {
  const prisma = getPrisma()
  const user = await prisma.user.create({
    data: { name, email, age }
  })
  return user
})

// 获取所有用户
ipcMain.handle('test:getUsers', async () => {
  const prisma = getPrisma()
  const users = await prisma.user.findMany()
  return users
})

// 根据 ID 获取用户
ipcMain.handle('test:getUserById', async (_event, id: number) => {
  const prisma = getPrisma()
  const user = await prisma.user.findUnique({
    where: { id }
  })
  return user
})

// 更新用户
ipcMain.handle('test:updateUser', async (_event, id: number, name?: string, age?: number) => {
  const prisma = getPrisma()
  const user = await prisma.user.update({
    where: { id },
    data: { name, age }
  })
  return user
})

// 删除用户
ipcMain.handle('test:deleteUser', async (_event, id: number) => {
  const prisma = getPrisma()
  await prisma.user.delete({
    where: { id }
  })
})
