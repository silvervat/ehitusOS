import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/invoices - List all invoices
export async function GET(request: Request) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // sales, purchase
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('invoices')
      .select(
        '*, project:projects(id, name, code), company:companies(id, name)',
        { count: 'exact' }
      )
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    // Apply filters
    if (type) {
      query = query.eq('type', type)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.ilike('invoice_number', `%${search}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching invoices:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/invoices:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: Request) {
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

    // Get user's tenant_id from profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('tenant_id')
      .eq('auth_user_id', user.id)
      .single()

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.invoiceNumber || !body.issueDate || !body.dueDate) {
      return NextResponse.json(
        { error: 'Invoice number, issue date, and due date are required' },
        { status: 400 }
      )
    }

    // Calculate totals if line items provided
    let subtotal = parseFloat(body.subtotal) || 0
    let vatAmount = parseFloat(body.vatAmount) || 0
    let total = parseFloat(body.total) || 0

    if (body.lineItems && Array.isArray(body.lineItems)) {
      subtotal = body.lineItems.reduce(
        (sum: number, item: { quantity: number; unitPrice: number }) =>
          sum + (item.quantity || 0) * (item.unitPrice || 0),
        0
      )
      vatAmount = subtotal * 0.22 // 22% VAT for Estonia
      total = subtotal + vatAmount
    }

    // Create invoice
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        tenant_id: profile.tenant_id,
        invoice_number: body.invoiceNumber,
        type: body.type || 'sales',
        status: body.status || 'draft',
        project_id: body.projectId || null,
        company_id: body.companyId || null,
        issue_date: body.issueDate,
        due_date: body.dueDate,
        subtotal,
        vat_amount: vatAmount,
        total,
        currency: body.currency || 'EUR',
        paid_amount: body.paidAmount || 0,
        paid_at: body.paidAt || null,
        notes: body.notes || null,
        line_items: body.lineItems || [],
        metadata: body.metadata || {},
      })
      .select('*, project:projects(id, name, code), company:companies(id, name)')
      .single()

    if (error) {
      console.error('Error creating invoice:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Arve numbriga arve on juba olemas' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/invoices:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
