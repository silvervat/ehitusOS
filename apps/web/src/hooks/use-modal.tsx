'use client'

import { useState, useCallback, createContext, useContext, ReactNode } from 'react'
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Trash2,
  Save,
  Edit,
  Plus,
  Check,
  X,
  Loader2,
} from 'lucide-react'
import { Button, Card } from '@rivest/ui'
import type {
  ModalTemplate,
  ModalButton,
  IconType,
  ButtonVariant,
} from '@/components/admin/modal-designer/types'

// Icon mapping
const ICONS: Record<IconType, React.ElementType> = {
  none: X,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
  question: HelpCircle,
  trash: Trash2,
  save: Save,
  edit: Edit,
  plus: Plus,
  check: Check,
  x: X,
  alert: AlertTriangle,
  custom: Info,
}

// Button variant styles
const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-[#279989] hover:bg-[#1e7a6d] text-white',
  secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
  outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700',
  ghost: 'hover:bg-slate-100 text-slate-700',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
}

// Modal state
interface ModalState {
  isOpen: boolean
  modal: ModalTemplate | null
  resolve: ((value: boolean | string | null) => void) | null
  loading: boolean
  inputValues: Record<string, string>
}

// Modal context
interface ModalContextValue {
  showModal: (modalKey: string, overrides?: Partial<ModalTemplate>) => Promise<boolean>
  showConfirm: (title: string, message: string) => Promise<boolean>
  showAlert: (title: string, message: string) => Promise<void>
  showSuccess: (title: string, message: string) => Promise<void>
  showError: (title: string, message: string) => Promise<void>
  showInput: (title: string, message: string, placeholder?: string) => Promise<string | null>
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

// Default modal templates (will be replaced by CMS-configured ones)
const DEFAULT_MODALS: Record<string, Partial<ModalTemplate>> = {
  'delete-confirmation': {
    type: 'confirmation',
    icon: { type: 'trash', color: '#ef4444', backgroundColor: '#ef444420', size: 'md', animation: 'none' },
    content: {
      title: 'Kustuta element',
      titleSize: 'lg',
      titleAlign: 'center',
      titleColor: '#1e293b',
      message: 'Kas olete kindel, et soovite selle elemendi kustutada? See toiming on poordumaatu.',
      messageSize: 'md',
      messageAlign: 'center',
      messageColor: '#64748b',
      showCloseButton: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
    },
    buttons: [
      { id: 'cancel', label: 'Tuhista', variant: 'outline', action: 'cancel', order: 1 },
      { id: 'confirm', label: 'Kustuta', variant: 'destructive', action: 'confirm', icon: 'trash', order: 2 },
    ],
    theme: {
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
    },
  },
  'confirm': {
    type: 'confirmation',
    icon: { type: 'question', color: '#3b82f6', backgroundColor: '#3b82f620', size: 'md', animation: 'none' },
    content: {
      title: 'Kinnitus',
      titleSize: 'lg',
      titleAlign: 'center',
      titleColor: '#1e293b',
      message: 'Kas olete kindel?',
      messageSize: 'md',
      messageAlign: 'center',
      messageColor: '#64748b',
      showCloseButton: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
    },
    buttons: [
      { id: 'cancel', label: 'Tuhista', variant: 'outline', action: 'cancel', order: 1 },
      { id: 'confirm', label: 'Kinnita', variant: 'primary', action: 'confirm', order: 2 },
    ],
  },
  'alert': {
    type: 'info',
    icon: { type: 'info', color: '#3b82f6', backgroundColor: '#3b82f620', size: 'md', animation: 'none' },
    content: {
      title: 'Teade',
      titleSize: 'lg',
      titleAlign: 'center',
      titleColor: '#1e293b',
      message: '',
      messageSize: 'md',
      messageAlign: 'center',
      messageColor: '#64748b',
      showCloseButton: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
    },
    buttons: [
      { id: 'confirm', label: 'Selge', variant: 'primary', action: 'confirm', order: 1 },
    ],
  },
  'success': {
    type: 'success',
    icon: { type: 'success', color: '#22c55e', backgroundColor: '#22c55e20', size: 'md', animation: 'none' },
    content: {
      title: 'Onnestus!',
      titleSize: 'lg',
      titleAlign: 'center',
      titleColor: '#1e293b',
      message: '',
      messageSize: 'md',
      messageAlign: 'center',
      messageColor: '#64748b',
      showCloseButton: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
    },
    buttons: [
      { id: 'confirm', label: 'Selge', variant: 'success', action: 'confirm', order: 1 },
    ],
  },
  'error': {
    type: 'error',
    icon: { type: 'error', color: '#ef4444', backgroundColor: '#ef444420', size: 'md', animation: 'none' },
    content: {
      title: 'Viga!',
      titleSize: 'lg',
      titleAlign: 'center',
      titleColor: '#1e293b',
      message: '',
      messageSize: 'md',
      messageAlign: 'center',
      messageColor: '#64748b',
      showCloseButton: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
    },
    buttons: [
      { id: 'confirm', label: 'Sulge', variant: 'destructive', action: 'confirm', order: 1 },
    ],
  },
  'input': {
    type: 'input',
    icon: { type: 'edit', color: '#8b5cf6', backgroundColor: '#8b5cf620', size: 'md', animation: 'none' },
    content: {
      title: 'Sisesta väärtus',
      titleSize: 'lg',
      titleAlign: 'center',
      titleColor: '#1e293b',
      message: '',
      messageSize: 'md',
      messageAlign: 'center',
      messageColor: '#64748b',
      showCloseButton: true,
      closeOnOverlayClick: false,
      closeOnEscape: true,
    },
    buttons: [
      { id: 'cancel', label: 'Tuhista', variant: 'outline', action: 'cancel', order: 1 },
      { id: 'confirm', label: 'Kinnita', variant: 'primary', action: 'confirm', order: 2 },
    ],
    inputs: [
      { id: 'input', type: 'text', label: '', placeholder: '', required: true },
    ],
  },
}

// Provider component
interface ModalProviderProps {
  children: ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    modal: null,
    resolve: null,
    loading: false,
    inputValues: {},
  })

  const showModal = useCallback(
    (modalKey: string, overrides?: Partial<ModalTemplate>): Promise<boolean> => {
      return new Promise((resolve) => {
        const baseModal = DEFAULT_MODALS[modalKey] || DEFAULT_MODALS['confirm']
        const modal = {
          ...baseModal,
          ...overrides,
          content: { ...baseModal.content, ...overrides?.content },
          icon: { ...baseModal.icon, ...overrides?.icon },
          theme: { ...baseModal.theme, ...overrides?.theme },
        } as ModalTemplate

        setState({
          isOpen: true,
          modal,
          resolve: resolve as (value: boolean | string | null) => void,
          loading: false,
          inputValues: {},
        })
      })
    },
    []
  )

  const showConfirm = useCallback(
    (title: string, message: string): Promise<boolean> => {
      return showModal('confirm', {
        content: { ...DEFAULT_MODALS['confirm']!.content!, title, message },
      })
    },
    [showModal]
  )

  const showAlert = useCallback(
    async (title: string, message: string): Promise<void> => {
      await showModal('alert', {
        content: { ...DEFAULT_MODALS['alert']!.content!, title, message },
      })
    },
    [showModal]
  )

  const showSuccess = useCallback(
    async (title: string, message: string): Promise<void> => {
      await showModal('success', {
        content: { ...DEFAULT_MODALS['success']!.content!, title, message },
      })
    },
    [showModal]
  )

  const showError = useCallback(
    async (title: string, message: string): Promise<void> => {
      await showModal('error', {
        content: { ...DEFAULT_MODALS['error']!.content!, title, message },
      })
    },
    [showModal]
  )

  const showInput = useCallback(
    (title: string, message: string, placeholder?: string): Promise<string | null> => {
      return new Promise((resolve) => {
        const baseModal = DEFAULT_MODALS['input']!
        const modal = {
          ...baseModal,
          content: { ...baseModal.content!, title, message },
          inputs: [{ id: 'input', type: 'text', label: '', placeholder: placeholder || '', required: true }],
        } as ModalTemplate

        setState({
          isOpen: true,
          modal,
          resolve: resolve as (value: boolean | string | null) => void,
          loading: false,
          inputValues: { input: '' },
        })
      })
    },
    []
  )

  const closeModal = useCallback(() => {
    state.resolve?.(false)
    setState({
      isOpen: false,
      modal: null,
      resolve: null,
      loading: false,
      inputValues: {},
    })
  }, [state.resolve])

  const handleButtonClick = async (button: ModalButton) => {
    if (button.action === 'cancel') {
      state.resolve?.(false)
      closeModal()
      return
    }

    if (button.action === 'confirm') {
      // If it's an input modal, return the input value
      if (state.modal?.type === 'input') {
        state.resolve?.(state.inputValues.input || null)
      } else {
        state.resolve?.(true)
      }
      closeModal()
    }
  }

  const handleInputChange = (id: string, value: string) => {
    setState((prev) => ({
      ...prev,
      inputValues: { ...prev.inputValues, [id]: value },
    }))
  }

  const handleOverlayClick = () => {
    if (state.modal?.content?.closeOnOverlayClick) {
      closeModal()
    }
  }

  // Render modal
  const renderModal = () => {
    if (!state.isOpen || !state.modal) return null

    const { modal } = state
    const IconComponent = ICONS[modal.icon?.type || 'info']
    const theme = modal.theme || DEFAULT_MODALS['confirm']!.theme!

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: `${theme.overlayColor}${Math.round((theme.overlayOpacity / 100) * 255)
            .toString(16)
            .padStart(2, '0')}`,
        }}
        onClick={handleOverlayClick}
      >
        <Card
          className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
          style={{
            backgroundColor: theme.backgroundColor,
            borderRadius: theme.borderRadius,
          }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Close button */}
          {modal.content?.showCloseButton && (
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Content */}
          <div style={{ padding: theme.padding }}>
            {/* Icon */}
            {modal.icon?.type !== 'none' && (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: modal.icon?.backgroundColor }}
              >
                <IconComponent className="h-6 w-6" style={{ color: modal.icon?.color }} />
              </div>
            )}

            {/* Title */}
            <h3
              className={`font-semibold mb-2 ${
                modal.content?.titleSize === 'sm'
                  ? 'text-base'
                  : modal.content?.titleSize === 'md'
                  ? 'text-lg'
                  : modal.content?.titleSize === 'lg'
                  ? 'text-xl'
                  : 'text-2xl'
              }`}
              style={{
                color: modal.content?.titleColor,
                textAlign: modal.content?.titleAlign,
              }}
            >
              {modal.content?.title}
            </h3>

            {/* Message */}
            {modal.content?.message && (
              <p
                className={
                  modal.content?.messageSize === 'sm'
                    ? 'text-sm'
                    : modal.content?.messageSize === 'md'
                    ? 'text-base'
                    : 'text-lg'
                }
                style={{
                  color: modal.content?.messageColor,
                  textAlign: modal.content?.messageAlign,
                }}
              >
                {modal.content?.message}
              </p>
            )}

            {/* Inputs */}
            {modal.inputs && modal.inputs.length > 0 && (
              <div className="mt-4 space-y-3">
                {modal.inputs.map((input) => (
                  <div key={input.id}>
                    {input.label && (
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {input.label}
                      </label>
                    )}
                    <input
                      type={input.type}
                      value={state.inputValues[input.id] || ''}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      placeholder={input.placeholder}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#279989]/20 focus:border-[#279989]"
                      autoFocus
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div
            className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50"
            style={{
              padding: theme.footerPadding,
              borderBottomLeftRadius: theme.borderRadius,
              borderBottomRightRadius: theme.borderRadius,
            }}
          >
            {modal.buttons
              ?.sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((btn) => {
                const BtnIcon = btn.icon ? ICONS[btn.icon] : null
                return (
                  <button
                    key={btn.id}
                    onClick={() => handleButtonClick(btn)}
                    disabled={state.loading}
                    title={btn.tooltip}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      BUTTON_STYLES[btn.variant || 'outline']
                    }`}
                  >
                    {state.loading && btn.action === 'confirm' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      BtnIcon && btn.iconPosition !== 'right' && <BtnIcon className="w-4 h-4" />
                    )}
                    {btn.label}
                    {BtnIcon && btn.iconPosition === 'right' && <BtnIcon className="w-4 h-4" />}
                  </button>
                )
              })}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <ModalContext.Provider
      value={{
        showModal,
        showConfirm,
        showAlert,
        showSuccess,
        showError,
        showInput,
        closeModal,
      }}
    >
      {children}
      {renderModal()}
    </ModalContext.Provider>
  )
}

// Hook
export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export default useModal
