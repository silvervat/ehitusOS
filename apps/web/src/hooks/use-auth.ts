'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  tenantId: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  role: string
  permissions: string[]
  settings: Record<string, unknown>
}

interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  })

  const supabase = createClient()

  // Fetch user profile from user_profiles table
  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('auth_user_id', userId)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          return null
        }

        return {
          id: data.id,
          tenantId: data.tenant_id,
          email: data.email,
          fullName: data.full_name,
          avatarUrl: data.avatar_url,
          role: data.role,
          permissions: data.permissions || [],
          settings: data.settings || {},
        } as UserProfile
      } catch (error) {
        console.error('Error fetching profile:', error)
        return null
      }
    },
    [supabase]
  )

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: error.message,
          })
          return
        }

        if (user) {
          const profile = await fetchProfile(user.id)
          setState({
            user,
            profile,
            loading: false,
            error: null,
          })
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: 'Failed to initialize auth',
        })
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({
          user: session.user,
          profile,
          loading: false,
          error: null,
        })
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: null,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }, [supabase, router])

  // Check if user has specific role
  const hasRole = useCallback(
    (role: string | string[]) => {
      if (!state.profile) return false
      const roles = Array.isArray(role) ? role : [role]
      return roles.includes(state.profile.role)
    },
    [state.profile]
  )

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permission: string) => {
      if (!state.profile) return false
      // Admins and superadmins have all permissions
      if (['admin', 'superadmin'].includes(state.profile.role)) return true
      return state.profile.permissions.includes(permission)
    },
    [state.profile]
  )

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole(['admin', 'superadmin'])
  }, [hasRole])

  return {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    signOut,
    hasRole,
    hasPermission,
    isAdmin,
    isAuthenticated: !!state.user,
  }
}
