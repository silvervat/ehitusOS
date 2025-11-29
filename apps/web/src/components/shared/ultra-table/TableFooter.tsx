'use client'

import React from 'react'
import { getColumnType } from '@/lib/ultra-table/column-types/registry'
import type { UltraTableColumn, UltraTableRow, ColumnType } from '@/types/ultra-table'

interface TableFooterProps {
  columns: UltraTableColumn[]
  rows: UltraTableRow[]
  aggregations: Record<string, any>
}

export const TableFooter = React.memo(function TableFooter({
  columns,
  rows,
  aggregations,
}: TableFooterProps) {
  return (
    <tfoot className="bg-muted/30 border-t sticky bottom-0">
      <tr>
        {/* Empty cell for checkbox column */}
        <td className="px-4 py-2 text-sm text-muted-foreground">
          {rows.length.toLocaleString()} rows
        </td>

        {/* Aggregation cells */}
        {columns.filter(col => col.visible).map(column => {
          const columnType = getColumnType(column.type as ColumnType)
          const agg = aggregations[column.key]
          const supportedAggs = columnType.supportedAggregations || []

          // Show most relevant aggregation
          let displayValue: string | null = null

          if (supportedAggs.includes('sum') && agg?.sum != null) {
            displayValue = `Σ ${formatNumber(agg.sum)}`
          } else if (supportedAggs.includes('avg') && agg?.avg != null) {
            displayValue = `Ø ${formatNumber(agg.avg)}`
          } else if (supportedAggs.includes('count')) {
            displayValue = `${agg?.count || 0} items`
          }

          return (
            <td
              key={column.id}
              className="px-4 py-2 text-sm text-muted-foreground"
              style={{ width: column.width ? `${column.width}px` : 'auto' }}
            >
              {displayValue}
            </td>
          )
        })}
      </tr>
    </tfoot>
  )
})

function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toLocaleString('et-EE', { maximumFractionDigits: 2 })
}
