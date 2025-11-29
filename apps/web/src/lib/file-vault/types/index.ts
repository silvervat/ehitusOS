/**
 * FILE VAULT - TypeScript Types
 * Enterprise File Management System
 */

// =============================================
// VAULT CONFIGURATION
// =============================================

export interface VaultConfig {
  // Upload settings
  maxFileSize: number              // Bytes
  allowedTypes: string[]           // MIME types or extensions
  enableChunkedUpload: boolean
  chunkSize: number                // Bytes (default 5MB)

  // Security
  enableVirusScan: boolean
  requireApproval: boolean         // Admin approval for uploads

  // Versioning
  enableVersioning: boolean
  maxVersions: number

  // Sharing
  defaultShareExpiry: number       // Days
  allowPublicSharing: boolean
  requirePasswordForPublic: boolean

  // Display
  defaultView: 'grid' | 'list' | 'table'
  tableColumns: string[]           // Default columns to show

  // Storage
  storageProvider: 'supabase' | 's3' | 'r2'
  storageConfig: StorageProviderConfig
}

export interface StorageProviderConfig {
  // Supabase
  supabaseUrl?: string
  supabaseBucket?: string

  // S3-compatible
  s3Endpoint?: string
  s3Bucket?: string
  s3Region?: string
  s3AccessKey?: string
  s3SecretKey?: string
}

// =============================================
// FILE METADATA
// =============================================

export interface FileMetadata {
  // Standard
  name: string
  size: number
  type: string
  lastModified: number

  // Custom (Ultra Table integration!)
  [key: string]: unknown
}

export interface FileUploadProgress {
  sessionId: string
  filename: string
  totalSize: number
  uploadedSize: number
  progress: number           // 0-100
  speed: number              // Bytes per second
  estimatedTimeRemaining: number  // Seconds
  chunks: ChunkProgress[]
}

export interface ChunkProgress {
  index: number
  size: number
  uploaded: boolean
  progress: number
}

// =============================================
// SEARCH TYPES
// =============================================

export interface FileSearchParams {
  vaultId: string
  query?: string
  filters?: FileFilters
  page?: number
  pageSize?: number
  sort?: {
    field: string
    order: 'asc' | 'desc'
  }
}

export interface FileFilters {
  extension?: string
  project?: string
  status?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
  mimeType?: string
  minSize?: number
  maxSize?: number
  ownerId?: string
  folderId?: string
}

export interface FileSearchResult {
  fileIds: string[]
  total: number
  took: number  // milliseconds
  facets: FileFacets
}

export interface FileFacets {
  extensions: FacetBucket[]
  projects: FacetBucket[]
  statuses: FacetBucket[]
  tags: FacetBucket[]
}

export interface FacetBucket {
  key: string
  doc_count: number
}

// =============================================
// PAGINATED RESULTS
// =============================================

export interface PaginatedFiles {
  files: FileRecord[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  facets: FileFacets
  took: number
}

// =============================================
// FILE RECORD (from database)
// =============================================

export interface FileRecord {
  id: string
  vaultId: string
  folderId?: string

  name: string
  path: string

  storageProvider: string
  storageBucket: string
  storagePath: string
  storageKey: string

  mimeType: string
  sizeBytes: bigint
  extension: string

  checksumMd5: string
  checksumSha256?: string

  width?: number
  height?: number
  duration?: number

  thumbnailSmall?: string
  thumbnailMedium?: string
  thumbnailLarge?: string

  metadata: Record<string, unknown>

  version: number
  isLatest: boolean
  parentFileId?: string

  isPublic: boolean
  ownerId: string

  scannedAt?: Date
  isSafe: boolean
  indexedAt?: Date

  createdAt: Date
  updatedAt: Date

  tags?: string[]
}

// =============================================
// SHARE TYPES
// =============================================

export type SharePermission = 'view' | 'download' | 'edit'

export interface ShareLink {
  id: string
  shortCode: string
  url: string
  shortUrl: string
  permission: SharePermission
  expiresAt: Date | null
  maxDownloads: number | null
  downloadCount: number
  viewCount: number
  hasPassword: boolean
  requireEmail: boolean
}

export interface CreateShareOptions {
  permission: SharePermission
  password?: string
  expiresIn?: number        // Days
  maxDownloads?: number
  requireEmail?: boolean
  allowedEmails?: string[]
}

// =============================================
// FOLDER TYPES
// =============================================

export interface FolderRecord {
  id: string
  vaultId: string
  parentId?: string
  name: string
  path: string
  color?: string
  icon?: string
  isPublic: boolean
  ownerId: string
  createdAt: Date
  updatedAt: Date
  children?: FolderRecord[]
  files?: FileRecord[]
}

// =============================================
// UPLOAD SESSION
// =============================================

export interface UploadSession {
  id: string
  vaultId: string
  filename: string
  sizeBytes: bigint
  mimeType: string
  chunkSize: number
  totalChunks: number
  uploadedChunks: number[]
  storageProvider: string
  storageBucket: string
  storageKey: string
  uploadId?: string
  metadata: Record<string, unknown>
  status: 'in_progress' | 'completed' | 'failed' | 'cancelled'
  errorMessage?: string
  resumeToken: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

// =============================================
// ACCESS LOG
// =============================================

export type FileAction =
  | 'view'
  | 'download'
  | 'upload'
  | 'delete'
  | 'share'
  | 'rename'
  | 'move'

export interface FileAccessLog {
  id: string
  fileId?: string
  shareId?: string
  action: FileAction
  ipAddress: string
  userAgent?: string
  userId?: string
  bytesTransferred?: bigint
  createdAt: Date
}

// =============================================
// STORAGE QUOTA
// =============================================

export interface StorageQuotaInfo {
  id: string
  tenantId: string
  userId?: string
  quotaBytes: bigint
  usedBytes: bigint
  fileCount: number
  usagePercent: number
  isWarning: boolean      // >80%
  isLimitReached: boolean // >=100%
}

// =============================================
// ANALYTICS
// =============================================

export interface VaultAnalytics {
  usedBytes: bigint
  quotaBytes: bigint
  fileCount: number
  folderCount: number
  shareCount: number
  fileTypeDistribution: FileTypeDistribution[]
  topUsers: TopUser[]
  largestFiles: FileRecord[]
  recentActivity: FileAccessLog[]
}

export interface FileTypeDistribution {
  type: string
  sizeBytes: bigint
  count: number
}

export interface TopUser {
  id: string
  name: string
  email: string
  usedBytes: bigint
  fileCount: number
}
