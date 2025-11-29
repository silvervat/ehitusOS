'use client'

import React, { useState, useCallback } from 'react'
import { getColumnType } from '@/lib/ultra-table/column-types/registry'
import type { UltraTableColumn, UltraTableRow, ColumnType } from '@/types/ultra-table'

interface DynamicCellProps {
  column: UltraTableColumn
  value: any
  row: UltraTableRow
  onChange: (value: any) => void
}

export const DynamicCell = React.memo(function DynamicCell({
  column,
  value,
  row,
  onChange,
}: DynamicCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const columnType = getColumnType(column.type as ColumnType)

  const handleDoubleClick = useCallback(() => {
    if (columnType.isReadOnly) return
    setIsEditing(true)
  }, [columnType.isReadOnly])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
  }, [])

  const handleChange = useCallback((newValue: any) => {
    onChange(newValue)
    setIsEditing(false)
  }, [onChange])

  // Use the column type's CellRenderer
  const CellRenderer = columnType.CellRenderer

  return (
    <div
      className="min-h-[24px]"
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    >
      <CellRenderer
        value={value}
        column={column}
        row={row}
        isEditing={isEditing}
        onChange={handleChange}
      />
    </div>
  )
})
