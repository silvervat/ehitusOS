export { prisma } from './client'
export type { PrismaClient } from '@prisma/client'

// Re-export Prisma types
export type {
  Tenant,
  UserProfile,
  Project,
  Company,
  Invoice,
  Employee,
  AuditLog,
} from '@prisma/client'
