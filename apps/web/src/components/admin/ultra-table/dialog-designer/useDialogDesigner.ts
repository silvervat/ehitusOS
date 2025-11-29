'use client'

import { useState, useCallback } from 'react'

export interface DialogField {
  id: string
  columnKey: string
  columnType: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  defaultValue?: any
  width?: 'full' | 'half' | 'third'
  order: number
  validation?: {
    rules?: any[]
    customMessage?: string
  }
  conditions?: {
    showWhen?: any[]
    hideWhen?: any[]
  }
}

export interface DialogSection {
  id: string
  title?: string
  description?: string
  fields: DialogField[]
  layout: {
    type: 'vertical' | 'horizontal' | 'grid'
    columns?: number
    gap?: number
  }
  collapsed?: boolean
  collapsible?: boolean
  order: number
  conditions?: {
    showWhen?: any[]
    hideWhen?: any[]
  }
}

export interface DialogConfig {
  layout: {
    type: 'vertical' | 'horizontal' | 'tabs' | 'steps'
    gap?: number
  }
  sections: DialogSection[]
  theme?: 'rivest' | 'minimal' | 'custom'
  submitButton?: {
    label: string
    variant?: 'primary' | 'default' | 'destructive'
    icon?: string
  }
  cancelButton?: {
    label: string
    show?: boolean
  }
  validateOnChange?: boolean
  showErrors?: 'inline' | 'toast' | 'summary'
}

export function useDialogDesigner(initialConfig: DialogConfig) {
  const [config, setConfig] = useState<DialogConfig>(initialConfig)
  const [selectedSection, setSelectedSection] = useState<DialogSection | null>(null)
  const [selectedField, setSelectedField] = useState<DialogField | null>(null)
  const [history, setHistory] = useState<DialogConfig[]>([initialConfig])
  const [historyIndex, setHistoryIndex] = useState(0)

  const updateConfig = useCallback((newConfig: DialogConfig) => {
    setConfig(newConfig)
    // Add to history
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newConfig])
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  const addSection = useCallback((section: DialogSection) => {
    const newConfig = {
      ...config,
      sections: [...config.sections, { ...section, order: config.sections.length }],
    }
    updateConfig(newConfig)
  }, [config, updateConfig])

  const updateSection = useCallback((sectionId: string, updates: Partial<DialogSection>) => {
    const newConfig = {
      ...config,
      sections: config.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }
    updateConfig(newConfig)
    if (selectedSection?.id === sectionId) {
      setSelectedSection({ ...selectedSection, ...updates })
    }
  }, [config, updateConfig, selectedSection])

  const deleteSection = useCallback((sectionId: string) => {
    const newConfig = {
      ...config,
      sections: config.sections.filter(s => s.id !== sectionId),
    }
    updateConfig(newConfig)
    if (selectedSection?.id === sectionId) {
      setSelectedSection(null)
    }
  }, [config, updateConfig, selectedSection])

  const addField = useCallback((sectionId: string, field: DialogField) => {
    const newConfig = {
      ...config,
      sections: config.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: [...s.fields, { ...field, order: s.fields.length }] }
          : s
      ),
    }
    updateConfig(newConfig)
  }, [config, updateConfig])

  const updateField = useCallback((fieldId: string, updates: Partial<DialogField>) => {
    const newConfig = {
      ...config,
      sections: config.sections.map(s => ({
        ...s,
        fields: s.fields.map(f =>
          f.id === fieldId ? { ...f, ...updates } : f
        ),
      })),
    }
    updateConfig(newConfig)
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }, [config, updateConfig, selectedField])

  const deleteField = useCallback((fieldId: string) => {
    const newConfig = {
      ...config,
      sections: config.sections.map(s => ({
        ...s,
        fields: s.fields.filter(f => f.id !== fieldId),
      })),
    }
    updateConfig(newConfig)
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }, [config, updateConfig, selectedField])

  const moveField = useCallback((
    fieldId: string,
    fromSectionId: string,
    toSectionId: string,
    newIndex: number
  ) => {
    const fromSection = config.sections.find(s => s.id === fromSectionId)
    const field = fromSection?.fields.find(f => f.id === fieldId)

    if (!field) return

    const newConfig = {
      ...config,
      sections: config.sections.map(s => {
        if (s.id === fromSectionId) {
          return {
            ...s,
            fields: s.fields.filter(f => f.id !== fieldId),
          }
        }
        if (s.id === toSectionId) {
          const newFields = [...s.fields]
          newFields.splice(newIndex, 0, { ...field, order: newIndex })
          return {
            ...s,
            fields: newFields.map((f, i) => ({ ...f, order: i })),
          }
        }
        return s
      }),
    }
    updateConfig(newConfig)
  }, [config, updateConfig])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setConfig(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setConfig(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  return {
    config,
    selectedSection,
    selectedField,
    history,
    historyIndex,
    setSelectedSection,
    setSelectedField,
    updateConfig,
    addSection,
    updateSection,
    deleteSection,
    addField,
    updateField,
    deleteField,
    moveField,
    undo,
    redo,
  }
}

export function getDefaultDialogConfig(): DialogConfig {
  return {
    layout: {
      type: 'vertical',
      gap: 16,
    },
    sections: [],
    theme: 'rivest',
    submitButton: {
      label: 'Save',
      variant: 'primary',
    },
    cancelButton: {
      label: 'Cancel',
      show: true,
    },
    validateOnChange: true,
    showErrors: 'inline',
  }
}
