'use client'

import { useState, useCallback } from 'react'
import {
  Save,
  Eye,
  EyeOff,
  Palette,
  Settings,
  LayoutTemplate,
  Plus,
  Trash2,
  GripVertical,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  X,
  Edit,
  FileText,
} from 'lucide-react'
import { Button, Card, Input, Label } from '@rivest/ui'
import {
  ModalTemplate,
  ModalButton,
  ModalIcon,
  ModalTheme,
  ModalContent,
  ModalType,
  ModalSize,
  ButtonVariant,
  IconType,
  defaultModalIcon,
  defaultModalContent,
  defaultModalTheme,
  defaultConfirmButton,
  defaultCancelButton,
  MODAL_TYPES,
  MODAL_CATEGORIES,
  generateId,
} from './types'

interface ModalDesignerProps {
  modal?: ModalTemplate
  onSave?: (modal: Partial<ModalTemplate>) => void
  onCancel?: () => void
}

const ICON_OPTIONS: { value: IconType; label: string; icon: React.ElementType }[] = [
  { value: 'none', label: 'Puudub', icon: X },
  { value: 'info', label: 'Info', icon: Info },
  { value: 'warning', label: 'Hoiatus', icon: AlertTriangle },
  { value: 'error', label: 'Viga', icon: AlertCircle },
  { value: 'success', label: 'Edu', icon: CheckCircle },
  { value: 'question', label: 'Kusimus', icon: HelpCircle },
  { value: 'trash', label: 'Kustuta', icon: Trash2 },
  { value: 'save', label: 'Salvesta', icon: Save },
  { value: 'edit', label: 'Muuda', icon: Edit },
  { value: 'plus', label: 'Lisa', icon: Plus },
]

const SIZE_OPTIONS: { value: ModalSize; label: string }[] = [
  { value: 'sm', label: 'Vaike (320px)' },
  { value: 'md', label: 'Keskmine (448px)' },
  { value: 'lg', label: 'Suur (512px)' },
  { value: 'xl', label: 'Ekstra suur (640px)' },
  { value: 'full', label: 'Taisekraan' },
]

const BUTTON_VARIANTS: { value: ButtonVariant; label: string; color: string }[] = [
  { value: 'primary', label: 'Primary', color: '#279989' },
  { value: 'secondary', label: 'Secondary', color: '#64748b' },
  { value: 'outline', label: 'Outline', color: '#e2e8f0' },
  { value: 'ghost', label: 'Ghost', color: 'transparent' },
  { value: 'destructive', label: 'Destructive', color: '#ef4444' },
  { value: 'success', label: 'Success', color: '#22c55e' },
]

export function ModalDesigner({ modal, onSave, onCancel }: ModalDesignerProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'buttons' | 'theme' | 'settings'>('content')
  const [previewMode, setPreviewMode] = useState(false)

  // Modal state
  const [name, setName] = useState(modal?.name || 'Uus modal')
  const [key, setKey] = useState(modal?.key || '')
  const [description, setDescription] = useState(modal?.description || '')
  const [type, setType] = useState<ModalType>(modal?.type || 'confirmation')
  const [size, setSize] = useState<ModalSize>(modal?.size || 'md')
  const [category, setCategory] = useState(modal?.category || 'custom')
  const [icon, setIcon] = useState<ModalIcon>(modal?.icon || defaultModalIcon)
  const [content, setContent] = useState<ModalContent>(modal?.content || defaultModalContent)
  const [buttons, setButtons] = useState<ModalButton[]>(
    modal?.buttons || [defaultCancelButton, defaultConfirmButton]
  )
  const [theme, setTheme] = useState<ModalTheme>(modal?.theme || defaultModalTheme)

  // Auto-generate key from name
  const handleNameChange = (newName: string) => {
    setName(newName)
    if (!modal?.key) {
      const newKey = newName
        .toLowerCase()
        .replace(/[aouõ]/g, (c) => ({ a: 'a', o: 'o', u: 'u', o: 'o' }[c] || c))
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setKey(newKey)
    }
  }

  // Button management
  const addButton = () => {
    const newButton: ModalButton = {
      id: generateId(),
      label: 'Uus nupp',
      variant: 'outline',
      action: 'custom',
      order: buttons.length + 1,
    }
    setButtons([...buttons, newButton])
  }

  const updateButton = (id: string, updates: Partial<ModalButton>) => {
    setButtons(buttons.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const removeButton = (id: string) => {
    setButtons(buttons.filter((b) => b.id !== id))
  }

  const handleSave = () => {
    const modalData: Partial<ModalTemplate> = {
      id: modal?.id || generateId(),
      key,
      name,
      description,
      type,
      size,
      category,
      icon,
      content,
      buttons,
      theme,
      isSystem: modal?.isSystem || false,
      isActive: true,
      tags: [],
      updatedAt: new Date().toISOString(),
    }
    onSave?.(modalData)
  }

  const getIconComponent = (iconType: IconType) => {
    const iconDef = ICON_OPTIONS.find((i) => i.value === iconType)
    return iconDef?.icon || Info
  }

  const IconComponent = getIconComponent(icon.type)

  const tabs = [
    { id: 'content', label: 'Sisu', icon: FileText },
    { id: 'buttons', label: 'Nupud', icon: LayoutTemplate },
    { id: 'theme', label: 'Teema', icon: Palette },
    { id: 'settings', label: 'Seaded', icon: Settings },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="text-lg font-semibold w-64 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#279989]/20 focus:border-[#279989]"
          />
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            {previewMode ? (
              <>
                <EyeOff className="h-4 w-4" />
                Sulge
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Eelvaade
              </>
            )}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Tuhista
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#279989' }}
          >
            <Save className="h-4 w-4" />
            Salvesta
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && (
            <div className="max-w-xl space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Modali sisu</h2>

              {/* Icon Settings */}
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-700">Ikoon</h3>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setIcon({ ...icon, type: opt.value })}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                        icon.type === opt.value
                          ? 'border-[#279989] bg-[#279989]/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <opt.icon className="h-5 w-5" />
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Ikooni varv</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={icon.color}
                        onChange={(e) => setIcon({ ...icon, color: e.target.value })}
                        className="w-12 h-10 p-1 border border-slate-300 rounded-lg cursor-pointer"
                      />
                      <Input value={icon.color} onChange={(e) => setIcon({ ...icon, color: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Taustavarv</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={icon.backgroundColor.replace(/[0-9a-f]{2}$/i, '')}
                        onChange={(e) => setIcon({ ...icon, backgroundColor: e.target.value + '20' })}
                        className="w-12 h-10 p-1 border border-slate-300 rounded-lg cursor-pointer"
                      />
                      <Input
                        value={icon.backgroundColor}
                        onChange={(e) => setIcon({ ...icon, backgroundColor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Pealkiri</Label>
                  <Input
                    value={content.title}
                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                    placeholder="Modali pealkiri"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Suurus</Label>
                    <select
                      value={content.titleSize}
                      onChange={(e) => setContent({ ...content, titleSize: e.target.value as 'sm' | 'md' | 'lg' | 'xl' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="sm">Vaike</option>
                      <option value="md">Keskmine</option>
                      <option value="lg">Suur</option>
                      <option value="xl">Ekstra suur</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Joondus</Label>
                    <select
                      value={content.titleAlign}
                      onChange={(e) => setContent({ ...content, titleAlign: e.target.value as 'left' | 'center' | 'right' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="left">Vasakul</option>
                      <option value="center">Keskel</option>
                      <option value="right">Paremal</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Varv</Label>
                    <input
                      type="color"
                      value={content.titleColor}
                      onChange={(e) => setContent({ ...content, titleColor: e.target.value })}
                      className="w-full h-10 p-1 border border-slate-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Sonumi tekst</Label>
                  <textarea
                    value={content.message}
                    onChange={(e) => setContent({ ...content, message: e.target.value })}
                    placeholder="Modali sisu tekst..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#279989]/20 focus:border-[#279989]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>Suurus</Label>
                    <select
                      value={content.messageSize}
                      onChange={(e) => setContent({ ...content, messageSize: e.target.value as 'sm' | 'md' | 'lg' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="sm">Vaike</option>
                      <option value="md">Keskmine</option>
                      <option value="lg">Suur</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Joondus</Label>
                    <select
                      value={content.messageAlign}
                      onChange={(e) => setContent({ ...content, messageAlign: e.target.value as 'left' | 'center' | 'right' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="left">Vasakul</option>
                      <option value="center">Keskel</option>
                      <option value="right">Paremal</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Varv</Label>
                    <input
                      type="color"
                      value={content.messageColor}
                      onChange={(e) => setContent({ ...content, messageColor: e.target.value })}
                      className="w-full h-10 p-1 border border-slate-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'buttons' && (
            <div className="max-w-xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Nupud</h2>
                <button
                  onClick={addButton}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#279989] hover:bg-[#279989]/10 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Lisa nupp
                </button>
              </div>

              <div className="space-y-4">
                {buttons
                  .sort((a, b) => a.order - b.order)
                  .map((button, index) => (
                    <div
                      key={button.id}
                      className="p-4 border border-slate-200 rounded-lg space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
                          <span className="text-sm font-medium">Nupp {index + 1}</span>
                        </div>
                        <button
                          onClick={() => removeButton(button.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Tekst</Label>
                          <Input
                            value={button.label}
                            onChange={(e) => updateButton(button.id, { label: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Stiil</Label>
                          <select
                            value={button.variant}
                            onChange={(e) => updateButton(button.id, { variant: e.target.value as ButtonVariant })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            {BUTTON_VARIANTS.map((v) => (
                              <option key={v.value} value={v.value}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Tegevus</Label>
                          <select
                            value={button.action}
                            onChange={(e) => updateButton(button.id, { action: e.target.value as 'confirm' | 'cancel' | 'custom' })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="confirm">Kinnita</option>
                            <option value="cancel">Tuhista</option>
                            <option value="custom">Kohandatud</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label>Ikoon</Label>
                          <select
                            value={button.icon || 'none'}
                            onChange={(e) => updateButton(button.id, { icon: e.target.value as IconType })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          >
                            {ICON_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label>Tooltip (hover info)</Label>
                        <Input
                          value={button.tooltip || ''}
                          onChange={(e) => updateButton(button.id, { tooltip: e.target.value })}
                          placeholder="Tekst, mis ilmub hoverdamisel"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="max-w-xl space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Teema seaded</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Taustavarv</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={theme.backgroundColor}
                      onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                      className="w-12 h-10 p-1 border border-slate-300 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={theme.backgroundColor}
                      onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Overlay varv</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={theme.overlayColor}
                      onChange={(e) => setTheme({ ...theme, overlayColor: e.target.value })}
                      className="w-12 h-10 p-1 border border-slate-300 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={theme.overlayColor}
                      onChange={(e) => setTheme({ ...theme, overlayColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Overlay labipaistmatus (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={theme.overlayOpacity}
                    onChange={(e) => setTheme({ ...theme, overlayOpacity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Nurkade umarus (px)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={32}
                    value={theme.borderRadius}
                    onChange={(e) => setTheme({ ...theme, borderRadius: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Padding (px)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={64}
                    value={theme.padding}
                    onChange={(e) => setTheme({ ...theme, padding: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Vari</Label>
                  <select
                    value={theme.shadow}
                    onChange={(e) => setTheme({ ...theme, shadow: e.target.value as typeof theme.shadow })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="none">Puudub</option>
                    <option value="sm">Vaike</option>
                    <option value="md">Keskmine</option>
                    <option value="lg">Suur</option>
                    <option value="xl">Ekstra suur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Animatsioon</Label>
                  <select
                    value={theme.animation}
                    onChange={(e) => setTheme({ ...theme, animation: e.target.value as typeof theme.animation })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="none">Puudub</option>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="scale">Scale</option>
                    <option value="bounce">Bounce</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Animatsiooni kestvus (ms)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={1000}
                    step={50}
                    value={theme.animationDuration}
                    onChange={(e) => setTheme({ ...theme, animationDuration: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">Modali seaded</h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Modali voti (key)</Label>
                  <Input
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="modal-key"
                    className="font-mono"
                  />
                  <p className="text-xs text-slate-500">Unikaalne voti programmaatiliseks kasutamiseks</p>
                </div>

                <div className="space-y-1">
                  <Label>Kirjeldus</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Modali kirjeldus..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Tuup</Label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as ModalType)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      {MODAL_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Suurus</Label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value as ModalSize)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Kategooria</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    {MODAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.showCloseButton}
                      onChange={(e) => setContent({ ...content, showCloseButton: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#279989]"
                    />
                    <span className="text-sm text-slate-700">Naita sulgemise nuppu (X)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.closeOnOverlayClick}
                      onChange={(e) => setContent({ ...content, closeOnOverlayClick: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#279989]"
                    />
                    <span className="text-sm text-slate-700">Sulge overlay klikimisel</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.closeOnEscape}
                      onChange={(e) => setContent({ ...content, closeOnEscape: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#279989]"
                    />
                    <span className="text-sm text-slate-700">Sulge Escape klahviga</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Panel */}
        <div className="w-[400px] border-l border-slate-200 bg-slate-100 p-6 overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Eelvaade</h3>

          {/* Modal Preview */}
          <div
            className="relative rounded-lg overflow-hidden"
            style={{
              backgroundColor: theme.overlayColor,
              opacity: theme.overlayOpacity / 100 + 0.5,
              minHeight: '300px',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div
                className="w-full"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderRadius: theme.borderRadius,
                  boxShadow:
                    theme.shadow === 'none'
                      ? 'none'
                      : theme.shadow === 'sm'
                      ? '0 1px 2px rgba(0,0,0,0.05)'
                      : theme.shadow === 'md'
                      ? '0 4px 6px rgba(0,0,0,0.1)'
                      : theme.shadow === 'lg'
                      ? '0 10px 15px rgba(0,0,0,0.1)'
                      : '0 20px 25px rgba(0,0,0,0.15)',
                }}
              >
                {/* Close button */}
                {content.showCloseButton && (
                  <button className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                )}

                {/* Content */}
                <div style={{ padding: theme.padding }}>
                  {/* Icon */}
                  {icon.type !== 'none' && (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: icon.backgroundColor }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: icon.color }} />
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className={`font-semibold mb-2 ${
                      content.titleSize === 'sm'
                        ? 'text-base'
                        : content.titleSize === 'md'
                        ? 'text-lg'
                        : content.titleSize === 'lg'
                        ? 'text-xl'
                        : 'text-2xl'
                    }`}
                    style={{
                      color: content.titleColor,
                      textAlign: content.titleAlign,
                    }}
                  >
                    {content.title}
                  </h3>

                  {/* Message */}
                  <p
                    className={
                      content.messageSize === 'sm'
                        ? 'text-sm'
                        : content.messageSize === 'md'
                        ? 'text-base'
                        : 'text-lg'
                    }
                    style={{
                      color: content.messageColor,
                      textAlign: content.messageAlign,
                    }}
                  >
                    {content.message}
                  </p>
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
                  {buttons
                    .sort((a, b) => a.order - b.order)
                    .map((btn) => {
                      const variant = BUTTON_VARIANTS.find((v) => v.value === btn.variant)
                      return (
                        <button
                          key={btn.id}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            btn.variant === 'outline'
                              ? 'border border-slate-300 hover:bg-slate-50'
                              : btn.variant === 'ghost'
                              ? 'hover:bg-slate-100'
                              : 'text-white'
                          }`}
                          style={{
                            backgroundColor:
                              btn.variant === 'outline' || btn.variant === 'ghost'
                                ? 'transparent'
                                : variant?.color,
                          }}
                          title={btn.tooltip}
                        >
                          {btn.label}
                        </button>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalDesigner
