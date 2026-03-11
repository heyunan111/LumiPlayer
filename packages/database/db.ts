import { PrismaClient } from '@prisma/client'
import { app } from 'electron'
import path from 'path'

let prisma: PrismaClient | null = null

export function getPrisma(): PrismaClient {
  if (!prisma) {
    const dbPath = path.join(app.getPath('userData'), 'dev.db')
    
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${dbPath}`
        }
      }
    })
  }
  return prisma
}
