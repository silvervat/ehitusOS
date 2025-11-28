'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  settings: Record<string, unknown>
  features: Record<string, boolean>
  maxUsers: number
  maxProjects: number
  status: string
  subscriptionTier: string
}

interface TenantContextValue {
  tenant: Tenant | null
  isLoading: boolean
  refresh: () => Promise<void>
}

const defaultTenant: Tenant = {
  id: 'demo',
  name: 'Rivest Demo',
  slug: 'demo',
  primaryColor: '#279989',
  secondaryColor: '#333F48',
  settings: {},
  features: {
    gantt_view: true,
    pdf_export: true,
    xlsx_import: true,
    custom_fields: true,
  },
  maxUsers: 50,
  maxProjects: 100,
  status: 'active',
  subscriptionTier: 'pro',
}

const TenantContext = createContext<TenantContextValue | null>(null)

export function TenantProvider({
  tenant: initialTenant,
  children,
}: {
  tenant?: Tenant | null
  children: ReactNode
}) {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant || defaultTenant)
  const [isLoading, setIsLoading] = useState(false)

  // Apply tenant branding to CSS variables
  useEffect(() => {
    if (!tenant) return

    const root = document.documentElement
    root.style.setProperty('--color-primary', tenant.primaryColor)
    root.style.setProperty('--color-secondary', tenant.secondaryColor)
  }, [tenant])

  const refresh = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tenant/current')
      if (response.ok) {
        const data = await response.json()
        setTenant(data)
      }
    } catch (error) {
      console.error('Failed to refresh tenant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TenantContext.Provider value={{ tenant, isLoading, refresh }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)

  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }

  return context
}
