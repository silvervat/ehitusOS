'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Project {
  id: string
  code: string
  name: string
  description?: string
  clientId?: string
  client?: { id: string; name: string }
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'archived'
  budget?: number
  currency: string
  startDate?: string
  endDate?: string
  address?: string
  city?: string
  managerId?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectInput {
  code: string
  name: string
  description?: string
  clientId?: string
  status?: string
  budget?: number
  currency?: string
  startDate?: string
  endDate?: string
  address?: string
  city?: string
  country?: string
  managerId?: string
}

interface ProjectsResponse {
  data: Project[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects')

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Projektide laadimine ebaonnestus')
  }

  const result: ProjectsResponse = await response.json()
  return result.data
}

async function createProject(data: ProjectInput): Promise<Project> {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Projekti loomine ebaonnestus')
  }

  return response.json()
}

async function updateProject({ id, ...data }: ProjectInput & { id: string }): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Projekti uuendamine ebaonnestus')
  }

  return response.json()
}

async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Projekti kustutamine ebaonnestus')
  }
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
