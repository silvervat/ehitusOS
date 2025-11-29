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

  // Display (Admin configurable per user group!)
  defaultView: FileViewType
  viewSettings: ViewSettings
  tableColumns: string[]           // Default columns to show

  // Storage
  storageProvider: 'supabase' | 's3' | 'r2'
  storageConfig: StorageProviderConfig

  // User group configurations (Admin can customize per group)
  groupConfigs?: Record<string, GroupViewConfig>
}

// =============================================
// VIEW TYPES & CONFIGURATION
// =============================================

export type FileViewType =
  | 'grid'       // Icon grid view (large icons)
  | 'list'       // Compact list view
  | 'table'      // Full table with columns
  | 'gallery'    // Image gallery (thumbnails)
  | 'timeline'   // Timeline view by date
  | 'kanban'     // Kanban board by status

export interface ViewSettings {
  // Grid view settings
  grid: GridViewSettings
  // List view settings
  list: ListViewSettings
  // Table view settings
  table: TableViewSettings
  // Gallery view settings
  gallery: GalleryViewSettings
  // Timeline view settings
  timeline: TimelineViewSettings
  // Kanban view settings
  kanban: KanbanViewSettings
}

export interface GridViewSettings {
  iconSize: 'small' | 'medium' | 'large' | 'xlarge' // 48, 64, 96, 128px
  showFileNames: boolean
  showFileSize: boolean
  showFileDate: boolean
  showThumbnails: boolean
  itemsPerRow: number         // Auto, 4, 6, 8
  spacing: 'compact' | 'normal' | 'relaxed'
}

export interface ListViewSettings {
  showIcon: boolean
  showThumbnail: boolean
  showFileSize: boolean
  showModifiedDate: boolean
  showOwner: boolean
  showTags: boolean
  compact: boolean
}

export interface TableViewSettings {
  columns: TableColumnConfig[]
  showHeaderFilters: boolean
  rowHeight: 'compact' | 'normal' | 'comfortable'
  enableSorting: boolean
  enableColumnReorder: boolean
  enableColumnResize: boolean
  stickyHeader: boolean
}

export interface TableColumnConfig {
  field: string
  label: string
  width?: number
  minWidth?: number
  visible: boolean
  sortable: boolean
  filterable: boolean
  align: 'left' | 'center' | 'right'
  format?: 'text' | 'date' | 'size' | 'user' | 'tags' | 'thumbnail'
}

export interface GalleryViewSettings {
  thumbnailSize: 'small' | 'medium' | 'large' // 150, 250, 400px
  showFileName: boolean
  showOverlay: boolean           // Show info on hover
  aspectRatio: '1:1' | '4:3' | '16:9' | 'auto'
  enableLightbox: boolean
  enableZoom: boolean
  columnsCount: 2 | 3 | 4 | 5 | 6
}

export interface TimelineViewSettings {
  groupBy: 'day' | 'week' | 'month' | 'year'
  showThumbnails: boolean
  showFileInfo: boolean
}

export interface KanbanViewSettings {
  groupByField: string          // e.g., 'status', 'project', 'tag'
  columns: KanbanColumn[]
  cardFields: string[]          // Which fields to show on cards
  showThumbnail: boolean
}

export interface KanbanColumn {
  id: string
  label: string
  color: string
  limit?: number               // WIP limit
}

// =============================================
// USER GROUP VIEW CONFIGURATION (Admin Panel)
// =============================================

export interface GroupViewConfig {
  groupId: string
  groupName: string

  // Allowed views for this group
  allowedViews: FileViewType[]
  defaultView: FileViewType

  // View-specific overrides
  viewSettings: Partial<ViewSettings>

  // Permissions
  canUpload: boolean
  canDownload: boolean
  canShare: boolean
  canDelete: boolean
  canCreateFolders: boolean
  canBulkOperations: boolean

  // UI Customization
  showSidebar: boolean
  showBreadcrumbs: boolean
  showSearch: boolean
  showFilters: boolean
  showSortOptions: boolean
  showViewSwitcher: boolean

  // File type filters
  visibleFileTypes: string[]    // Empty = all types
  hiddenFolders: string[]       // Folder IDs to hide
}

// =============================================
// ADMIN PANEL SETTINGS
// =============================================

export interface FileVaultAdminSettings {
  // Global settings
  globalDefaults: VaultConfig

  // Per-tenant overrides
  tenantOverrides?: Partial<VaultConfig>

  // User group configurations
  groupConfigs: GroupViewConfig[]

  // Custom branding
  branding: FileVaultBranding
}

export interface FileVaultBranding {
  // Colors
  primaryColor: string
  secondaryColor: string
  accentColor: string

  // Icons
  folderIcon: string            // Custom folder icon
  fileIcons: Record<string, string>  // Extension -> icon mapping

  // Labels (i18n)
  labels: Record<string, string>

  // Custom CSS
  customCss?: string
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

// =============================================
// FILE PREVIEW SYSTEM (Inline viewing)
// =============================================

/**
 * Supported preview types for inline file viewing
 * Without downloading the file
 */
export type PreviewType =
  | 'image'      // JPG, PNG, GIF, WebP, SVG
  | 'video'      // MP4, WebM, MOV
  | 'audio'      // MP3, WAV, OGG
  | 'pdf'        // PDF documents
  | 'text'       // TXT, MD, JSON, XML, YML, LOG
  | 'code'       // JS, TS, PY, SQL, HTML, CSS, etc.
  | 'word'       // DOC, DOCX (via mammoth.js / docx-preview)
  | 'excel'      // XLS, XLSX (via SheetJS)
  | 'powerpoint' // PPT, PPTX (via pptx-preview)
  | 'archive'    // ZIP, RAR, 7Z (show contents)
  | 'cad'        // DWG, DXF (via AutoCAD viewer)
  | 'model3d'    // OBJ, GLTF, STL (via three.js)
  | 'unsupported'

export interface FilePreviewConfig {
  // Which file types are previewable
  previewableExtensions: Record<string, PreviewType>

  // Preview settings per type
  imagePreview: ImagePreviewSettings
  videoPreview: VideoPreviewSettings
  documentPreview: DocumentPreviewSettings
  codePreview: CodePreviewSettings
  spreadsheetPreview: SpreadsheetPreviewSettings
}

export interface ImagePreviewSettings {
  enableZoom: boolean
  enablePan: boolean
  enableRotate: boolean
  enableFullscreen: boolean
  maxZoomLevel: number
  showExifData: boolean
}

export interface VideoPreviewSettings {
  autoplay: boolean
  muted: boolean
  showControls: boolean
  enableLoop: boolean
  enablePictureInPicture: boolean
  defaultQuality: 'auto' | '1080p' | '720p' | '480p'
}

export interface DocumentPreviewSettings {
  // Word/PDF preview
  showPageNumbers: boolean
  enableTextSelection: boolean
  enableSearch: boolean
  enablePrint: boolean
  defaultZoom: number          // 100 = 100%
  pageFit: 'width' | 'height' | 'page'

  // Word-specific
  wordConverter: 'mammoth' | 'docx-preview' | 'office-viewer'
}

export interface CodePreviewSettings {
  theme: 'vs-dark' | 'vs-light' | 'github-dark' | 'dracula'
  fontSize: number
  showLineNumbers: boolean
  wordWrap: boolean
  enableSyntaxHighlighting: boolean
  maxFileSize: number          // Max file size to preview (bytes)
}

export interface SpreadsheetPreviewSettings {
  // Excel preview
  showSheetTabs: boolean
  enableCellSelection: boolean
  showGridLines: boolean
  showFormulas: boolean
  freezeFirstRow: boolean
  freezeFirstColumn: boolean
  defaultSheetIndex: number
  maxRowsToPreview: number     // Performance limit
  maxColumnsToPreview: number
}

/**
 * Preview result returned by preview service
 */
export interface FilePreviewResult {
  fileId: string
  previewType: PreviewType
  isSupported: boolean

  // Preview content (depends on type)
  content?: {
    // For text/code/markdown
    text?: string

    // For images
    imageUrl?: string
    thumbnails?: {
      small: string
      medium: string
      large: string
    }

    // For documents (PDF/Word)
    pageCount?: number
    pages?: DocumentPage[]

    // For spreadsheets
    sheets?: SpreadsheetSheet[]

    // For videos
    videoUrl?: string
    duration?: number
    thumbnail?: string

    // For archives
    archiveContents?: ArchiveEntry[]
  }

  // Metadata
  originalSize: number
  previewGeneratedAt: Date
  expiresAt?: Date
}

export interface DocumentPage {
  pageNumber: number
  imageUrl?: string           // Rendered image
  textContent?: string        // Extracted text
  width: number
  height: number
}

export interface SpreadsheetSheet {
  index: number
  name: string
  data: (string | number | boolean | null)[][]  // 2D array
  columnWidths: number[]
  rowHeights: number[]
  mergedCells?: MergedCell[]
}

export interface MergedCell {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
}

export interface ArchiveEntry {
  path: string
  name: string
  size: number
  compressedSize: number
  isDirectory: boolean
  modifiedAt: Date
}

/**
 * Default extension to preview type mapping
 */
export const DEFAULT_PREVIEW_EXTENSIONS: Record<string, PreviewType> = {
  // Images
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image',
  webp: 'image', svg: 'image', bmp: 'image', ico: 'image',

  // Videos
  mp4: 'video', webm: 'video', mov: 'video', avi: 'video',
  mkv: 'video', m4v: 'video',

  // Audio
  mp3: 'audio', wav: 'audio', ogg: 'audio', flac: 'audio',
  m4a: 'audio', aac: 'audio',

  // PDF
  pdf: 'pdf',

  // Text
  txt: 'text', md: 'text', json: 'text', xml: 'text',
  yml: 'text', yaml: 'text', log: 'text', csv: 'text',
  ini: 'text', conf: 'text', env: 'text',

  // Code
  js: 'code', ts: 'code', jsx: 'code', tsx: 'code',
  py: 'code', sql: 'code', html: 'code', css: 'code',
  scss: 'code', less: 'code', java: 'code', c: 'code',
  cpp: 'code', h: 'code', cs: 'code', go: 'code',
  rs: 'code', php: 'code', rb: 'code', swift: 'code',
  kt: 'code', sh: 'code', bash: 'code', ps1: 'code',
  vue: 'code', svelte: 'code',

  // Word
  doc: 'word', docx: 'word', odt: 'word', rtf: 'word',

  // Excel
  xls: 'excel', xlsx: 'excel', ods: 'excel',

  // PowerPoint
  ppt: 'powerpoint', pptx: 'powerpoint', odp: 'powerpoint',

  // Archives
  zip: 'archive', rar: 'archive', '7z': 'archive',
  tar: 'archive', gz: 'archive',

  // CAD
  dwg: 'cad', dxf: 'cad',

  // 3D Models
  obj: 'model3d', gltf: 'model3d', glb: 'model3d',
  stl: 'model3d', fbx: 'model3d',
}
