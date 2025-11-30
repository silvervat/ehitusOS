'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  LayoutTemplate,
  Filter,
} from 'lucide-react'
import { Button, Card, Input } from '@rivest/ui'
import {
  ModalTemplate,
  SYSTEM_MODALS,
  MODAL_CATEGORIES,
  MODAL_TYPES,
  IconType,
  generateId,
  defaultModalIcon,
  defaultModalContent,
  defaultModalTheme,
  defaultCancelButton,
  defaultConfirmButton,
} from './types'
import { ModalDesigner } from './modal-designer'

// Mock modals data - in production this would come from API
const getInitialModals = (): ModalTemplate[] => {
  return SYSTEM_MODALS.map((m, i) => ({
    id: `system-${i}`,
    tenantId: 'demo',
    key: m.key!,
    name: m.name!,
    description: m.description,
    type: m.type!,
    size: 'md',
    icon: m.icon || defaultModalIcon,
    content: m.content || defaultModalContent,
    buttons: m.buttons || [defaultCancelButton, defaultConfirmButton],
    inputs: [],
    theme: defaultModalTheme,
    isSystem: true,
    isActive: true,
    category: m.category || 'system',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })) as ModalTemplate[]
}

const getIconComponent = (iconType: IconType) => {
  switch (iconType) {
    case 'info':
      return Info
    case 'warning':
      return AlertTriangle
    case 'error':
      return AlertCircle
    case 'success':
      return CheckCircle
    case 'question':
      return HelpCircle
    default:
      return LayoutTemplate
  }
}

export function ModalList() {
  const [modals, setModals] = useState<ModalTemplate[]>(getInitialModals)
  const [selectedModal, setSelectedModal] = useState<ModalTemplate | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Filter modals
  const filteredModals = useMemo(() => {
    return modals.filter((modal) => {
      const matchesSearch =
        modal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        modal.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        modal.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || modal.category === selectedCategory
      const matchesType = selectedType === 'all' || modal.type === selectedType

      return matchesSearch && matchesCategory && matchesType
    })
  }, [modals, searchQuery, selectedCategory, selectedType])

  // Group modals by category
  const groupedModals = useMemo(() => {
    const groups: Record<string, ModalTemplate[]> = {}
    filteredModals.forEach((modal) => {
      if (!groups[modal.category]) {
        groups[modal.category] = []
      }
      groups[modal.category].push(modal)
    })
    return groups
  }, [filteredModals])

  const handleSaveModal = (modalData: Partial<ModalTemplate>) => {
    if (selectedModal) {
      // Update existing modal
      setModals(modals.map((m) => (m.id === selectedModal.id ? { ...m, ...modalData } as ModalTemplate : m)))
    } else {
      // Create new modal
      const newModal: ModalTemplate = {
        ...modalData,
        id: generateId(),
        tenantId: 'demo',
        isSystem: false,
        createdAt: new Date().toISOString(),
      } as ModalTemplate
      setModals([...modals, newModal])
    }
    setSelectedModal(null)
    setIsCreating(false)
  }

  const handleDeleteModal = (id: string) => {
    const modal = modals.find((m) => m.id === id)
    if (modal?.isSystem) {
      alert('Susteemi modaleid ei saa kustutada')
      return
    }
    if (confirm('Kas olete kindel, et soovite selle modali kustutada?')) {
      setModals(modals.filter((m) => m.id !== id))
    }
  }

  const handleDuplicateModal = (modal: ModalTemplate) => {
    const newModal: ModalTemplate = {
      ...modal,
      id: generateId(),
      key: `${modal.key}-copy`,
      name: `${modal.name} (koopia)`,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setModals([...modals, newModal])
  }

  // If editing/creating a modal, show the designer
  if (selectedModal || isCreating) {
    return (
      <ModalDesigner
        modal={selectedModal || undefined}
        onSave={handleSaveModal}
        onCancel={() => {
          setSelectedModal(null)
          setIsCreating(false)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Modalid</h2>
          <p className="text-sm text-slate-500">
            Halda ja kujunda koik rakenduse modalid
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#279989' }}
        >
          <Plus className="h-4 w-4" />
          Lisa modal
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Otsi modaleid..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#279989]/20 focus:border-[#279989]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option value="all">Koik kategooriad</option>
          {MODAL_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option value="all">Koik tuubid</option>
          {MODAL_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Modal List */}
      <div className="space-y-8">
        {Object.entries(groupedModals).map(([category, categoryModals]) => {
          const categoryLabel = MODAL_CATEGORIES.find((c) => c.id === category)?.label || category
          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {categoryLabel}
                <span className="text-slate-400 font-normal">({categoryModals.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryModals.map((modal) => {
                  const typeInfo = MODAL_TYPES.find((t) => t.value === modal.type)
                  const IconComponent = getIconComponent(modal.icon.type)

                  return (
                    <div
                      key={modal.id}
                      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: modal.icon.backgroundColor }}
                          >
                            <IconComponent
                              className="h-5 w-5"
                              style={{ color: modal.icon.color }}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{modal.name}</h4>
                            <p className="text-xs text-slate-500 font-mono">{modal.key}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {modal.isSystem && (
                            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                              Susteem
                            </span>
                          )}
                          <span
                            className="px-2 py-0.5 text-xs rounded text-white"
                            style={{ backgroundColor: typeInfo?.color }}
                          >
                            {typeInfo?.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {modal.content.title}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedModal(modal)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          Muuda
                        </button>
                        <button
                          onClick={() => handleDuplicateModal(modal)}
                          className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Kopeeri"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {!modal.isSystem && (
                          <button
                            onClick={() => handleDeleteModal(modal.id)}
                            className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Kustuta"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filteredModals.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <LayoutTemplate className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Modaleid ei leitud</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ModalList
