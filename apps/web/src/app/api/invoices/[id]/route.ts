import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/invoices/[id] - Get a single invoice
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*, project:projects(id, name, code), company:companies(id, name)')
      .eq('id', params.id)
      .is('deleted_at', null)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
      }
      console.error('Error fetching invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/invoices/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH /api/invoices/[id] - Update an invoice
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Build update object (only include provided fields)
    const updateData: Record<string, unknown> = {}

    if (body.invoiceNumber !== undefined) updateData.invoice_number = body.invoiceNumber
    if (body.type !== undefined) updateData.type = body.type
    if (body.status !== undefined) updateData.status = body.status
    if (body.projectId !== undefined) updateData.project_id = body.projectId
    if (body.companyId !== undefined) updateData.company_id = body.companyId
    if (body.issueDate !== undefined) updateData.issue_date = body.issueDate
    if (body.dueDate !== undefined) updateData.due_date = body.dueDate
    if (body.subtotal !== undefined) updateData.subtotal = body.subtotal
    if (body.vatAmount !== undefined) updateData.vat_amount = body.vatAmount
    if (body.total !== undefined) updateData.total = body.total
    if (body.currency !== undefined) updateData.currency = body.currency
    if (body.paidAmount !== undefined) updateData.paid_amount = body.paidAmount
    if (body.paidAt !== undefined) updateData.paid_at = body.paidAt
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.lineItems !== undefined) updateData.line_items = body.lineItems
    if (body.metadata !== undefined) updateData.metadata = body.metadata

    // Recalculate totals if line items are updated
    if (body.lineItems && Array.isArray(body.lineItems)) {
      const subtotal = body.lineItems.reduce(
        (sum: number, item: { quantity: number; unitPrice: number }) =>
          sum + (item.quantity || 0) * (item.unitPrice || 0),
        0
      )
      updateData.subtotal = subtotal
      updateData.vat_amount = subtotal * 0.22
      updateData.total = subtotal + subtotal * 0.22
    }

    // Update invoice
    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', params.id)
      .is('deleted_at', null)
      .select('*, project:projects(id, name, code), company:companies(id, name)')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
      }
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Arve numbriga arve on juba olemas' },
          { status: 409 }
        )
      }
      console.error('Error updating invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PATCH /api/invoices/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE /api/invoices/[id] - Soft delete an invoice
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Soft delete by setting deleted_at
    const { error } = await supabase
      .from('invoices')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', params.id)
      .is('deleted_at', null)

    if (error) {
      console.error('Error deleting invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/invoices/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
