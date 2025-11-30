// Modal Designer Types

export type ModalType =
  | 'confirmation'
  | 'alert'
  | 'warning'
  | 'success'
  | 'error'
  | 'info'
  | 'input'
  | 'form'
  | 'custom'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success'

export type IconType =
  | 'none'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'question'
  | 'trash'
  | 'save'
  | 'edit'
  | 'plus'
  | 'check'
  | 'x'
  | 'alert'
  | 'custom'

export interface ModalButton {
  id: string
  label: string
  variant: ButtonVariant
  action: 'confirm' | 'cancel' | 'custom'
  customAction?: string
  icon?: IconType
  iconPosition?: 'left' | 'right'
  tooltip?: string
  loading?: boolean
  disabled?: boolean
  order: number
}

export interface ModalIcon {
  type: IconType
  customIcon?: string
  color: string
  backgroundColor: string
  size: 'sm' | 'md' | 'lg'
  animation?: 'none' | 'pulse' | 'bounce' | 'shake'
}

export interface ModalInput {
  id: string
  type: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'select'
  label: string
  placeholder?: string
  required?: boolean
  defaultValue?: string
  options?: { label: string; value: string }[]
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
}

export interface ModalTheme {
  backgroundColor: string
  overlayColor: string
  overlayOpacity: number
  borderRadius: number
  borderColor: string
  borderWidth: number
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  padding: number
  headerPadding: number
  footerPadding: number
  animation: 'none' | 'fade' | 'slide' | 'scale' | 'bounce'
  animationDuration: number
}

export interface ModalContent {
  title: string
  titleSize: 'sm' | 'md' | 'lg' | 'xl'
  titleAlign: 'left' | 'center' | 'right'
  titleColor: string
  message: string
  messageSize: 'sm' | 'md' | 'lg'
  messageAlign: 'left' | 'center' | 'right'
  messageColor: string
  showCloseButton: boolean
  closeOnOverlayClick: boolean
  closeOnEscape: boolean
}

export interface ModalTemplate {
  id: string
  tenantId: string
  key: string // unique identifier for programmatic access
  name: string
  description?: string
  type: ModalType
  size: ModalSize
  icon: ModalIcon
  content: ModalContent
  buttons: ModalButton[]
  inputs: ModalInput[]
  theme: ModalTheme
  isSystem: boolean // system modals can't be deleted
  isActive: boolean
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Default values
export const defaultModalIcon: ModalIcon = {
  type: 'info',
  color: '#279989',
  backgroundColor: '#27998920',
  size: 'md',
  animation: 'none',
}

export const defaultModalContent: ModalContent = {
  title: 'Modal pealkiri',
  titleSize: 'lg',
  titleAlign: 'center',
  titleColor: '#1e293b',
  message: 'Modal sisu tekst',
  messageSize: 'md',
  messageAlign: 'center',
  messageColor: '#64748b',
  showCloseButton: true,
  closeOnOverlayClick: true,
  closeOnEscape: true,
}

export const defaultModalTheme: ModalTheme = {
  backgroundColor: '#ffffff',
  overlayColor: '#000000',
  overlayOpacity: 50,
  borderRadius: 12,
  borderColor: '#e2e8f0',
  borderWidth: 1,
  shadow: 'xl',
  padding: 24,
  headerPadding: 24,
  footerPadding: 16,
  animation: 'scale',
  animationDuration: 200,
}

export const defaultConfirmButton: ModalButton = {
  id: 'confirm',
  label: 'Kinnita',
  variant: 'primary',
  action: 'confirm',
  order: 2,
}

export const defaultCancelButton: ModalButton = {
  id: 'cancel',
  label: 'Tuhista',
  variant: 'outline',
  action: 'cancel',
  order: 1,
}

// System modal presets
export const SYSTEM_MODALS: Partial<ModalTemplate>[] = [
  {
    key: 'delete-confirmation',
    name: 'Kustutamise kinnitus',
    type: 'confirmation',
    category: 'system',
    icon: { ...defaultModalIcon, type: 'trash', color: '#ef4444', backgroundColor: '#ef444420' },
    content: {
      ...defaultModalContent,
      title: 'Kustuta element',
      message: 'Kas olete kindel, et soovite selle elemendi kustutada? See toiming on poordumaatu.',
    },
    buttons: [
      { ...defaultCancelButton },
      { ...defaultConfirmButton, label: 'Kustuta', variant: 'destructive', icon: 'trash' },
    ],
    isSystem: true,
  },
  {
    key: 'save-confirmation',
    name: 'Salvestamise kinnitus',
    type: 'confirmation',
    category: 'system',
    icon: { ...defaultModalIcon, type: 'save', color: '#279989', backgroundColor: '#27998920' },
    content: {
      ...defaultModalContent,
      title: 'Salvesta muudatused',
      message: 'Kas soovite muudatused salvestada?',
    },
    buttons: [
      { ...defaultCancelButton },
      { ...defaultConfirmButton, label: 'Salvesta', icon: 'save' },
    ],
    isSystem: true,
  },
  {
    key: 'discard-confirmation',
    name: 'Muudatuste tühistamine',
    type: 'warning',
    category: 'system',
    icon: { ...defaultModalIcon, type: 'warning', color: '#f59e0b', backgroundColor: '#f59e0b20' },
    content: {
      ...defaultModalContent,
      title: 'Tühista muudatused?',
      message: 'Teil on salvestamata muudatusi. Kas olete kindel, et soovite lahkuda?',
    },
    buttons: [
      { ...defaultCancelButton, label: 'Jää siia' },
      { ...defaultConfirmButton, label: 'Tühista muudatused', variant: 'destructive' },
    ],
    isSystem: true,
  },
  {
    key: 'success-notification',
    name: 'Eduteade',
    type: 'success',
    category: 'system',
    icon: { ...defaultModalIcon, type: 'success', color: '#22c55e', backgroundColor: '#22c55e20' },
    content: {
      ...defaultModalContent,
      title: 'Toiming onnestus!',
      message: 'Teie toiming on edukalt teostatud.',
    },
    buttons: [
      { ...defaultConfirmButton, label: 'Selge', variant: 'success' },
    ],
    isSystem: true,
  },
  {
    key: 'error-notification',
    name: 'Veateade',
    type: 'error',
    category: 'system',
    icon: { ...defaultModalIcon, type: 'error', color: '#ef4444', backgroundColor: '#ef444420' },
    content: {
      ...defaultModalContent,
      title: 'Viga!',
      message: 'Midagi laks valesti. Palun proovige uuesti.',
    },
    buttons: [
      { ...defaultConfirmButton, label: 'Sulge', variant: 'destructive' },
    ],
    isSystem: true,
  },
  {
    key: 'info-notification',
    name: 'Infoteade',
    type: 'info',
    category: 'system',
    icon: { ...defaultModalIcon, type: 'info', color: '#3b82f6', backgroundColor: '#3b82f620' },
    content: {
      ...defaultModalContent,
      title: 'Teadmiseks',
      message: 'Siia tuleb informatiivne teade.',
    },
    buttons: [
      { ...defaultConfirmButton, label: 'Selge', variant: 'primary' },
    ],
    isSystem: true,
  },
  {
    key: 'logout-confirmation',
    name: 'Väljalogimise kinnitus',
    type: 'confirmation',
    category: 'auth',
    icon: { ...defaultModalIcon, type: 'warning', color: '#f59e0b', backgroundColor: '#f59e0b20' },
    content: {
      ...defaultModalContent,
      title: 'Logi välja',
      message: 'Kas olete kindel, et soovite välja logida?',
    },
    buttons: [
      { ...defaultCancelButton },
      { ...defaultConfirmButton, label: 'Logi välja' },
    ],
    isSystem: true,
  },
  {
    key: 'session-expired',
    name: 'Sessioon aegunud',
    type: 'warning',
    category: 'auth',
    icon: { ...defaultModalIcon, type: 'warning', color: '#f59e0b', backgroundColor: '#f59e0b20' },
    content: {
      ...defaultModalContent,
      title: 'Sessioon aegunud',
      message: 'Teie sessioon on aegunud. Palun logige uuesti sisse.',
      closeOnOverlayClick: false,
      closeOnEscape: false,
      showCloseButton: false,
    },
    buttons: [
      { ...defaultConfirmButton, label: 'Logi sisse' },
    ],
    isSystem: true,
  },
]

// Helper to generate ID
export function generateId(): string {
  return `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Modal categories
export const MODAL_CATEGORIES = [
  { id: 'system', label: 'Süsteemi modalid' },
  { id: 'auth', label: 'Autentimine' },
  { id: 'crud', label: 'CRUD operatsioonid' },
  { id: 'forms', label: 'Vormid' },
  { id: 'notifications', label: 'Teavitused' },
  { id: 'custom', label: 'Kohandatud' },
]

// Modal types with labels
export const MODAL_TYPES: { value: ModalType; label: string; color: string }[] = [
  { value: 'confirmation', label: 'Kinnitus', color: '#3b82f6' },
  { value: 'alert', label: 'Hoiatus', color: '#f59e0b' },
  { value: 'warning', label: 'Tähelepanu', color: '#eab308' },
  { value: 'success', label: 'Eduteade', color: '#22c55e' },
  { value: 'error', label: 'Veateade', color: '#ef4444' },
  { value: 'info', label: 'Info', color: '#3b82f6' },
  { value: 'input', label: 'Sisend', color: '#8b5cf6' },
  { value: 'form', label: 'Vorm', color: '#ec4899' },
  { value: 'custom', label: 'Kohandatud', color: '#64748b' },
]
