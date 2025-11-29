'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, closestCenter } from '@dnd-kit/core'
import { Button, Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@rivest/ui'
import { Save, Eye, Code, Undo, Redo, X } from 'lucide-react'
import { FieldToolbar } from './FieldToolbar'
import { DesignerCanvas } from './DesignerCanvas'
import { PropertiesPanel } from './PropertiesPanel'
import { PreviewDialog } from './PreviewDialog'
import { useDialogDesigner, getDefaultDialogConfig, type DialogConfig, type DialogField, type DialogSection } from './useDialogDesigner'

interface UltraDialog {
  id: string
  name: string
  tableId: string
  config: DialogConfig
}

interface DialogDesignerProps {
  tableId: string
  dialog?: UltraDialog
  onSave: (config: DialogConfig) => Promise<void>
  onClose?: () => void
}

export function DialogDesigner({ tableId, dialog, onSave, onClose }: DialogDesignerProps) {
  const {
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
  } = useDialogDesigner(dialog?.config || getDefaultDialogConfig())

  const [showPreview, setShowPreview] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(config)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    // Dropping a field onto a section
    if (activeData?.type === 'field' && overData?.type === 'section') {
      const sectionId = overData.sectionId
      const columnType = activeData.columnType

      const newField: DialogField = {
        id: `field_${Date.now()}`,
        columnKey: `field_${columnType}_${Date.now()}`,
        columnType,
        label: '',
        placeholder: '',
        required: false,
        disabled: false,
        hidden: false,
        width: 'full',
        order: 0,
      }

      addField(sectionId, newField)
    }

    // Dropping a layout element onto a section
    if (activeData?.type === 'layout' && overData?.type === 'section') {
      // Handle layout elements (divider, heading, etc.)
      const layoutType = activeData.layoutType
      // For now, we'll treat layout elements as special fields
      const newField: DialogField = {
        id: `layout_${Date.now()}`,
        columnKey: `layout_${layoutType}_${Date.now()}`,
        columnType: layoutType,
        label: layoutType === 'heading' ? 'Heading' : '',
        order: 0,
      }

      addField(overData.sectionId, newField)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Dialog Designer</h1>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={undo}
              disabled={historyIndex === 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={redo}
              disabled={historyIndex === history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCode(true)}>
            <Code className="h-4 w-4 mr-1" />
            View Code
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#279989] hover:bg-[#1f7a6e]"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save Dialog'}
          </Button>
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left - Field Toolbar */}
        <div className="w-64 border-r bg-white overflow-y-auto">
          <FieldToolbar tableId={tableId} onAddField={addField} />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 bg-muted/30 overflow-auto p-8">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <DesignerCanvas
              config={config}
              selectedSection={selectedSection}
              selectedField={selectedField}
              onSelectSection={setSelectedSection}
              onSelectField={setSelectedField}
              onAddSection={addSection}
              onUpdateSection={updateSection}
              onDeleteSection={deleteSection}
              onUpdateField={updateField}
              onDeleteField={deleteField}
            />

            <DragOverlay>
              {/* Render dragging field preview */}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Right - Properties Panel */}
        <div className="w-80 border-l bg-white overflow-y-auto">
          <PropertiesPanel
            selectedSection={selectedSection}
            selectedField={selectedField}
            onUpdateSection={updateSection}
            onUpdateField={updateField}
          />
        </div>
      </div>

      {/* Preview Dialog */}
      {showPreview && (
        <PreviewDialog
          config={config}
          tableId={tableId}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Code View Dialog */}
      {showCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCode(false)}
          />
          <Card className="relative z-10 w-full max-w-3xl max-h-[80vh] overflow-auto m-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Dialog Configuration</h2>
              <Button size="sm" variant="ghost" onClick={() => setShowCode(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(config, null, 2)}
            </pre>
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(config, null, 2))
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
