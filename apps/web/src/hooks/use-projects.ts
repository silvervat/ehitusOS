'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Project {
  id: string
  code: string
  name: string
  description?: string
  clientId?: string
  clientName?: string
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'archived'
  budget?: number
  currency: string
  startDate?: string
  endDate?: string
  address?: string
  city?: string
  managerId?: string
  managerName?: string
  createdAt: string
  updatedAt: string
}

// Mock data for demo
const mockProjects: Project[] = [
  {
    id: '1',
    code: 'PRJ-001',
    name: 'Tallinna Ärikeskus',
    description: 'Uue ärihoone ehitus Tallinna kesklinnas',
    clientName: 'Nordic Properties OÜ',
    status: 'active',
    budget: 1250000,
    currency: 'EUR',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    city: 'Tallinn',
    managerName: 'Mari Maasikas',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-11-28T15:30:00Z',
  },
  {
    id: '2',
    code: 'PRJ-002',
    name: 'Tartu Elamu',
    description: 'Kortermaja renoveerimine',
    clientName: 'Kodumaja AS',
    status: 'active',
    budget: 450000,
    currency: 'EUR',
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    city: 'Tartu',
    managerName: 'Jaan Juurikas',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-11-27T11:00:00Z',
  },
  {
    id: '3',
    code: 'PRJ-003',
    name: 'Pärnu Hotell',
    description: 'Hotelli laiendus ja renovatsioon',
    clientName: 'Hotel Group OÜ',
    status: 'draft',
    budget: 2100000,
    currency: 'EUR',
    startDate: '2024-06-01',
    endDate: '2025-06-30',
    city: 'Pärnu',
    managerName: 'Kati Kask',
    createdAt: '2024-05-15T14:00:00Z',
    updatedAt: '2024-11-26T16:00:00Z',
  },
  {
    id: '4',
    code: 'PRJ-004',
    name: 'Narva Tööstushall',
    description: 'Tootmishoone ehitus',
    clientName: 'Industrial Corp AS',
    status: 'completed',
    budget: 680000,
    currency: 'EUR',
    startDate: '2023-06-01',
    endDate: '2024-02-28',
    city: 'Narva',
    managerName: 'Peeter Paju',
    createdAt: '2023-05-01T08:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '5',
    code: 'PRJ-005',
    name: 'Viljandi Koolimaja',
    description: 'Koolihoone renoveerimine',
    clientName: 'Viljandi Linnavalitsus',
    status: 'on_hold',
    budget: 890000,
    currency: 'EUR',
    startDate: '2024-04-01',
    endDate: '2024-11-30',
    city: 'Viljandi',
    managerName: 'Liina Leht',
    createdAt: '2024-03-10T12:00:00Z',
    updatedAt: '2024-11-20T09:00:00Z',
  },
]

async function fetchProjects(): Promise<Project[]> {
  // TODO: Replace with actual API call when Supabase is connected
  // const response = await fetch('/api/projects')
  // return response.json()

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockProjects
}

async function createProject(data: Partial<Project>): Promise<Project> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 300))

  const newProject: Project = {
    id: String(Date.now()),
    code: `PRJ-${String(mockProjects.length + 1).padStart(3, '0')}`,
    name: data.name || 'Uus projekt',
    status: 'draft',
    currency: 'EUR',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  }

  mockProjects.push(newProject)
  return newProject
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
