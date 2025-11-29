// =============================================
// CMS Types - Dynamic Fields, Workflows, Notifications
// =============================================

// Field Types
export type FieldType =
  | 'text'
  | 'textarea'
  | 'rich_text'
  | 'number'
  | 'decimal'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'boolean'
  | 'file'
  | 'image'
  | 'url'
  | 'email'
  | 'phone'
  | 'color'
  | 'json'

export interface FieldOption {
  label: string
  value: string
  color?: string
  icon?: string
  disabled?: boolean
}

export interface FieldConfig {
  options?: FieldOption[]
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  maxSize?: number
  allowedTypes?: string[]
  multiple?: boolean
  toolbarOptions?: string[]
  minDate?: string
  maxDate?: string
  placeholder?: string
  helpText?: string
  defaultValue?: unknown
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom'
  value?: string | number
  message: string
}

export interface ConditionalRule {
  field: string
  operator: '==' | '!=' | '>' | '<' | 'contains' | 'empty' | 'not_empty'
  value?: unknown
  action: 'show' | 'hide' | 'require' | 'disable'
}

export interface DynamicField {
  id: string
  tenantId: string
  entityType: string
  key: string
  label: string
  type: FieldType
  config: FieldConfig
  required: boolean
  validationRules: ValidationRule[]
  sortOrder: number
  fieldGroup: string
  conditionalLogic: ConditionalRule[]
  canView: string[]
  canEdit: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DynamicFieldValue {
  id: string
  tenantId: string
  fieldId: string
  entityType: string
  entityId: string
  valueText?: string
  valueNumber?: number
  valueBoolean?: boolean
  valueDate?: string
  valueDatetime?: string
  valueJson?: unknown
  createdAt: string
  updatedAt: string
}

// Workflow Types
export interface WorkflowState {
  id: string
  name: string
  label: string
  color: string
  icon?: string
  onEnter?: WorkflowAction[]
  onExit?: WorkflowAction[]
  canEdit: string[]
  canTransition: string[]
}

export interface WorkflowTransition {
  id: string
  name: string
  label: string
  from: string
  to: string
  conditions?: TransitionCondition[]
  actions?: WorkflowAction[]
  allowedRoles: string[]
  buttonLabel?: string
  buttonVariant?: 'default' | 'destructive' | 'outline'
  confirmMessage?: string
  requireComment: boolean
}

export interface TransitionCondition {
  type: 'field_value' | 'role' | 'approval' | 'custom'
  field?: string
  operator?: '==' | '!=' | '>' | '<'
  value?: unknown
  requiredRole?: string
  requiredApprovals?: number
  customScript?: string
}

export interface WorkflowAction {
  type: 'update_field' | 'send_notification' | 'create_task' | 'webhook' | 'custom'
  field?: string
  value?: unknown
  notificationTemplate?: string
  recipients?: string[]
  taskTemplate?: string
  assignTo?: string
  webhookUrl?: string
  webhookMethod?: 'GET' | 'POST'
  customScript?: string
}

export interface Workflow {
  id: string
  tenantId: string
  entityType: string
  name: string
  description?: string
  states: WorkflowState[]
  transitions: WorkflowTransition[]
  initialState: string
  allowManualTransitions: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkflowHistoryEntry {
  id: string
  tenantId: string
  workflowId: string
  entityType: string
  entityId: string
  fromState?: string
  toState: string
  transitionName?: string
  performedBy?: string
  performedAt: string
  comment?: string
  metadata?: Record<string, unknown>
}

// Notification Types
export type NotificationTriggerType =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'status_changed'
  | 'field_changed'
  | 'scheduled'

export type NotificationChannelType = 'email' | 'sms' | 'in_app' | 'webhook'

export interface NotificationChannel {
  type: NotificationChannelType
  emailSubject?: string
  emailTemplate?: string
  smsTemplate?: string
  webhookUrl?: string
}

export interface NotificationRecipient {
  type: 'user' | 'role' | 'field' | 'email'
  userId?: string
  role?: string
  field?: string
  email?: string
}

export interface NotificationSchedule {
  type: 'immediate' | 'daily' | 'weekly' | 'monthly'
  time?: string
  dayOfWeek?: number
  dayOfMonth?: number
}

export interface NotificationRule {
  id: string
  tenantId: string
  entityType: string
  name: string
  description?: string
  triggerType: NotificationTriggerType
  triggerConditions: Array<{
    field?: string
    operator?: string
    value?: unknown
  }>
  triggerDelay: number
  channels: NotificationChannel[]
  templateSubject?: string
  templateBody: string
  recipients: NotificationRecipient[]
  schedule?: NotificationSchedule
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Document Types
export interface CollaborativeDocument {
  id: string
  tenantId: string
  title: string
  slug?: string
  content: Record<string, unknown>
  contentText?: string
  createdBy?: string
  projectId?: string
  parentId?: string
  isTemplate: boolean
  isPublic: boolean
  publicToken?: string
  status: 'draft' | 'published' | 'archived'
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface DocumentVersion {
  id: string
  documentId: string
  versionNumber: number
  content: Record<string, unknown>
  createdBy?: string
  createdAt: string
  isRestoredFrom?: string
}

export interface DocumentComment {
  id: string
  tenantId: string
  documentId: string
  content: string
  positionStart?: number
  positionEnd?: number
  parentId?: string
  createdBy: string
  isResolved: boolean
  resolvedBy?: string
  resolvedAt?: string
  mentions: string[]
  createdAt: string
  updatedAt: string
}

export interface DocumentCollaborator {
  id: string
  documentId: string
  userId: string
  permission: 'view' | 'comment' | 'edit' | 'admin'
  invitedBy?: string
  invitedAt: string
  acceptedAt?: string
  isActive: boolean
}

export interface DocumentPresence {
  id: string
  documentId: string
  userId: string
  cursorPosition?: number
  selectionStart?: number
  selectionEnd?: number
  userName?: string
  userColor?: string
  lastSeen: string
}
